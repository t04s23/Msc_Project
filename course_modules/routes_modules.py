"""Handles the routes for the Module module."""

from flask import jsonify, render_template, request, send_file
from core import handlers
from .models import Module


def add_module_routes(app):
    """Module routes"""

    @app.route("/course_modules/add_module", methods=["POST", "GET"])
    @handlers.login_required
    def add_course_module():
        if request.method == "GET":
            return render_template(
                "course_modules/adding_modules.html", user_type="admin"
            )
        return Module().add_module()
    
    @app.route("/course_modules/show_modules", methods=["GET"])
    @handlers.login_required
    def show_module():
        page = request.args.get('page', 1, type=int)
        per_page = 20
        
        # Get total count and paginated data
        total_count = Module().get_modules_count()
        modules = Module().get_modules_paginated(page, per_page)
        
        response = {
            'modules': modules,
            'total_count': total_count,
            'current_page': page,
            'total_pages': (total_count + per_page - 1) // per_page
        }
        return jsonify(response)
    
    @app.route('/course_modules/download_modules_excel', methods=['GET'])
    @handlers.admin_or_employers_required
    def download_modules_excel():
            try:
                excel_file =Module().generate_excel_file()

                
                return send_file(
                    excel_file,
                    download_name='Modules.xlsx', 
                    as_attachment=True,  
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                )
            except Exception as e:
                
                return f"Error while generating Excel file: {str(e)}", 500
            