"""Employer model."""

from datetime import datetime, timedelta
from io import BytesIO
import time
import uuid
from flask import redirect, request, jsonify, session
import pandas as pd
from core import database, email_handler
from logs.models import Log

employers_cache = {"data": None, "last_updated": None}


class Employers:
    """Employer class."""
    def search_employers(self):
        """Searching employers."""
        data = request.get_json()
        # Build the query with AND logic
        query = {}
        if data.get("company_name"):
            query["company_name"]  = {
            "$regex": data["company_name"],
            "$options": "i"  # Case-insensitive
        }

        employers = list(database.employers_collection.find(query))

        if employers:
            return jsonify(employers), 200

        return jsonify({"error": "No employers found"}), 404

    def start_session(self):
        """Starts a session."""
        session["employer_logged_in"] = True
        return redirect("/employers/home")

    def register_employer(self):
        """Adding new employer."""

        company_name = request.form.get("company_name")
        email = request.form.get("email")
        
        employer = {
            "_id": uuid.uuid1().hex,
            "company_name": company_name,
            "email": email,
        }

        if database.employers_collection.find_one({"email": email}):
            Log().add_log(f"Attempt to add duplicate employer with email: {email}", "admin action")
            return jsonify({"error": "Employer already in database"}), 400

        database.employers_collection.insert_one(employer)
        if employer:
            # Include admin username in the log if available in session
            admin_info = ""
            if "user" in session and session["user"] and "name" in session["user"]:
                admin_info = f" by admin: {session['user']['name']}"
            
            # Log the successful addition of a new employer
            Log().add_log(f"New employer added: '{company_name}' (Email: {email}){admin_info}", "admin action")
            return jsonify(employer), 200

        return jsonify({"error": "Employer not added"}), 400

    def get_company_name(self, _id):
        """Get company name"""
        employer = database.employers_collection.find_one({"_id": _id})
        if not employer:
            return ""

        return employer["company_name"]

    def employer_login(self):
        """Logs in the employer."""
        session.clear()
        employer = database.employers_collection.find_one(
            {"email": request.form.get("email")}
        )
        if employer:
            email_handler.send_otp(employer["email"])
            session["employer"] = employer
            return jsonify({"success": True, "message": "OTP sent"}), 200
        else:
            return jsonify({
                "success": False, 
                "message": "Email not registered. Please contact administrator."
            }), 404

    def get_employers(self):
        """Gets all employers."""
        if employers_cache["data"] and datetime.now() - employers_cache[
            "last_updated"
        ] < timedelta(minutes=5):
            return employers_cache["data"]

        employers = list(database.employers_collection.find())
        employers_cache["data"] = employers
        employers_cache["last_updated"] = datetime.now()
        return employers

    def get_employer_by_id(self, employer_id):
        """Gets an employer by ID."""
        employers = self.get_employers()

        for employer in employers:
            if employer["_id"] == employer_id:
                return employer

        return None

    def rank_preferences(self, opportunity_id):
        """Sets a students preferences."""
        opportunity = database.opportunities_collection.find_one(
            {"_id": opportunity_id}
        )

        if not opportunity:
            return jsonify({"error": "Opportunity not found"}), 404

        preferences = [a[5:] for a in request.form.get("ranks").split(",")]
        database.students_collection.update_one(
            {"_id": opportunity_id}, {"$set": {"preferences": preferences}}
        )
        return jsonify({"message": "Preferences updated"}), 200

    def get_company_email_by_id(self, _id):
        """Get company email by id"""
        employer = database.employers_collection.find_one({"_id": _id})
        if not employer:
            return ""
        return employer["email"]
    
    def delete_company_by_id(self, _id):
        """Deleting employer."""
        employer = database.employers_collection.find_one({"_id": str(_id)})

        if employer:
            company_name = employer.get("company_name", "Unknown company")
            database.employers_collection.delete_one({"_id": str(_id)})
            log_message = f"Employer '{company_name}' (ID: {_id}) was deleted"
            Log().add_log(log_message, "employer")
            return jsonify({"message": "Employer deleted"}), 200

        return jsonify({"error": "Employer not found"}), 404
    
    def generate_excel_file(self):
        try:
            employers = list(database.employers_collection.find())

            for employer in employers:
                employer['_id'] = str(employer['_id'])
                # Convert module IDs to names
          
            df = pd.DataFrame(employers)

            output = BytesIO()

            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Employer-Data')
            
            output.seek(0)
            return output
        except Exception as e:
            print(f"Error in generate_excel_file: {str(e)}")
            raise

    def update_employer_by_id(self, employer_id, is_employer =True):
        updated_data=''
        if request.is_json:
            updated_data = request.get_json()
        employer = database.employers_collection.find_one({"_id": str(employer_id)})

        if employer and not is_employer:
            database.employers_collection.update_one(
                {"_id": str(employer_id)}, {"$set": request.form}
            )
            return jsonify({"message": "Employer updated"}), 200

        if "employer" not in session and "user" not in session and "employer" not in session:
            return jsonify({"error": "You are not logged in"}), 401
        if "employer" in session:
            if (
                    is_employer
                    and str(employer["_id"]) != session["employer"]["employer_id"]
            ):
                return (
                    jsonify({"error": "You are not authorized to update this employer"}),
                    403,
                )
        if request.form.get("company_name"):
            employer["company_name"] = request.form.get("company_name")
        if request.form.get("email"):
            employer["email"] = request.form.get("email")

        if employer and is_employer:
            database.employers_collection.update_one(
                {"_id": str(employer_id)}, {"$set": is_employer}
            )
            return jsonify({"message": "Employer updated"}), 200

        if not is_employer:
            database.employers_collection.delete_one({"_id": employer_id})
            database.employers_collection.insert_one(request.form)
            return jsonify({"message": "Employer updated"}), 200

        return jsonify({"error": "Employer not found"}), 404