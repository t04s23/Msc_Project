# tests/student_testable.py

from flask import request, jsonify, session
import uuid
from passlib.hash import pbkdf2_sha256
import pandas as pd
from io import BytesIO

from core import database
from opportunities.models import Opportunity
from logs.models import Log


class Student:
    def add_student(self):
        student = {
            "_id": uuid.uuid1().hex,
            "first_name": request.form.get("first_name"),
            "last_name": request.form.get("last_name"),
            "email": request.form.get("email"),
            "student_id": request.form.get("student_id"),
        }
        overwrite = bool(request.form.get("overwrite"))

        if not overwrite and database.students_collection.find_one(
            {"student_id": request.form.get("student_id")}
        ):
            return jsonify({"error": "Student already in database"}), 400

        database.students_collection.insert_one(student)

        if student:
            return jsonify(student), 200

        return jsonify({"error": "Student not added"}), 400

    def get_student_by_id(self, student_id):
        student = database.students_collection.find_one({"student_id": str(student_id)})
        return student if student else None

    def generate_excel_file(self):
        try:
            students = list(database.students_collection.find())

            for student in students:
                student["_id"] = str(student["_id"])
                if "preferences" in student:
                    del student["preferences"]
                if "skills" in student:
                    del student["skills"]

            df = pd.DataFrame(students)
            output = BytesIO()
            with pd.ExcelWriter(output, engine="openpyxl") as writer:
                df.to_excel(writer, index=False, sheet_name="Students-Data")
            output.seek(0)
            return output
        except Exception as e:
            print(f"Error in generate_excel_file: {str(e)}")
            raise

    def delete_student_by_id(self, student_id):
        student = database.students_collection.find_one({"student_id": str(student_id)})

        if student:
            database.students_collection.delete_one({"student_id": str(student_id)})
            Log().add_log(f"Student {student_id} deleted", "student")
            return jsonify({"message": "Student deleted"}), 200

        return jsonify({"error": "Student not found"}), 404

    def student_login(self):
        student_id = request.form.get("student_id")
        password = request.form.get("password")
        student = database.students_collection.find_one({"student_id": student_id})

        if student and pbkdf2_sha256.verify(password, student["password"]):
            del student["_id"]
            session["student"] = student
            session["student_logged_in"] = True
            return jsonify({"message": "Login successful"}), 200

        return jsonify({"error": "Invalid Student Number or password"}), 401
    def change_password(self):
        student = session.get("student")
        if not student:
            return jsonify("Error - Student not logged in"), 401

        old_password = request.form.get("old_password")
        new_password = request.form.get("new_password")
        confirm_password = request.form.get("confirm_password")

        stored_student = database.students_collection.find_one({"student_id": student["student_id"]})
        if not stored_student or not pbkdf2_sha256.verify(old_password, stored_student["password"]):
            return jsonify({"error": "Invalid old password"}), 400

        if new_password != confirm_password:
            return jsonify({"error": "Passwords don't match"}), 400

        database.students_collection.update_one(
            {"student_id": student["student_id"]},
            {"$set": {"password": pbkdf2_sha256.hash(new_password)}},
        )

        return jsonify({"message": "Password updated successfully"}), 200

    def rank_preferences(self, student_id):
        student = database.students_collection.find_one({"student_id": str(student_id)})
        if not student:
            return jsonify({"error": "Student not found"}), 404
        preferences = [a[5:] for a in request.form.get("ranks").split(",")]
        database.students_collection.update_one(
            {"student_id": str(student_id)}, {"$set": {"preferences": preferences}}
        )
        return jsonify({"message": "Preferences updated"}), 200
    def get_student_by_uuid(self, _id):
        student = database.students_collection.find_one({"_id": str(_id)})
        return student if student else None

