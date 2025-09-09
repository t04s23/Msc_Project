"""Handles the routes for the course module."""

from flask import jsonify, render_template, request, send_file
from core import handlers
from .models import Course


def add_course_routes(app):
    """Courses routes"""

    @app.route("/courses/add_course", methods=["POST", "GET"])
    @handlers.login_required
    def add_course():
        if request.method == "GET":
            return render_template("/courses/adding_course.html", user_type="admin")
        return Course().add_course()
    
    @app.route("/courses/show_course", methods=["GET"])
    @handlers.login_required
    def show_course():
        page = request.args.get('page', 1, type=int)
        per_page = 20
        
        # Get total count and paginated data
        total_count = Course().get_courses_count()
        courses = Course().get_courses_paginated(page, per_page)
        
        response = {
            'courses': courses,
            'total_count': total_count,
            'current_page': page,
            'total_pages': (total_count + per_page - 1) // per_page
        }
        return jsonify(response)
    
    @app.route('/courses/download_courses_excel', methods=['GET'])
    @handlers.admin_or_employers_required
    def download_courses_excel():
            try:
                excel_file = Course().generate_excel_file()

                
                return send_file(
                    excel_file,
                    download_name='Courses.xlsx', 
                    as_attachment=True,  
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                )
            except Exception as e:
                
                return f"Error while generating Excel file: {str(e)}", 500
            