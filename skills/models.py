"""
Skills model.
"""

from io import BytesIO
import uuid
from datetime import datetime, timedelta
from flask import jsonify, request
import pandas as pd
from core import database
from logs.models import Log
# Cache to store skills and the last update time
skills_cache = {"data": [], "last_updated": datetime.now()}


class Skill:
    """
    A class used to represent and manage skills in the database."""

    def find_skill(self, skill_name="", skill_id=""):
        """Check if a skill exists in the database."""
        # Check if the skill is already in the cache
        current_time = datetime.now()
        one_week_ago = current_time - timedelta(weeks=1)

        # Check if cache is valid
        if not skills_cache["data"] or skills_cache["last_updated"] <= one_week_ago:
            skills_cache["data"] = list(database.skills_collection.find())
            skills_cache["last_updated"] = current_time

        # Check if the skill is in the cache
        for skill in skills_cache["data"]:
            if skill["skill_name"] == skill_name:
                return skill
            if skill["_id"] == skill_id:
                return skill

        return None
    
    def generate_excel_file(self):
        try:
            skills = list(database.skills_collection.find())

            for skill in skills:
                skill['_id'] = str(skill['_id'])
            df = pd.DataFrame(skills)

            output = BytesIO()

            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Skills-Data')
            
            output.seek(0)
            return output
        except Exception as e:
            print(f"Error in generate_excel_file: {str(e)}")
            raise

    def add_skill(self):
        """Add Skill to database"""
        if not request.form.get("skill_name") or not request.form.get(
            "skill_description"
        ):
            return jsonify({"error": "One of the inputs is blank"}), 400

        skill_name = request.form.get("skill_name")
        skill_description = request.form.get("skill_description")
        
        skill = {
            "_id": uuid.uuid1().hex,
            "skill_name": skill_name,
            "skill_description": skill_description,
        }

        # Check if skill already exists#
        if self.find_skill(skill["skill_name"], None) is not None:
            Log().add_log(f"Attempt to add duplicate skill: {skill_name}", "skill")
            return jsonify({"error": "Skill already in database"}), 400

        database.skills_collection.insert_one(skill)

        if skill:
            # Update cache
            skills_cache["data"].append(skill)
            skills_cache["last_updated"] = datetime.now()
            # Log the addition of the new skill
            Log().add_log(f"New skill added: {skill_name}", "skill")
            return jsonify(skill), 200

        return jsonify({"error": "Skill not added"}), 400

    def delete_skill(self, skill_id):
        """Delete skill from database"""
        # Find the skill first to get its name for logging
        skill = self.find_skill(None, skill_id)
        if not skill:
            return jsonify({"error": "Skill not found"}), 404

        skill_name = skill.get("skill_name", "Unknown skill")
        
        # Delete the skill
        database.skills_collection.delete_one({"_id": request.form.get("skill_id")})
        
        # Log the deletion with the skill name
        log_message = f"Skill '{skill_name}' (ID: {skill_id}) was deleted"
        Log().add_log(log_message, "skill")
        
        # Update cache
        skills = list(database.skills_collection.find())
        skills_cache["data"] = skills
        skills_cache["last_updated"] = datetime.now()

        return jsonify({"message": "Deleted"}), 200

    def get_skill_by_id(self, skill_id=None):
        """Get skill by ID tag"""
        if skill_id is None:
            skill_id = request.form.get("skill_id")
        skill = self.find_skill(None, skill_id)

        if skill:
            return skill

        return None

    def get_skill_name_by_id(self, skill_id):
        """Get skill name by id"""
        skill = self.get_skill_by_id(skill_id)
        if not skill:
            return None
        return skill["skill_name"]

    def get_skills(self):
        """Get full list of skills if chached get that instead"""
        current_time = datetime.now()
        one_week_ago = current_time - timedelta(weeks=1)

        # Check if cache is valid
        if (
            skills_cache["data"]
            and skills_cache["last_updated"]
            and skills_cache["last_updated"] > one_week_ago
        ):
            return skills_cache["data"]

        # Fetch skills from the database
        skills = list(database.skills_collection.find())

        if skills:
            # Update cache
            skills_cache["data"] = skills
            skills_cache["last_updated"] = current_time
            return skills

        return []

    def attempt_add_skill(self):
        """Add skill to attempted skills"""
        skill_name = request.json.get("skill_name").lower()
        found_skill = database.attempted_skills_collection.find_one(
            {"skill_name": skill_name}
        )

        if found_skill:
            database.attempted_skills_collection.update_one(
                {"_id": found_skill["_id"]}, {"$inc": {"used": 1}}
            )
            return jsonify(found_skill), 200

        new_skill = {
            "_id": uuid.uuid1().hex,
            "skill_name": skill_name,
            "used": 1,
        }

        database.attempted_skills_collection.insert_one(new_skill)
        return jsonify(new_skill), 200

    def get_list_attempted_skills(self):
        """Get list of attempted skills"""
        attempted_skills = list(database.attempted_skills_collection.find())

        if not attempted_skills:
            return []

        return attempted_skills
    
    def get_skills_count(self):
        """Get total count of skills."""
        return database.skills_collection.count_documents({})

    def get_skills_paginated(self, page, per_page):
        """Get paginated skills."""
        skip = (page - 1) * per_page
        skills = list(database.skills_collection.find().skip(skip).limit(per_page))
        # Convert ObjectId to string for JSON serialization
        for skill in skills:
            if '_id' in skill:
                skill['_id'] = str(skill['_id'])
        return skills

