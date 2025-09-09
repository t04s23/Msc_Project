"""
Script to migrate log entries to use new datetime format.
This script will update existing log entries in the database to use the new format
with DateTime as a proper datetime object and formatted_date as a string.

Run this script once after deploying the updated code.
"""

from datetime import datetime
from core import database

def migrate_logs():
    """Migrate existing logs to new datetime format."""
    print("Starting log migration...")
    logs_collection = database.logs_collection
    logs = list(logs_collection.find())
    
    updated_count = 0
    for log in logs:
        # Skip logs that already have the new format
        if isinstance(log.get('DateTime'), datetime):
            continue
            
        try:
            date_str = log.get('DateTime')
            if not date_str:
                continue
                
            # Parse the date string (DD-MM-YYYY HH:MM:SS)
            try:
                date_obj = datetime.strptime(date_str, "%d-%m-%Y %H:%M:%S")
            except ValueError:
                print(f"Error parsing date '{date_str}' for log ID {log['_id']}")
                continue
                
            # Update the log with the new format
            logs_collection.update_one(
                {'_id': log['_id']},
                {
                    '$set': {
                        'DateTime': date_obj,
                        'formatted_date': date_str
                    }
                }
            )
            updated_count += 1
            
        except Exception as e:
            print(f"Error updating log {log.get('_id')}: {str(e)}")
    
    print(f"Migration complete. Updated {updated_count} log entries.")

if __name__ == "__main__":
    migrate_logs() 