"""
Handles routes for the student module.
"""

from flask import jsonify, redirect, render_template, request, send_file, session
from passlib.hash import pbkdf2_sha256
from core import database, handlers
from courses.models import Course
from employers.models import Employers
from logs.models import Log
from skills.models import Skill
from course_modules.models import Module
from .models import Student


def add_student_routes(app):
    """Add student routes."""

    @app.route("/students/add_student", methods=["POST"])
    @handlers.login_required
    def register_student_attempt():
        """Adding new student."""
        return Student().add_student()

    @app.route("/students/upload_csv", methods=["POST"])
    @handlers.login_required
    def upload_csv():
        """Route to upload students from a CSV file."""
        return Student().import_from_csv()

    @app.route("/students/upload_xlsx", methods=["POST"])
    @handlers.login_required
    def upload_xlsx():
        """Route to upload students from an Excel file. 
        Students with IDs already in the database will be skipped."""
        return Student().import_from_xlsx()

    @app.route("/students/upload", methods=["GET"])
    @handlers.login_required
    def upload_page():
        """Route to upload students from a XLSX file."""
        return render_template("/student/upload_student_data.html", user_type="admin")

    @app.route("/students/search")
    @handlers.login_required
    def search_page():
        """Getting student."""
        return render_template(
            "student/search_student.html",
            skills=Skill().get_skills(),
            courses=Course().get_courses(),
            user_type="admin",
        )

    @app.route("/students/search_students", methods=["POST"])
    @handlers.login_required
    def search_students():
        """Getting student."""
        return Student().search_students()
    @app.route('/students/download_students_excel', methods=['GET'])
    @handlers.admin_or_employers_required
    def download_students_excel():
            try:
                excel_file = Student().generate_excel_file()

                
                return send_file(
                    excel_file,
                    download_name='students.xlsx', 
                    as_attachment=True,  
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                )
            except Exception as e:
                
                return f"Error while generating Excel file: {str(e)}", 500
            
    @app.route('/students/delete_all', methods=['DELETE'])
    def delete_all_students():
        try:
            database.students_collection.delete_many({})
            Log().add_log("All students were deleted", "student")
            return jsonify({"message": "All students deleted successfully"}), 200
        except Exception as e:
            Log().add_log(f"Error while deleting all students: {str(e)}", "student")
            return jsonify({"error": str(e)}), 500
        
    @app.route("/students/delete_student/<string:student_id>", methods=["DELETE"])
    @handlers.login_required
    def delete_student(student_id):
        """Delete student."""

        if(len(student_id) == 8):
            return Student().delete_student_by_id(student_id)
        else:
            return Student().delete_student_by_UNIX_id(student_id)

    @app.route("/students/update_student/<string:student_id>", methods=["PUT"])
    def update_student(student_id):
        """Update student data by ID."""
        updated_data = request.get_json()  # Get JSON data from the request body

        if not updated_data:
            return jsonify({"error": "No data provided"}), 400

        student = Student().get_student_by_id(student_id)
        if student:
            update_result = Student().update_student_by_id(student_id, updated_data)
            if update_result:
                return jsonify({"message": "Student updated successfully"}), 200
            else:
                return jsonify({"message": "No changes detected"}), 200
        else:
            return jsonify({"error": "Student not found"}), 404

    @app.route("/students/login", methods=["GET", "POST"])
    def login_student():
        """Logins a student"""
        if request.method == "POST":
            return Student().student_login()

        if "student" in session and "student_signed_in" in session:
            return redirect(
                "/students/details/" + str(session["student"]["student_id"])
            )
        return render_template("student/student_login.html")

    @app.route("/students/passed_deadline/<int:student_id>")
    def past_deadline(student_id):

        user_type = ""

        # Determine user type
        if "student" in session:
            user_type = "student"
            if session["student"]["student_id"] != str(student_id):
                session.clear()
                return redirect("/students/login")
        elif "admin" in session:
            user_type = "admin"
    
        return render_template(
            "student/past_deadline.html",
            student=(
                session["student"]
                if user_type == "student"
                else Student().get_student_by_id(student_id)
            ),
            user_type=user_type,  # Pass user type to the template
        )
        

    @app.route("/students/details/<int:student_id>", methods=["GET", "POST"])
    @handlers.student_login_required
    def student_details(student_id):
        """Get or update student details."""
        user_type = ""

        # Determine user type
        if "student" in session:
            user_type = "student"
            if session["student"]["student_id"] != str(student_id):
                session.clear()
                return redirect("/students/login")
        elif "admin" in session:
            user_type = "admin"
        else:
            return redirect("/students/login")  # Redirect if neither student nor admin

        # Handle deadlines (applicable to students only)
        if user_type == "student":
            if database.is_past_student_ranking_deadline():
                return redirect(f"/students/passed_deadline/{student_id}")
            if database.is_past_details_deadline():
                return redirect(f"/students/rank_preferences/{student_id}")

        # Handle POST request for updating details
        if request.method == "POST":
            # Admins might update student details on behalf of students
            is_student = user_type == "student"
            return Student().update_student_by_id(student_id, is_student)
        # Render the template
        return render_template(
            "student/student_details.html",
            student=(
                session["student"]
                if user_type == "student"
                else Student().get_student_by_id(student_id)
            ),
            deadline = database.get_details_deadline(),
            skills=Skill().get_skills(),
            courses=Course().get_courses(),
            modules=Module().get_modules(),
            attempted_skills=Skill().get_list_attempted_skills(),
            user_type=user_type,  # Pass user type to the template
        )

    @app.route("/students/rank_preferences/<int:student_id>", methods=["GET", "POST"])
    @handlers.student_login_required
    def rank_preferences(student_id):
        """Rank preferences."""
        if "student" not in session:
            return redirect("/login")

        if session["student"]["student_id"] != str(student_id):
            session.clear()
            return redirect("/login")

        if database.is_past_student_ranking_deadline():
            session.clear()
            render_template("student/past_deadline.html")

        if not database.is_past_details_deadline():
            return redirect("/students/details/" + str(student_id))
        if request.method == "POST":
            return Student().rank_preferences(student_id)
        student = Student().get_student_by_id(student_id)
        opportunities = Student().get_opportunities_by_student(student_id)
        # preferences = student["preferences"]
        # pref_index_map = {value: index for index, value in enumerate(preferences)}
        # sorted_opportunities = sorted(opportunities, key=lambda opp: sort_opportunities(pref_index_map, preferences, opp))
        # print(sorted_opportunities)
        return render_template(
            "student/student_rank_opportunities.html",
            opportunities=opportunities,
            employers_col=Employers().get_employer_by_id,
            count=len(opportunities),
            user_type="student",
            deadline = database.get_student_ranking_deadline(),
        )

    
    def sort_opportunities(pref_index_map, preferences, opportunity):
        
        return pref_index_map.get(opportunity["_id"], len(preferences))

    @app.route("/students/update_success")
    @handlers.student_login_required
    def student_update_successful():
        """Routing to deal with success"""
        session.clear()
        return render_template("student/update_successful_page.html")
