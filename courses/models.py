"""
Courses model."""

from io import BytesIO
import uuid
from datetime import datetime, timedelta
from flask import jsonify, request
import pandas as pd
from core import database
from logs.models import Log
# Cache to store courses and the last update time
courses_cache = {"data": None, "last_updated": None}


class Course:
    """Course data model"""

    def add_course(self):
        """Adds a course to the database."""
        course = {
            "_id": uuid.uuid1().hex,
            "course_id": request.form.get("course_id"),
            "course_name": request.form.get("course_name"),
            "course_description": request.form.get("course_description"),
        }

        if database.courses_collection.find_one(
            {"course_id": request.form.get("course_id")}
        ):
            return jsonify({"error": "Course already in database"}), 400

        database.courses_collection.insert_one(course)

        if course:
            # Update cache
            courses = list(database.courses_collection.find())
            courses_cache["data"] = courses
            courses_cache["last_updated"] = datetime.now()
            return jsonify(course), 200

        return jsonify({"error": "Course not added"}), 400

    def delete_course(self):
        """Deletes a course from the database."""
        course = database.courses_collection.find_one(
            {"course_id": request.form.get("course_id")}
        )

        if not course:
            return jsonify({"error": "Course not found"}), 404

        database.courses_collection.delete_one(
            {"course_id": request.form.get("course_id")}
        )

        # Update cache
        courses = list(database.courses_collection.find())
        courses_cache["data"] = courses
        courses_cache["last_updated"] = datetime.now()
        log_message = f"Course {course['course_id']} deleted"
        Log().add_log(log_message, "course")
        return jsonify(course), 200

    def get_course_by_id(self, module_id=None):
        """Retrieves a course by its ID."""
        if not module_id:
            module_id = request.form.get("course_id")
        course = database.courses_collection.find_one({"course_id": module_id})

        if course:
            return course

        return None

    def get_course_name_by_id(self, module_id):
        """Get course name by id"""
        course = self.get_course_by_id(module_id)
        if not course:
            return None
        return course["course_name"]

    def get_courses(self):
        """Retrieves all courses."""
        current_time = datetime.now()
        one_week_ago = current_time - timedelta(weeks=1)

        # Check if cache is valid
        if (
            courses_cache["data"]
            and courses_cache["last_updated"]
            and courses_cache["last_updated"] > one_week_ago
        ):
            return courses_cache["data"]

        # Fetch courses from the database
        courses = list(database.courses_collection.find())

        if courses:
            # Update cache
            courses_cache["data"] = courses
            courses_cache["last_updated"] = current_time
            return courses

        return []

    def generate_excel_file(self):
        try:
            courses = list(database.courses_collection.find())

            for course in courses:
                course['_id'] = str(course['_id'])
            df = pd.DataFrame(courses)

            output = BytesIO()

            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Course-Data')
            
            output.seek(0)
            return output
        except Exception as e:
            print(f"Error in generate_excel_file: {str(e)}")
            raise

    def get_courses_count(self):
        """Get total count of courses."""
        return database.courses_collection.count_documents({})

    def get_courses_paginated(self, page, per_page):
        """Get paginated courses."""
        skip = (page - 1) * per_page
        courses = list(database.courses_collection.find().skip(skip).limit(per_page))
        return courses