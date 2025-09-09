import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
import uuid
from io import BytesIO
from flask import Flask, request
import mongomock
from werkzeug.datastructures import ImmutableMultiDict
import pandas as pd

class TestSkills(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Initialize test environment before all tests"""
        cls.app = Flask(__name__)
        cls.app.config['TESTING'] = True
        
        # Create mongomock database
        cls.client = mongomock.MongoClient()
        cls.db = cls.client.Finalproject_db
        
        # Create all required collections
        cls.db.skills_collection = cls.db.skills
        cls.db.attempted_skills_collection = cls.db.attempted_skills
        
        # Setup mock patches
        cls.patchers = [
            patch('skills.models.database.db', cls.db),
            patch('core.database.db', cls.db),
            patch('skills.models.database.skills_collection', cls.db.skills_collection),
            patch('core.database.skills_collection', cls.db.skills_collection),
            patch('core.database.attempted_skills_collection', cls.db.attempted_skills_collection),
            patch('logs.models.Log', autospec=True)
        ]
        
        # Start all patches and save references
        cls.mock_log = patch('skills.models.Log', autospec=True).start()
        cls.mocks = [patcher.start() for patcher in cls.patchers]
        cls.mock_log = cls.mocks[-1]

    @classmethod 
    def tearDownClass(cls):
        """Clean up after all tests"""
        for patcher in cls.patchers:
            patcher.stop()

    def setUp(self):
        """Set up before each test"""
        self.client = self.app.test_client()
        
        # Test data
        self.test_skill = {
            "_id": str(uuid.uuid4()),
            "skill_name": "Python",
            "skill_description": "Programming language"
        }
        self.db.skills_collection.insert_one(self.test_skill.copy())
        
        # Import class under test
        from skills.models import Skill
        self.skill = Skill()
        
        # Set up Flask app context for testing
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        """Clean up after each test"""
        self.db.skills_collection.drop()
        self.db.attempted_skills_collection.drop()
        self.app_context.pop()
        # Clear cache
        from skills.models import skills_cache
        skills_cache["data"] = []
        skills_cache["last_updated"] = datetime.now()

    def test_find_skill(self):
        """Test finding a skill by name or ID"""
        # Test finding by name
        found_skill = self.skill.find_skill(skill_name="Python")
        self.assertEqual(found_skill["_id"], self.test_skill["_id"])
        
        # Test finding by ID
        found_skill = self.skill.find_skill(skill_id=self.test_skill["_id"])
        self.assertEqual(found_skill["skill_name"], "Python")
        
        # Test not found
        not_found = self.skill.find_skill(skill_name="Nonexistent")
        self.assertIsNone(not_found)

    def test_add_skill(self):
        """Test adding a new skill"""
        form_data = ImmutableMultiDict([
            ("skill_name", "JavaScript"),
            ("skill_description", "Web programming language")
        ])
        
        with self.app.test_request_context(method='POST', data=form_data):
            response, status_code = self.skill.add_skill()
            self.assertEqual(status_code, 200)
            self.assertEqual(response.json["skill_name"], "JavaScript")
            
            # Test duplicate skill
            response, status_code = self.skill.add_skill()
            self.assertEqual(status_code, 400)
            
        # Test missing fields
        with self.app.test_request_context(method='POST', data=ImmutableMultiDict()):
            response, status_code = self.skill.add_skill()
            self.assertEqual(status_code, 400)

    def test_delete_skill(self):
        """Test deleting a skill"""
        # Test successful deletion
        with self.app.test_request_context(method='POST', data={"skill_id": self.test_skill["_id"]}):
            response, status_code = self.skill.delete_skill(self.test_skill["_id"])
            self.assertEqual(status_code, 200)
            self.assertIsNone(self.db.skills_collection.find_one({"_id": self.test_skill["_id"]}))
            
        # Test deleting non-existent skill
        with self.app.test_request_context():
            response, status_code = self.skill.delete_skill("nonexistent_id")
            self.assertEqual(status_code, 404)

    def test_get_skill_by_id(self):
        """Test getting skill by ID"""
        skill = self.skill.get_skill_by_id(self.test_skill["_id"])
        self.assertEqual(skill["skill_name"], "Python")
        
        skill = self.skill.get_skill_by_id("nonexistent_id")
        self.assertIsNone(skill)

    def test_get_skill_name_by_id(self):
        """Test getting skill name by ID"""
        skill_name = self.skill.get_skill_name_by_id(self.test_skill["_id"])
        self.assertEqual(skill_name, "Python")
        
        skill_name = self.skill.get_skill_name_by_id("nonexistent_id")
        self.assertIsNone(skill_name)

    def test_get_skills(self):
        """Test getting all skills"""
        # Test with cache empty
        skills = self.skill.get_skills()
        self.assertEqual(len(skills), 1)
        self.assertEqual(skills[0]["skill_name"], "Python")
        
        # Test with cache populated
        skills = self.skill.get_skills()
        self.assertEqual(len(skills), 1)
        
        # Test cache invalidation after 1 week
        from skills.models import skills_cache
        skills_cache["last_updated"] = datetime.now() - timedelta(weeks=2)
        skills = self.skill.get_skills()
        self.assertEqual(len(skills), 1)

    def test_get_list_attempted_skills(self):
        """Test getting list of attempted skills"""
        # Add test data
        self.db.attempted_skills_collection.insert_one({
            "_id": str(uuid.uuid4()),
            "skill_name": "attempted",
            "used": 3
        })
        
        skills = self.skill.get_list_attempted_skills()
        self.assertEqual(len(skills), 1)
        self.assertEqual(skills[0]["skill_name"], "attempted")


    def test_get_skills_count(self):
        """Test getting skills count"""
        count = self.skill.get_skills_count()
        self.assertEqual(count, 1)
        
        # Add another skill
        self.db.skills_collection.insert_one({
            "_id": str(uuid.uuid4()),
            "skill_name": "Java",
            "skill_description": "Another language"
        })
        count = self.skill.get_skills_count()
        self.assertEqual(count, 2)

    def test_get_skills_paginated(self):
        """Test getting paginated skills"""
        # Add more skills for pagination testing
        for i in range(5):
            self.db.skills_collection.insert_one({
                "_id": str(uuid.uuid4()),
                "skill_name": f"Skill{i}",
                "skill_description": f"Description{i}"
            })
        
        # Total skills now: 6 (1 from setUp + 5 added here)
        
        # Test first page
        skills = self.skill.get_skills_paginated(1, 3)
        self.assertEqual(len(skills), 3)
        
        # Test second page
        skills = self.skill.get_skills_paginated(2, 3)
        self.assertEqual(len(skills), 3)
        
        # Test page beyond available data (should return empty list)
        skills = self.skill.get_skills_paginated(3, 3)
        self.assertEqual(len(skills), 0)
        
        # Test with different page size
        skills = self.skill.get_skills_paginated(1, 4)
        self.assertEqual(len(skills), 4)
        skills = self.skill.get_skills_paginated(2, 4)
        self.assertEqual(len(skills), 2)

if __name__ == '__main__':
    unittest.main()