import pytest
from unittest.mock import patch
from flask import Flask, session
from passlib.hash import pbkdf2_sha256
from tests.student_testable import Student


@pytest.fixture
def app():
    app = Flask(__name__)
    app.secret_key = "test"
    return app


def test_add_student_success(app):
    with app.test_request_context(method='POST', data={
        'first_name': 'Alice',
        'last_name': 'Smith',
        'email': 'alice@example.com',
        'student_id': '12345678',
        'overwrite': ''
    }):
        student = Student()
        with patch("core.database.students_collection.find_one", return_value=None), \
             patch("core.database.students_collection.insert_one") as mock_insert:
            response = student.add_student()
            assert response[1] == 200
            mock_insert.assert_called_once()


def test_add_student_duplicate(app):
    with app.test_request_context(method='POST', data={
        'first_name': 'Bob',
        'last_name': 'Smith',
        'email': 'bob@example.com',
        'student_id': '12345678',
        'overwrite': ''
    }):
        student = Student()
        with patch("core.database.students_collection.find_one", return_value={"student_id": "12345678"}):
            response = student.add_student()
            assert response[1] == 400
            assert b"Student already in database" in response[0].data


def test_get_student_by_id_found():
    student = Student()
    with patch("core.database.students_collection.find_one", return_value={"student_id": "12345678"}) as mock_find:
        result = student.get_student_by_id("12345678")
        assert result["student_id"] == "12345678"
        mock_find.assert_called_once()


def test_get_student_by_id_not_found():
    student = Student()
    with patch("core.database.students_collection.find_one", return_value=None):
        result = student.get_student_by_id("00000000")
        assert result is None


def test_generate_excel_file():
    student = Student()
    mock_students = [{"_id": "1", "first_name": "Alice", "last_name": "Smith", "email": "a@a.com"}]
    with patch("core.database.students_collection.find", return_value=mock_students):
        output = student.generate_excel_file()
        assert output is not None
        assert output.read() != b""


def test_delete_student_by_id_success(app):
    with app.test_request_context():
        student = Student()
        with patch("core.database.students_collection.find_one", return_value={"student_id": "123"}), \
             patch("core.database.students_collection.delete_one") as mock_delete, \
             patch("logs.models.Log.add_log"):
            response = student.delete_student_by_id("123")
            assert response[1] == 200
            mock_delete.assert_called_once()


def test_delete_student_by_id_not_found(app):
    with app.test_request_context():
        student = Student()
        with patch("core.database.students_collection.find_one", return_value=None):
            response = student.delete_student_by_id("999")
            assert response[1] == 404


def test_student_login_success(app):
    with app.test_request_context(method='POST', data={
        'student_id': '12345678',
        'password': 'testpass'
    }):
        hashed_pass = pbkdf2_sha256.hash("testpass")
        mock_student = {
            "_id": "mocked_id",  
            "student_id": "12345678",
            "password": hashed_pass
        }
        with patch("core.database.students_collection.find_one", return_value=mock_student):
            student = Student()
            response = student.student_login()
            assert response[1] == 200
            assert b"Login successful" in response[0].data


def test_student_login_fail(app):
    with app.test_request_context(method='POST', data={
        'student_id': '12345678',
        'password': 'wrongpass'
    }):
        hashed_pass = pbkdf2_sha256.hash("correctpass")
        with patch("core.database.students_collection.find_one", return_value={"student_id": "12345678", "password": hashed_pass}):
            student = Student()
            response = student.student_login()
            assert response[1] == 401
            assert b"Invalid Student Number or password" in response[0].data
def test_change_password_success(app):
    with app.test_request_context(method='POST', data={
        'old_password': 'old123',
        'new_password': 'new456',
        'confirm_password': 'new456'
    }):
        student = Student()
        student_id = 's001'
        hashed_old = pbkdf2_sha256.hash("old123")
        session["student"] = {"student_id": student_id}
        with patch("core.database.students_collection.find_one", return_value={"student_id": student_id, "password": hashed_old}), \
             patch("core.database.students_collection.update_one") as mock_update:
            response = student.change_password()
            assert response[1] == 200
            assert b"Password updated successfully" in response[0].data
            mock_update.assert_called_once()


def test_change_password_wrong_old(app):
    with app.test_request_context(method='POST', data={
        'old_password': 'wrongpass',
        'new_password': 'new456',
        'confirm_password': 'new456'
    }):
        student = Student()
        student_id = 's001'
        hashed_correct = pbkdf2_sha256.hash("correctpass")
        session["student"] = {"student_id": student_id}
        with patch("core.database.students_collection.find_one", return_value={"student_id": student_id, "password": hashed_correct}):
            response = student.change_password()
            assert response[1] == 400
            assert b"Invalid old password" in response[0].data


def test_change_password_mismatch(app):
    with app.test_request_context(method='POST', data={
        'old_password': 'old123',
        'new_password': 'new123',
        'confirm_password': 'new999'
    }):
        student = Student()
        student_id = 's001'
        hashed_old = pbkdf2_sha256.hash("old123")
        session["student"] = {"student_id": student_id}
        with patch("core.database.students_collection.find_one", return_value={"student_id": student_id, "password": hashed_old}):
            response = student.change_password()
            assert response[1] == 400
            assert b"Passwords don't match" in response[0].data


def test_rank_preferences(app):
    with app.test_request_context(method='POST', data={
        'ranks': 'rank_abc,rank_xyz'
    }):
        student = Student()
        session["student"] = {"student_id": "stu01"}
        with patch("core.database.students_collection.find_one", return_value={"student_id": "stu01"}), \
             patch("core.database.students_collection.update_one") as mock_update:
            response = student.rank_preferences("stu01")
            assert response[1] == 200
            assert b"Preferences updated" in response[0].data
            mock_update.assert_called_once()
