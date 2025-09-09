"""
Handles connection to the MongoDB database and provides access to the collections.
"""
  
import datetime
import os
import sys
from flask import jsonify
import pymongo
from dotenv import load_dotenv
import dns.resolver
from logs.models import Log
load_dotenv()
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8']

client: pymongo.MongoClient = pymongo.MongoClient()
db = client.get_database("Finalproject_db")
__all__ = ['db']
if os.getenv("IS_GITHUB_ACTIONS") == "False":
    db_url = os.getenv("DB_LOGIN")
    print(f"Connecting to MongoDB with URL: {db_url}")
    client = pymongo.MongoClient(db_url)

try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
    # Print server information
    server_info = client.server_info()
    print(f"MongoDB Server Info: {server_info}")
    print(f"Available databases: {client.list_database_names()}")
    
    # Access the specific database
    database = client["Finalproject_db"]
    # Print all collections in the database
    collections = database.list_collection_names()
    print(f"Collections in 'Finalproject_db': {collections}")

except pymongo.errors.ConfigurationError as e:
    print(f"Configuration error: {e}")
    sys.exit(1)
except pymongo.errors.OperationFailure as e:
    print(f"Operation failure: {e}")
    sys.exit(1)
except pymongo.errors.ServerSelectionTimeoutError as e:
    print(f"Server selection timeout error: {e}")
    sys.exit(1)

users_collection = database["users"]
students_collection = database["students"]
opportunities_collection = database["opportunities"]
courses_collection = database["courses"]
skills_collection = database["skills"]
attempted_skills_collection = database["attempted_skills"]
modules_collection = database["modules"]
employers_collection = database["employers"]
deadline_collection = database["deadline"]
logs_collection = database["logs"]


def get_details_deadline():
    """Get the deadline from the database."""
    find_deadline = deadline_collection.find_one({"type": 0})
    if not find_deadline:
        deadline = datetime.datetime.now().strftime("%Y-%m-%d")
        deadline_collection.insert_one({"type": 0, "deadline": deadline})
    else:
        deadline = find_deadline["deadline"]
    return deadline


def is_past_details_deadline():
    """Check if the deadline has passed."""
    deadline = get_details_deadline()
    return datetime.datetime.now().strftime("%Y-%m-%d") >= deadline


def get_student_ranking_deadline():
    """Get the deadline from the database."""
    find_deadline = deadline_collection.find_one({"type": 1})
    if not find_deadline:
        deadline = (
            datetime.datetime.strptime(get_details_deadline(), "%Y-%m-%d")
            + datetime.timedelta(weeks=1)
        ).strftime("%Y-%m-%d")
        deadline_collection.insert_one({"type": 1, "deadline": deadline})
    else:
        deadline = find_deadline["deadline"]
    return deadline


def is_past_student_ranking_deadline():
    """Check if the deadline has passed."""
    deadline = get_student_ranking_deadline()
    return datetime.datetime.now().strftime("%Y-%m-%d") >= deadline


def get_opportunities_ranking_deadline():
    """Get the deadline from the database."""
    find_deadline = deadline_collection.find_one({"type": 2})
    if not find_deadline:
        deadline = (
            datetime.datetime.strptime(get_student_ranking_deadline(), "%Y-%m-%d")
            + datetime.timedelta(weeks=1)
        ).strftime("%Y-%m-%d")
        deadline_collection.insert_one({"type": 2, "deadline": deadline})
    else:
        deadline = find_deadline["deadline"]
    return deadline


def is_past_opportunities_ranking_deadline():
    """Check if the deadline has passed."""
    deadline = get_opportunities_ranking_deadline()
    return datetime.datetime.now().strftime("%Y-%m-%d") >= deadline


def update_deadlines(
    details_deadline, student_ranking_deadline, opportunities_ranking_deadline
):
    """Update the deadlines in the database."""

    try:
        datetime.datetime.strptime(details_deadline, "%Y-%m-%d")
        datetime.datetime.strptime(student_ranking_deadline, "%Y-%m-%d")
        datetime.datetime.strptime(opportunities_ranking_deadline, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid deadline format. Use YYYY-MM-DD."}), 400

    if details_deadline > student_ranking_deadline:
        return (
            jsonify(
                {
                    "error": "Details deadline cannot be later than Student Ranking deadline."
                }
            ),
            400,
        )
    if student_ranking_deadline > opportunities_ranking_deadline:
        return (
            jsonify(
                {
                    "error": (
                        "Student Ranking deadline cannot be later than "
                        "Employers ranking deadline."
                    )
                }
            ),
            400,
        )
    if details_deadline > opportunities_ranking_deadline:
        return (
            jsonify(
                {
                    "error": "Details deadline cannot be later than Employers ranking deadline."
                }
            ),
            400,
        )

    # Check if the new deadlines are different from the current ones
    current_details_deadline = get_details_deadline()
    current_student_ranking_deadline = get_student_ranking_deadline()
    current_opportunities_ranking_deadline = get_opportunities_ranking_deadline()

    if (details_deadline == current_details_deadline and
        student_ranking_deadline == current_student_ranking_deadline and
        opportunities_ranking_deadline == current_opportunities_ranking_deadline):
        return jsonify({"message": "No changes detected, update skipped."}), 200

    # Update each deadline only if it has changed
    if details_deadline != current_details_deadline:
        deadline_collection.update_one(
            {"type": 0}, {"$set": {"deadline": details_deadline}}
        )
        Log().add_log(f"Deadline {details_deadline} set for details deadline", "details_deadline")

    if student_ranking_deadline != current_student_ranking_deadline:
        deadline_collection.update_one(
            {"type": 1}, {"$set": {"deadline": student_ranking_deadline}}
        )
        Log().add_log(f"Deadline {student_ranking_deadline} set for student ranking deadline", "student_ranking_deadline")

    if opportunities_ranking_deadline != current_opportunities_ranking_deadline:
        deadline_collection.update_one(
            {"type": 2}, {"$set": {"deadline": opportunities_ranking_deadline}}
        )
        Log().add_log(f"Deadline {opportunities_ranking_deadline} set for Employers ranking deadline", "opportunities_ranking_deadline")

    return jsonify({"message": "All deadlines updated successfully"}), 200
