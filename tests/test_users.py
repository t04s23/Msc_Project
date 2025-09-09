import pytest
from flask import Flask, jsonify, session
from unittest.mock import patch
from passlib.hash import pbkdf2_sha256
from tests.user_testable import User  


@pytest.fixture
def app():
    app = Flask(__name__)
    app.secret_key = "test"
    return app


def test_register_success(app):
    with app.test_request_context(method="POST", data={
        "name": "Admin",
        "email": "admin@test.com",
        "password": "pass123",
        "confirm_password": "pass123"
    }):
        user = User()
        with patch("core.database.users_collection.find_one", return_value=None), \
             patch("core.database.users_collection.insert_one"):
            response = user.register()
            assert response[1] == 200
            assert b"name" in response[0].data


def test_register_email_in_use(app):
    with app.test_request_context(method="POST", data={
        "name": "Admin",
        "email": "admin@test.com",
        "password": "pass123",
        "confirm_password": "pass123"
    }):
        user = User()
        with patch("core.database.users_collection.find_one", return_value={"email": "admin@test.com"}):
            response = user.register()
            assert response[1] == 400
            assert b"Email address already in use" in response[0].data


def test_register_password_mismatch(app):
    with app.test_request_context(method="POST", data={
        "name": "Admin",
        "email": "admin@test.com",
        "password": "pass123",
        "confirm_password": "wrong123"
    }):
        user = User()
        response = user.register()
        assert response[1] == 400
        assert b"Passwords don't match" in response[0].data


def test_login_success(app):
    password = "mypassword"
    hashed = pbkdf2_sha256.hash(password)
    with app.test_request_context(method="POST", data={
        "email": "user@example.com",
        "password": password
    }):
        user = User()
        with patch("core.database.users_collection.find_one", return_value={
            "_id": "1", "name": "User", "email": "user@example.com", "password": hashed
        }):
            response = user.login()
            assert response[1] == 200
            assert b"User" in response[0].data


def test_login_invalid_credentials(app):
    with app.test_request_context(method="POST", data={
        "email": "user@example.com",
        "password": "wrongpass"
    }):
        user = User()
        with patch("core.database.users_collection.find_one", return_value=None):
            response = user.login()
            assert response[1] == 401
            assert b"Invalid login credentials" in response[0].data


def test_change_password_success(app):
    user_id = "abc123"
    with app.test_request_context(method="POST", data={
        "old_password": "oldpass",
        "new_password": "newpass",
        "confirm_password": "newpass"
    }):
        session["user"] = {"_id": user_id}
        hashed_old = pbkdf2_sha256.hash("oldpass")
        user = User()
        with patch("core.database.users_collection.find_one", return_value={
            "_id": user_id, "password": hashed_old
        }), patch("core.database.users_collection.update_one") as mock_update:
            response = user.change_password()
            assert response[1] == 200
            assert b"Password updated successfully" in response[0].data
            mock_update.assert_called_once()


def test_change_password_wrong_old(app):
    with app.test_request_context(method="POST", data={
        "old_password": "wrongpass",
        "new_password": "newpass",
        "confirm_password": "newpass"
    }):
        session["user"] = {"_id": "abc123"}
        hashed_correct = pbkdf2_sha256.hash("correctpass")
        user = User()
        with patch("core.database.users_collection.find_one", return_value={
            "_id": "abc123", "password": hashed_correct
        }):
            response = user.change_password()
            assert response[1] == 400
            assert b"Invalid old password" in response[0].data


def test_change_password_mismatch(app):
    with app.test_request_context(method="POST", data={
        "old_password": "oldpass",
        "new_password": "newpass",
        "confirm_password": "wrongnew"
    }):
        session["user"] = {"_id": "abc123"}
        hashed_old = pbkdf2_sha256.hash("oldpass")
        user = User()
        with patch("core.database.users_collection.find_one", return_value={
            "_id": "abc123", "password": hashed_old
        }):
            response = user.change_password()
            assert response[1] == 400
            assert b"Passwords don't match" in response[0].data


def test_change_deadline_success(app):
    with app.test_request_context(method="POST", data={
        "details_deadline": "2025-05-01",
        "student_ranking_deadline": "2025-05-08",
        "opportunities_ranking_deadline": "2025-05-15"
    }):
        user = User()
        with patch("core.database.update_deadlines", return_value=(jsonify({"message": "All deadlines updated successfully"}), 200)):
            response = user.change_deadline()
            assert response[1] == 200
            assert b"All deadlines updated successfully" in response[0].data


def test_get_user_email_by_id():
    user = User()
    with patch("core.database.users_collection.find_one", return_value={"email": "admin@example.com"}):
        result = user.get_user_email_by_id("someid")
        assert result == "admin@example.com"


def test_send_match_email(app):
    with app.test_request_context(method="POST", data={
        "student": "stu01",
        "opportunity": "opp01",
        "student_email": "student@example.com",
        "employer_email": "employer@example.com"
    }):
        user = User()
        with patch("opportunities.models.Opportunity.get_opportunity_by_id", return_value={
            "title": "Internship", "employer_id": "emp01"
        }), patch("employers.models.Employers.get_company_name", return_value="ABC Corp"), \
             patch("core.email_handler.send_email") as mock_email, \
             patch("tests.student_testable.Student.get_student_by_uuid", return_value={"first_name": "Alice"}):
            response = user.send_match_email()
            assert response[1] == 200
            assert b"Email Sent" in response[0].data
            mock_email.assert_called_once()
