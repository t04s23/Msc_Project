"""
Course module model.
"""

from io import BytesIO
import uuid
from datetime import datetime, timedelta
from flask import jsonify, request
import pandas as pd
from core import database
from logs.models import Log
# Cache to store modules and the last update time
modules_cache = {"data": None, "last_updated": None}


class Module:
    """Module data model"""

    def add_module(self):
        """Adds a module to the database."""
        module = {
            "_id": uuid.uuid1().hex,
            "module_id": request.form.get("module_id"),
            "module_name": request.form.get("module_name"),
            "module_description": request.form.get("module_description"),
        }

        if database.modules_collection.find_one(
            {"module_id": request.form.get("module_id")}
        ):
            return jsonify({"error": "module already in database"}), 400

        database.modules_collection.insert_one(module)

        if module:
            # Update cache
            modules = list(database.modules_collection.find())
            modules_cache["data"] = modules
            modules_cache["last_updated"] = datetime.now()
            return jsonify(module), 200

        return jsonify({"error": "module not added"}), 400

    def delete_module(self):
        """Deletes a module from the database."""
        module = database.modules_collection.find_one(
            {"module_id": request.form.get("module_id")}
        )

        if not module:
            return jsonify({"error": "module not found"}), 404

        database.modules_collection.delete_one(
            {"module_id": request.form.get("module_id")}
        )

        # Update cache
        modules = list(database.modules_collection.find())
        modules_cache["data"] = modules
        modules_cache["last_updated"] = datetime.now()
        log_message = f"Module {module['module_id']} deleted"
        Log().add_log(log_message, "module")
        return jsonify(module), 200

    def get_module_by_id(self, module_id=None):
        """Retrieves a module by its ID."""
        if module_id is None:
            module_id = request.form.get("module_id")
        module = database.modules_collection.find_one({"module_id": module_id})

        if module:
            return module

        return None

    def get_module_name_by_id(self, module_id):
        """Get module name by id"""
        module = self.get_module_by_id(module_id)
        if not module:
            return None
        return module["module_name"]

    def get_modules(self):
        """Retrieves all modules."""
        current_time = datetime.now()
        one_week_ago = current_time - timedelta(weeks=1)

        # Check if cache is valid
        if (
            modules_cache["data"]
            and modules_cache["last_updated"]
            and modules_cache["last_updated"] > one_week_ago
        ):
            return modules_cache["data"]

        # Fetch modules from the database
        modules = list(database.modules_collection.find())

        if modules:
            # Update cache
            modules_cache["data"] = modules
            modules_cache["last_updated"] = current_time
            return modules

        return []
    
    def get_modules_count(self):
        """Get total count of modules."""
        return database.modules_collection.count_documents({})

    def get_modules_paginated(self, page, per_page):
        """Get paginated modules."""
        skip = (page - 1) * per_page
        modules = list(database.modules_collection.find().skip(skip).limit(per_page))
        return modules
        

    def generate_excel_file(self):
        try:
            modules = list(database.modules_collection.find())

            for module in modules:
                module['_id'] = str(module['_id'])
            df = pd.DataFrame(modules)

            output = BytesIO()

            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Course-Data')
            
            output.seek(0)
            return output
        except Exception as e:
            print(f"Error in generate_excel_file: {str(e)}")
            raise
