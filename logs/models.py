from datetime import datetime
from flask import jsonify, request
from core import database
import uuid

class Log:
    """Log class."""

    def add_log(self, message, event_type):
        """Add a new log entry."""
        current_time = datetime.now()
        log_entry = {
            "_id": uuid.uuid1().hex,
            "message": message,
            "event_type": event_type,
            "DateTime": current_time,  # Store actual datetime object
            "formatted_date": current_time.strftime("%d-%m-%Y %H:%M:%S"),  # Store formatted date for display
            "event_type": event_type
        }
        database.logs_collection.insert_one(log_entry)
        log_entry["_id"] = str(log_entry["_id"])
        return jsonify(log_entry), 201

    def get_logs(self):
        """Get all log entries."""
        logs = list(database.logs_collection.find())
        for log in logs:
            if isinstance(log.get('DateTime'), datetime):
                log['formatted_date'] = log['DateTime'].strftime("%d-%m-%Y %H:%M:%S")
        return logs

    def get_logs_count(self):
        """Get total number of logs."""
        return database.logs_collection.count_documents({})

    def get_logs_paginated(self, page, per_page):
        """Get paginated log entries.
        
        Args:
            page (int): Page number (1-based)
            per_page (int): Number of items per page
            
        Returns:
            list: List of log entries for the requested page
        """
        skip = (page - 1) * per_page
        logs = list(database.logs_collection.find().sort("DateTime", -1).skip(skip).limit(per_page))
        
        # Format date for display
        for log in logs:
            # Convert DateTime to string format if it's a datetime object
            if isinstance(log.get('DateTime'), datetime):
                log['formatted_date'] = log['DateTime'].strftime("%d-%m-%Y %H:%M:%S")
            elif 'formatted_date' not in log and 'DateTime' in log:
                # For backwards compatibility with older logs
                log['formatted_date'] = log['DateTime']
        
        return logs

    # def delete_log_by_id(self, log_id):
    #     """Delete a log entry by ID."""
    #     log = database.logs_collection.find_one({"_id": log_id})
    #     if log:
    #         database.logs_collection.delete_one({"_id": log_id})
    #         return jsonify({"message": "Log deleted"}), 200
    #     return jsonify({"error": "Log not found"}), 404
