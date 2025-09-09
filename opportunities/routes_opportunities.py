"""Routes for opportunities"""

import uuid
import datetime
from flask import flash, redirect, render_template, request, session, url_for, jsonify,send_file
from core import database, handlers
from course_modules.models import Module
from courses.models import Course
from employers.models import Employers
from .models import Opportunity
from logs.models import Log
from core import database

def add_opportunities_routes(app):
    """Add routes for opportunities"""

    @app.route("/opportunities/search", methods=["GET", "POST"])
    @handlers.admin_or_employers_required
    def search_opportunities():
        """
        Unified route for searching opportunities by admins and employers.
        Determines user type from session.
        """
        # Fetch user session details
        user = session.get("user")
        employer = session.get("employer")
        student_deadline = database.get_student_ranking_deadline()

        # Determine user_type based on session data
        user_type = None
        if user:
            user_type = "admin"
        elif employer:
            user_type = "employer"

        print(f"[DEBUG] User type: {user_type}")
        if user_type is None:
            return {"error": "Unauthorized access."}, 403

        if request.method == "POST":
            data = request.get_json()  # Get the JSON data from the request

            title = data.get("title")
            if user_type == "admin":
                company_name = data.get("company")
                print("Admin - Method POST")
                return Opportunity().search_opportunities(title, company_name)
            else:
                print("Employer - Method POST")
                return Opportunity().search_opportunities(
                    title, employer["company_name"]
                )

        # For GET requests
        if user_type == "admin":
            print("Admin - Method GET")
            opportunities = Opportunity().search_opportunities(
                title="", company_name=""
            )
            employers_map = {
                employer["_id"]: employer
                for employer in list(Employers().get_employers())
            }
            return render_template(
                "opportunities/search.html",
                opportunities=opportunities,
                employers_map=employers_map,
                user_type=user_type,
                student_deadline=student_deadline,
                employer_deadline=database.get_opportunities_ranking_deadline(),
                current_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                
            )
        elif user_type == "employer":
            print("Employer - Method GET")
            opportunities = Opportunity().search_opportunities(
                title="", company_name=employer["company_name"]
            )
            return render_template(
                "opportunities/search.html",
                opportunities=opportunities,
                user_type=user_type,
                student_deadline=student_deadline,
                employer_deadline=database.get_opportunities_ranking_deadline(),
                current_time=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            )
    @app.route('/opportunities/download_opportunities_excel', methods=['GET'])
    @handlers.admin_or_employers_required
    def download_opportunities_excel():
            try:
                excel_file = Opportunity().generate_excel_file()

                
                return send_file(
                    excel_file,
                    download_name='opportunities.xlsx', 
                    as_attachment=True,  
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                )
            except Exception as e:
                
                return f"Error while generating Excel file: {str(e)}", 500
    @app.route('/opportunities/delete_all', methods=['DELETE'])
    def delete_all_opportunities():
        try:
            database.opportunities_collection.delete_many({})
            Log().add_log("All opportunities were deleted", "opportunity")
            return jsonify({"message": "All opportunities deleted successfully"}), 200
        except Exception as e:
            Log().add_log(f"Error while deleting all opportunities: {str(e)}", "opportunity")
            return jsonify({"error": str(e)}), 500

    @app.route(
        "/opportunities/employer_add_update_opportunity", methods=["GET", "POST"]
    )
    @handlers.admin_or_employers_required
    def employer_add_update_opportunity():
        # Check if the details deadline has passed and the employer is in the session
        if database.is_past_details_deadline() and "employer" in session:
            return render_template(
                "employers/past_deadline.html",
                data=(
                    "Adding/Updating details deadline has passed as of "
                    f"{database.get_details_deadline()}"
                ),
                referrer=request.referrer,
                employer=session["employer"],  # Pass employer to the template
                user_type="employer",
            )

        if request.method == "POST":
            print(session)
            is_admin = "user" in session 
            result = Opportunity().add_update_opportunity(is_admin=is_admin)
            print(f"[DEBUG] Result: {result}")

            # Get the current user's username from the session
            print(session)
            username = get_session()
            print(f"[DEBUG] Username: {username}")

            # After adding or updating an opportunity, log the action with the username
            log_message = f"User {username} {result['action']} opportunity with ID: {result['opportunity']['_id']}"
            Log().add_log(log_message, "opportunity")

            return jsonify(result)

        # Get the opportunity by ID if it exists
        opportunity_id = request.args.get("opportunity_id")
        if opportunity_id is not None:
            opportunity = Opportunity().get_opportunity_by_id(opportunity_id)
        else:
            opportunity = {"_id": uuid.uuid1().hex}

        # Include employer in the context
        employer = session.get("employer", None)

        print(f"[DEBUG] Session content: {session}")

        return render_template(
            "opportunities/employer_add_update_opportunity.html",
            opportunity=opportunity,
            courses=Course().get_courses(),
            modules=Module().get_modules(),
            user_type="admin" if "logged_in" in session else "employer",
            employer=employer,  # Add employer to the template context
        )

    @app.route("/opportunities/employer_delete_opportunity", methods=["POST", "GET"])
    @handlers.admin_or_employers_required
    def employer_delete_opportunity():
        opportunity_id = request.args.get("opportunity_id")
        if not opportunity_id:
            flash("Opportunity ID is required", "error")
            return redirect(request.referrer)

        Opportunity().delete_opportunity_by_id(opportunity_id)
        flash("Opportunity deleted successfully", "success")
        log_message = f"Opportunity {opportunity_id} deleted"
        Log().add_log(log_message, "opportunity")
        return redirect(url_for("search_opportunities"))
    
    def get_session():
        user = session.get("user")
        employer = session.get("employer")

        # Determine user_type based on session data
        if user:
            user_type = user.get("name").lower()
        elif employer:
            user_type = employer.get("company_name")
        else:
            user_type = None
        return user_type
