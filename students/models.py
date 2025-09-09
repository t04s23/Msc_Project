"""
This module defines the User class which handles user authentication and session management.
"""

from io import BytesIO
import json
import uuid
from flask import jsonify, request, session
from pymongo import TEXT
from passlib.hash import pbkdf2_sha256
import pandas as pd
from core import database, handlers
from opportunities.models import Opportunity
from logs.models import Log

class Student:
    """Student class."""

    def search_students(self):
        """Searching students."""
        data = request.get_json()
        # Build the query with AND logic
        query = {}
        if data.get("first_name"):
            query["first_name"] = data["first_name"]
        if data.get("last_name"):
            query["last_name"] = data["last_name"]
        if data.get("email"):
            query["email"] = data["email"]
        if data.get("student_id"):
            query["student_id"] = data["student_id"]
        if data.get("course"):
            query["course"] = data["course"]
        if data.get("skills"):
            skills_string = data["skills"]
            skills_list = skills_string.split(",")
            query["skills"] = {"$in":skills_list}
        if data.get("modules"):
            # Match students with at least one of the provided modules
            query["modules"] = {"$in": data["modules"]}

        students = list(database.students_collection.find(query))

        if students:
             for student in students:
                if student.get('course'):
                        courses_list = student['course'].strip('[]').split(',')
                        courses_list = [c.strip().strip('"') for c in courses_list if c.strip()]
                        course_names = []
                        for course_id in courses_list:
                            course = database.courses_collection.find_one({"course_id": course_id})
                            if course:
                                course_names.append(course.get('course_name', 'Unknown Course'))
                        student['course'] = course_names
                if student.get('skills'):
                    skills_list = student['skills']
                    skills_names = []
                    for skill_id in skills_list:
                        skill = database.skills_collection.find_one({"_id": skill_id})
                        if skill:
                            skills_names.append(skill.get('skill_name', 'Unknown skill'))
                    student['skill'] = skills_names
             return jsonify(students), 200

        return jsonify({"error": "No students found"}), 404
    


    def generate_excel_file(self):
        try:
            students = list(database.students_collection.find())

            for student in students:
                student['_id'] = str(student['_id'])
                # Convert module IDs to names
                if "preferences" in student:
                    del student['preferences']
                if "skills" in student:
                    del student['skills']
            
            df = pd.DataFrame(students)

            output = BytesIO()

            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Students-Data')
            
            output.seek(0)
            return output
        except Exception as e:
            print(f"Error in generate_excel_file: {str(e)}")
            raise

    def add_student(self):
        """Adding new student."""
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
        """Getting student."""
        student = database.students_collection.find_one({"student_id": str(student_id)})

        if student:
            return student

        return None

    def get_student_by_uuid(self, _id):
        """Getting student."""
        student = database.students_collection.find_one({"_id": str(_id)})

        if student:
            return student

        return None

    def get_students(self):
        """Getting all students."""
        students = list(database.students_collection.find())

        if students:
            return students

        return []

    # def update_student_by_id(self, student_id, student_data):
    #     """Update student in the database by student_id."""
    #     # Attempt to update the student directly with the provided data
    #     result = database.students_collection.update_one(
    #         {"student_id": str(student_id)},  # Match the student by ID
    #         {"$set": student_data},  # Update the fields with the new values
    #     )

    #     # Return True if the update was successful (i.e., a document was matched and modified)
    #     if result.matched_count > 0:
    #         return jsonify({"message": "Student updated"}), 200
    #     else:
    #         return jsonify({"error": "Student not found"}), 404

    def delete_student_by_id(self, student_id):
        """Deleting student."""
        student = database.students_collection.find_one({"student_id": str(student_id)})

        if student:
            database.students_collection.delete_one({"student_id": str(student_id)})
            log_message = f"Student {student_id} deleted"
            Log().add_log(log_message, "student")
            return jsonify({"message": "Student deleted"}), 200

        return jsonify({"error": "Student not found"}), 404

    def delete_student_by_UNIX_id(self, student_id):

        student = database.students_collection.find_one({"_id": str(student_id)})

        if student:
            database.students_collection.delete_one({"_id": str(student_id)})
            log_message = f"Student {student_id} deleted"
            Log().add_log(log_message, "student")
            return jsonify({"message": "Student deleted"}), 200

        return jsonify({"error": "Student not found"}), 404

    def delete_students(self):
        """Deleting all students."""
        students = list(database.students_collection.find())

        if students:
            database.students_collection.delete_many({})
            log_message = "All students deleted"
            Log().add_log(log_message, "student")
            return jsonify({"message": "All students deleted"}), 200

        return jsonify({"error": "No students found"}), 404

    def get_student_by_email(self):
        """Getting student."""
        student = database.students_collection.find_one(
            {"email": request.form.get("email")}
        )

        if student:
            return jsonify(student), 200

        return jsonify({"error": "Student not found"}), 404

    def get_students_by_course(self):
        """Getting students."""
        students = list(
            database.students_collection.find({"course": request.form.get("course")})
        )

        if students:
            return jsonify(students), 200

        return jsonify({"error": "No students found"}), 404

    def get_students_by_skills(self):
        """Getting students."""
        students = list(
            database.students_collection.find({"skills": request.form.get("skills")})
        )

        if students:
            return jsonify(students), 200

        return jsonify({"error": "No students found"}), 404

    def get_students_by_course_and_skills(self):
        """Getting students."""
        students = list(
            database.students_collection.find(
                {
                    "course": request.form.get("course"),
                    "skills": request.form.get("skills"),
                }
            )
        )

        if students:
            return jsonify(students), 200

        return jsonify({"error": "No students found"}), 404

    def get_students_by_name(self):
        """Getting students by name."""
        # Ensure text index is created on the collection
        database.students_collection.create_index(
            [("first_name", TEXT), ("last_name", TEXT)]
        )

        students = list(
            database.students_collection.find(
                {
                    "$text": {
                        "$search": (
                            f"{request.form.get('first_name')} "
                            f"{request.form.get('last_name')}"
                        )
                    }
                }
            )
        )

        if students:
            return jsonify(students), 200

        return jsonify({"error": "No students found"}), 404

    def import_from_csv(self):
        """Importing students from CSV file."""

        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        if not handlers.allowed_file(request.files["file"].filename, ["csv"]):
            return jsonify({"error": "Invalid file type"}), 400

        try:
            file = request.files["file"]
            df = pd.read_csv(file)

            students = df.to_dict(orient="records")
            for student in students:
                student["_id"] = uuid.uuid4().hex
                database.students_collection.delete_one(
                    {"student_id": student["student_id"]}
                )
                database.students_collection.insert_one(student)
            return jsonify({"message": "Students imported"}), 200
        except (
                pd.errors.EmptyDataError,
                pd.errors.ParserError,
                FileNotFoundError,
        ) as e:
            return jsonify({"error": f"Failed to read file: {str(e)}"}), 400

    def import_from_xlsx(self):
        """Importing students from Excel file."""

        if "file" not in request.files:
            Log().add_log("No file was provided in the request", "student")
            return jsonify({"error": "No file selected"}), 400

        file = request.files["file"]
        if file.filename == '':
            Log().add_log("Empty filename was provided", "student")
            return jsonify({"error": "No file selected"}), 400

        if not handlers.allowed_file(file.filename, ["xlsx", "xls"]):
            Log().add_log(f"Invalid file type: {file.filename}", "student")
            return jsonify({"error": "Invalid file type. Please upload an Excel file (.xlsx or .xls)"}), 400
            
        try:
            # Add log
            Log().add_log(f"Attempting to import Excel file: {file.filename}", "student")
            
            # Read Excel file
            try:
                df = pd.read_excel(file)
            except Exception as e:
                Log().add_log(f"Failed to read Excel file: {str(e)}", "student")
                return jsonify({"error": f"Unable to read Excel file: {str(e)}"}), 400
            
            # Check required columns
            required_columns = ["First Name", "Last Name", "Email (Uni)", "Student Number"]
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                error_msg = f"Missing required columns: {', '.join(missing_columns)}. Please ensure column names match exactly."
                Log().add_log(error_msg, "student")
                return jsonify({"error": error_msg}), 400
            
            # Validate data
            if df.empty:
                Log().add_log("Excel file contains no data", "student")
                return jsonify({"error": "The Excel file contains no data"}), 400
            
            # Clean data and convert to string type
            try:
                df["Email (Uni)"] = df["Email (Uni)"].astype(str).str.strip()
                df["Student Number"] = df["Student Number"].astype(str).str.strip()
            except Exception as e:
                Log().add_log(f"Error during data cleaning: {str(e)}", "student")
                return jsonify({"error": f"Data format error: {str(e)}"}), 400
            
            # Validate emails
            invalid_emails = df[~df["Email (Uni)"].str.endswith("@abdn.ac.uk")]["Email (Uni)"].tolist()
            if invalid_emails:
                error_msg = f"Invalid email format: {invalid_emails[0]}. All emails must end with @abdn.ac.uk"
                Log().add_log(error_msg, "student")
                return jsonify({"error": error_msg}), 400
                
            # Validate student IDs
            invalid_student_ids = df[df["Student Number"].str.len() != 8]["Student Number"].tolist()
            if invalid_student_ids:
                error_msg = f"Invalid Student Number: {invalid_student_ids[0]}. Must be exactly 8 digits."
                Log().add_log(error_msg, "student")
                return jsonify({"error": error_msg}), 400

            # All validations passed, start importing
            students = df.to_dict(orient="records")
            imported_count = 0
            failed_count = 0
            skipped_count = 0
            failure_details = []
            skipped_details = []
            
            for student in students:
                try:
                    # Check if student already exists in database
                    existing_student = database.students_collection.find_one(
                        {"student_id": str(student["Student Number"])}
                    )
                    
                    if existing_student:
                        # Skip this student as they already exist
                        skipped_count += 1
                        skip_detail = f"Student {student['First Name']} {student['Last Name']} (ID: {student['Student Number']}) already exists in database"
                        skipped_details.append(skip_detail)
                        Log().add_log(skip_detail, "student")
                        continue
                    
                    # Student doesn't exist, proceed with import
                    temp_student = {}
                    temp_student["_id"] = uuid.uuid4().hex
                    temp_student["first_name"] = student["First Name"]
                    temp_student["last_name"] = student["Last Name"]
                    temp_student["email"] = student["Email (Uni)"]
                    temp_student["password"] = pbkdf2_sha256.hash(student["Email (Uni)"])
                    temp_student["student_id"] = str(student["Student Number"])
                    
                    # Add the new student
                    database.students_collection.insert_one(temp_student)
                    imported_count += 1
                except Exception as individual_error:
                    failed_count += 1
                    error_detail = f"Error importing student {student.get('First Name', '')} {student.get('Last Name', '')}: {str(individual_error)}"
                    failure_details.append(error_detail)
                    Log().add_log(error_detail, "student")
                    # Continue processing other students, don't interrupt the entire import process

            # Prepare response message
            if imported_count == 0 and skipped_count > 0 and failed_count == 0:
                # All records were skipped due to duplicates
                success_msg = f"No new students imported. {skipped_count} student(s) already exist in the database and were skipped."
            else:
                success_msg = f"Successfully imported {imported_count} students"
                if skipped_count > 0:
                    success_msg += f", {skipped_count} student(s) skipped (already in database)"
                if failed_count > 0:
                    success_msg += f", {failed_count} student(s) failed to import"
                
            Log().add_log(success_msg, "student")
            
            response_data = {"message": success_msg}
            if skipped_details:
                response_data["skipped"] = skipped_details
            if failure_details:
                response_data["failures"] = failure_details
            
            # Always return a 200 status if we've processed the file, even if all records were skipped
            return jsonify(response_data), 200
            
        except pd.errors.EmptyDataError:
            error_msg = "The Excel file is empty"
            Log().add_log(error_msg, "student")
            return jsonify({"error": error_msg}), 400
            
        except pd.errors.ParserError:
            error_msg = "Unable to parse Excel file. Please check the file format"
            Log().add_log(error_msg, "student")
            return jsonify({"error": error_msg}), 400
            
        except Exception as e:
            error_msg = f"An error occurred while importing students: {str(e)}"
            Log().add_log(error_msg, "student")
            return jsonify({"error": error_msg}), 400

    def update_student_by_id(self, student_id, is_student=True):
        """Updating student."""
        updated_data=''
        if request.is_json:
            updated_data = request.get_json()
        student = database.students_collection.find_one({"student_id": str(student_id)})

        if student and not is_student:
            database.students_collection.update_one(
                {"student_id": student_id}, {"$set": request.form}
            )
            return jsonify({"message": "Student updated"}), 200

        if "student" not in session and "user" not in session and "employer" not in session:
            return jsonify({"error": "You are not logged in"}), 401
        if "student" in session:
            if (
                    is_student
                    and str(student["student_id"]) != session["student"]["student_id"]
            ):
                return (
                    jsonify({"error": "You are not authorized to update this student"}),
                    403,
                )
        if request.form.get("comments"):
            student["comments"] = request.form.get("comments")
        if request.form.get("skills"):
            #Convert the json file to a Python list, otherwise the skills in the database will not be stored in array form.
            skills_list = json.loads(request.form.get("skills"))
            student["skills"] = skills_list
        if request.form.get("attempted_skills"):
            student["attempted_skills"] = request.form.get("attempted_skills")
        if request.form.get("has_car"):
            student["has_car"] = request.form.get("has_car")
        if request.form.get("placement_duration"):
            student["placement_duration"] = request.form.get("placement_duration")
        if request.form.get("modules"):
            student["modules"] = request.form.get("modules")
        if request.form.get("course"):
            student["course"] = request.form.get("course")
        if "first_name" in updated_data:
            student["first_name"] = updated_data["first_name"]
        if "last_name" in updated_data:
            student["last_name"] = updated_data["last_name"]
        if "email" in updated_data:
            student["email"] = updated_data["email"]
        if "student_id" in updated_data:  # Assuming "Student Number" is stored as "student_id"
            student["student_id"] = updated_data["student_id"]

        if student and is_student:
            database.students_collection.update_one(
                {"student_id": str(student_id)}, {"$set": student}
            )
            return jsonify({"message": "Student updated"}), 200

        if not is_student:
            database.students_collection.delete_one({"student_id": student_id})
            database.students_collection.insert_one(request.form)
            return jsonify({"message": "Student updated"}), 200

        return jsonify({"error": "Student not found"}), 404

    def student_login(self):
        """Handle student login."""
        student_id = request.form.get("student_id")
        password = request.form.get("password")
        # Find the student by email
        student = database.students_collection.find_one({"student_id": student_id})

        if student and pbkdf2_sha256.verify(password, student["password"]):
            # Assuming you have a session management system
            del student["_id"]
            session["student"] = student
            session["student_logged_in"] = True
            return jsonify({"message": "Login successful"}), 200

        return jsonify({"error": "Invalid Student Number or password"}), 401

    def change_password(self):
        """Change user password."""
        student = session.get("student")
        if not student:
            return jsonify("Error - Student not logged in"), 401

        old_password = request.form.get("old_password")
        new_password = request.form.get("new_password")
        confirm_password = request.form.get("confirm_password")
        # made changes below
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
        """Sets a students preferences."""
        student = database.students_collection.find_one({"student_id": str(student_id)})
        if not student:
            return jsonify({"error": "Student not found"}), 404
        preferences = [a[5:] for a in request.form.get("ranks").split(",")]
        database.students_collection.update_one(
            {"student_id": str(student_id)}, {"$set": {"preferences": preferences}}
        )
        return jsonify({"message": "Preferences updated"}), 200

    def get_opportunities_by_student(self, student_id):
        """Get opportunities that a student could do"""
        find_student = self.get_student_by_id(student_id)

        if not find_student:
            return jsonify({"error": "Student not found"}), 404

        opportunities = Opportunity().get_opportunities()

        student = find_student
        student["modules"] = set(
            d.strip().replace('"', "")
            for d in student["modules"][1:-1].split(",")
            if d.strip().replace('"', "") != ""
        )

        valid_opportunities = []
        for opportunity in opportunities:
            modules_required = set(
                module.strip().replace('"', "")
                for module in opportunity["modules_required"][1:-1].split(",")
                if module.strip().replace('"', "") != ""
            )

            if modules_required.issubset(student["modules"]):
                if (
                        student["course"] in opportunity["courses_required"]
                        or opportunity["courses_required"] == ""
                ):
                    if opportunity["duration"] in student["placement_duration"]:
                        valid_opportunities.append(opportunity)

        return valid_opportunities
