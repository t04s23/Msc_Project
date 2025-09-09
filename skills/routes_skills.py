"""Handles the routes for the skills module."""

from flask import jsonify, render_template, request, send_file
from core import database, handlers
from logs.models import Log
from .models import Skill


def add_skills_routes(app):
    """Skills routes"""

    @app.route("/skills/attempt_add_skill_student", methods=["POST"])
    @handlers.student_login_required
    def attempt_add_skill_student():
        """Attempt to add a skill to a student."""
        return Skill().attempt_add_skill()

    @app.route("/skills/add_skill", methods=["POST", "GET"])
    @handlers.login_required
    def add_skill():
        if request.method == "GET":
            return render_template("/skills/adding_skills.html", user_type="admin")
        return Skill().add_skill() 
    
    @app.route("/skills/show_skills", methods=["GET"])
    @handlers.login_required
    def show_skills():
        page = request.args.get('page', 1, type=int)
        per_page = 20
        
        # Get total count and paginated data
        total_count = Skill().get_skills_count()
        skills = Skill().get_skills_paginated(page, per_page)
        
        response = {
            'skills': skills,
            'total_count': total_count,
            'current_page': page,
            'total_pages': (total_count + per_page - 1) // per_page
        }
        return jsonify(response)
    
    @app.route('/skills/download_skills_excel', methods=['GET'])
    @handlers.admin_or_employers_required
    def download_skills_excel():
            try:
                excel_file = Skill().generate_excel_file()

                
                return send_file(
                    excel_file,
                    download_name='Skills.xlsx', 
                    as_attachment=True,  
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                )
            except Exception as e:
                
                return f"Error while generating Excel file: {str(e)}", 500
            

    @app.route('/skills/delete_all', methods=['DELETE'])
    @handlers.login_required
    def delete_all_skills():
            try:
                # Get the count of skills before deletion for logging
                skills_count = database.skills_collection.count_documents({})
                
                # Delete all skills
                database.skills_collection.delete_many({})
                
                # Log with the count of deleted skills
                Log().add_log(f"All skills were deleted ({skills_count} skills removed)", "skill")
                return jsonify({
                    "message": f"All skills deleted successfully ({skills_count} skills removed)"
                }), 200
            except Exception as e:
                Log().add_log(f"Error while deleting all skills: {str(e)}", "skill")
                return jsonify({"error": str(e)}), 500

    @app.route('/skills/edit/<skill_id>', methods=['PUT'])
    @handlers.login_required
    def edit_skill(skill_id):
        try:
            skill_name = request.form.get('skill_name')
            skill_description = request.form.get('skill_description')
            
            if not skill_name or not skill_description:
                return jsonify({"error": "Skill name and description are required"}), 400
            
            # Check if skill exists
            skill = Skill().get_skill_by_id(skill_id)
            if not skill:
                return jsonify({"error": "Skill not found"}), 404
            
            previous_skill_name = skill.get('skill_name', 'Unknown skill')
            
            # Update skill
            database.skills_collection.update_one(
                {"_id": skill_id},
                {"$set": {
                    "skill_name": skill_name,
                    "skill_description": skill_description
                }}
            )
            
            # Log the update with both old and new names
            Log().add_log(f"Skill updated: '{previous_skill_name}' → '{skill_name}' (ID: {skill_id})", "skill")
            return jsonify({"message": "Skill updated successfully"}), 200
            
        except Exception as e:
            # Make sure we have previous_skill_name defined in the error case
            previous_skill_name = previous_skill_name if 'previous_skill_name' in locals() else f"ID:{skill_id}"
            Log().add_log(f"Error updating skill '{previous_skill_name}': {str(e)}", "skill")
            return jsonify({"error": str(e)}), 500
    
    @app.route('/skills/delete/<skill_id>', methods=['DELETE'])
    @handlers.login_required
    def delete_single_skill(skill_id):
        try:
            # Check if skill exists
            skill = Skill().get_skill_by_id(skill_id)
            if not skill:
                return jsonify({"error": "Skill not found"}), 404
            
            skill_name = skill.get('skill_name', 'Unknown skill')
            
            # Delete skill
            database.skills_collection.delete_one({"_id": skill_id})
            
            # Log the deletion with the skill name
            Log().add_log(f"Skill '{skill_name}' (ID: {skill_id}) was deleted", "skill")
            return jsonify({"message": "Skill deleted successfully"}), 200
            
        except Exception as e:
            # In case of an error, try to get the skill name if available
            skill_name = skill['skill_name'] if 'skill' in locals() and skill and 'skill_name' in skill else f"ID:{skill_id}"
            Log().add_log(f"Error deleting skill '{skill_name}': {str(e)}", "skill")
            return jsonify({"error": str(e)}), 500