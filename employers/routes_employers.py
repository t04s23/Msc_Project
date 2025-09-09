"""Routes for employers module"""

import os
from flask import jsonify, request, render_template, send_file, session
from itsdangerous import URLSafeSerializer
from core import database, handlers
from course_modules.models import Module
from courses.models import Course
from opportunities.models import Opportunity
from skills.models import Skill
from .models import Employers
from logs.models import Log

def add_employer_routes(app):
    """Add employer routes."""

    @app.route("/employers/login", methods=["GET", "POST"])
    def employer_login():
        if request.method == "POST":
            return Employers().employer_login()

        return render_template("employers/employer_login.html", user_type="employer")

    @app.route("/employers/home", methods=["GET"])
    @handlers.employers_login_required
    def employer_home(employer):
        return render_template(
            "employers/employer_home.html", employer=employer, user_type="employer"
        )
    
    @app.route("/employers/update_employer/<string:employer_id>", methods=["PUT"])
    def update_employer(employer_id):
        updated_data = request.get_json()  # Get JSON data from the request body

        if not updated_data:
            return jsonify({"error": "No data provided"}), 400

        employer = Employers().get_employer_by_id(employer_id)
        if employer:
            update_result = Employers().update_employer_by_id(employer_id, updated_data)
            if update_result:
                return jsonify({"message": "employer updated successfully"}), 200
            else:
                return jsonify({"message": "No changes detected"}), 200
        else:
            return jsonify({"error": "employer not found"}), 404

    @app.route("/employers/otp", methods=["POST"])
    def employer_otp():

        if "employer" not in session:
            return jsonify({"error": "Employer not logged in."}), 400
        otp_serializer = URLSafeSerializer(str(os.getenv("SECRET_KEY", "secret")))
        if "OTP" not in session:
            return jsonify({"error": "OTP not sent."}), 400
        if request.form.get("otp") != otp_serializer.loads(session["OTP"]):
            return jsonify({"error": "Invalid OTP."}), 400

        return Employers().start_session()

    @app.route("/employers/add_employer", methods=["GET", "POST"])
    @handlers.login_required
    def add_employer():
        if request.method == "POST":
            return Employers().register_employer()
        
        return render_template("employers/add_employer.html", user_type="admin")
    
    @app.route("/employers/search")
    @handlers.login_required
    def employers_search_page():
        return render_template(
            "employers/search.html",
            user_type="admin",
        )
    @app.route("/employers/search_employers", methods=["POST"])
    @handlers.login_required
    def search_employers():
        return Employers().search_employers()
    

    @app.route("/employers/rank_students", methods=["GET", "POST"])
    @handlers.employers_login_required
    def employers_rank_students(_stuff):
        if database.is_past_opportunities_ranking_deadline() and "employer" in session:
            return render_template(
                "employers/past_deadline.html",
                data=(
                    f"Ranking deadline has passed as of "
                    f"{database.get_opportunities_ranking_deadline()}"
                ),
                referrer=request.referrer,
                employer=session["employer"],
                user_type="employer",
            )
        opportunity_id = request.args.get("opportunity_id")
        if not opportunity_id:
            return jsonify({"error": "Need opportunity ID."}), 400
        opportunity = Opportunity().get_opportunity_by_id(opportunity_id)
        if session["employer"]["_id"] != opportunity["employer_id"]:
            return jsonify({"error": "Employer does not own this opportunity."}), 400
        if not database.is_past_student_ranking_deadline():
            return render_template(
                "employers/past_deadline.html",
                data=(
                    "Student ranking deadline must have passed before you can start, "
                    f"wait till {database.get_student_ranking_deadline()}"
                ),
                referrer=request.referrer,
                employer=session["employer"],
            )
        if request.method == "POST":
            return Opportunity().rank_preferences(opportunity_id)
        valid_students = Opportunity().get_valid_students(opportunity_id)
        return render_template(
            "opportunities/employer_rank_students.html",
            opportunity_id=opportunity_id,
            students=valid_students,
            get_course_name=Course().get_course_name_by_id,
            get_module_name=Module().get_module_name_by_id,
            get_skill_name=Skill().get_skill_name_by_id,
            user_type="employer",
        )
    @app.route('/employers/download_employers_excel', methods=['GET'])
    @handlers.admin_or_employers_required
    def download_employers_excel():
            try:
                excel_file = Employers().generate_excel_file()

                
                return send_file(
                    excel_file,
                    download_name='Employers.xlsx', 
                    as_attachment=True,  
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                )
            except Exception as e:
                return f"Error while generating Excel file: {str(e)}", 500
            
    
    @app.route('/employers/delete_all', methods=['DELETE'])
    @handlers.login_required
    def delete_all_employers():
            try:
                # Get the count of employers before deletion for logging
                employers_count = database.employers_collection.count_documents({})
                
                # Delete all employers
                database.employers_collection.delete_many({})
                
                # Log with the count of deleted employers
                Log().add_log(f"All employers were deleted ({employers_count} employers removed)", "employer")
                return jsonify({
                    "message": f"All employers deleted successfully ({employers_count} employers removed)"
                }), 200
            except Exception as e:
                Log().add_log(f"Error while deleting all employers: {str(e)}", "employer")
                return jsonify({"error": str(e)}), 500
    @app.route('/employers/delete_employer/<string:employer_id>', methods=['DELETE'])
    @handlers.login_required
    def delete_employers(employer_id) :
       return Employers().delete_company_by_id(employer_id)            