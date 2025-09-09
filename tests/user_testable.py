# tests/user_testable.py

import uuid
from flask import jsonify, request, session
from email.mime.text import MIMEText
from passlib.hash import pbkdf2_sha256
from core import database, email_handler
from opportunities.models import Opportunity
from employers.models import Employers
from tests.student_testable import Student  

class User:
    def start_session(self, user):
        del user["password"]
        session["logged_in"] = True
        session["user"] = {"_id": user["_id"], "name": user["name"]}
        return jsonify(session["user"]), 200

    def register(self):
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        if password != confirm_password:
            return jsonify({"error": "Passwords don't match"}), 400

        user = {
            "_id": uuid.uuid1().hex,
            "name": request.form.get("name"),
            "email": request.form.get("email"),
            "password": pbkdf2_sha256.hash(password),
        }

        if database.users_collection.find_one({"email": user["email"]}):
            return jsonify({"error": "Email address already in use"}), 400

        database.users_collection.insert_one(user)
        return self.start_session(user)

    def login(self):
        session.clear()
        user = database.users_collection.find_one({"email": request.form.get("email")})

        if user and pbkdf2_sha256.verify(request.form.get("password"), user["password"]):
            return self.start_session(user)

        return jsonify({"error": "Invalid login credentials"}), 401

    def change_password(self):
        user = session.get("user")
        if not user:
            return jsonify("Error - User not logged in"), 401

        old_password = request.form.get("old_password")
        new_password = request.form.get("new_password")
        confirm_password = request.form.get("confirm_password")

        stored_user = database.users_collection.find_one({"_id": user["_id"]})
        if not stored_user or not pbkdf2_sha256.verify(old_password, stored_user["password"]):
            return jsonify({"error": "Invalid old password"}), 400

        if new_password != confirm_password:
            return jsonify({"error": "Passwords don't match"}), 400

        database.users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": pbkdf2_sha256.hash(new_password)}}
        )
        return jsonify({"message": "Password updated successfully"}), 200

    def change_deadline(self):
        details_deadline = request.form.get("details_deadline")
        student_ranking_deadline = request.form.get("student_ranking_deadline")
        opportunities_ranking_deadline = request.form.get("opportunities_ranking_deadline")

        response = database.update_deadlines(details_deadline, student_ranking_deadline, opportunities_ranking_deadline)
        if response[1] != 200:
            return response
        return jsonify({"message": "All deadlines updated successfully"}), 200

    def send_match_email(self):
        student = Student().get_student_by_uuid(request.form.get("student"))
        opportunity = Opportunity().get_opportunity_by_id(request.form.get("opportunity"))
        employer_name = Employers().get_company_name(opportunity["employer_id"])

        recipients = [
            request.form.get("student_email"),
            request.form.get("employer_email"),
        ]

        body = (
            f"<p>Dear {student['first_name']},</p>"
            f"<p>Congratulations! You have been matched with <strong>{employer_name}</strong> for "
            f"the opportunity: <strong>{opportunity['title']}</strong>. Please contact them at "
            f"<a href='mailto:{request.form.get('employer_email')}'>{request.form.get('employer_email')}</a> "
            f"to discuss further details.</p>"
            "<p>Best Regards,<br>Placement Matching System</p>"
        )

        msg = MIMEText(body, "html")
        msg["Subject"] = "Placement Matching System: Matched with an opportunity"
        msg["To"] = ", ".join(recipients)

        email_handler.send_email(msg, recipients)
        return jsonify({"message": "Email Sent"}), 200

    def get_user_email_by_id(self, user_id):
        user = database.users_collection.find_one({"_id": user_id})
        return user.get("email") if user else None
