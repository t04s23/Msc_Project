import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
import mongomock
from io import BytesIO
import pandas as pd
from flask import Flask

# Import the Opportunity class from the correct location
from opportunities.models import Opportunity
from employers.models import Employers
from core import database

class TestOpportunity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = Flask(__name__)
        cls.app.config['TESTING'] = True
        
        # Create a mongomock database
        cls.client = mongomock.MongoClient()
        cls.db = cls.client.Finalproject_db
        
        # Create all needed collections (using the exact same names as in production code)
        cls.db.opportunities_collection = cls.db.opportunities_collection
        cls.db.employers_collection = cls.db.employers_collection
        cls.db.modules_collection = cls.db.modules_collection
        cls.db.courses_collection = cls.db.courses_collection
        
        # Critical patch: Ensure that all possible data access paths are mocked
        cls.patchers = [
            patch('opportunities.models.database.db', cls.db),
            patch('core.database.db', cls.db),
            patch('opportunities.models.database.opportunities_collection', cls.db.opportunities_collection),
            patch('core.database.opportunities_collection', cls.db.opportunities_collection)
        ]
        
        for patcher in cls.patchers:
            patcher.start()

    @classmethod 
    def tearDownClass(cls):
        for patcher in cls.patchers:
            patcher.stop()
    @classmethod
    def setUpClass(cls):
        # Create a test Flask application
        cls.app = Flask(__name__)
        cls.app.config['TESTING'] = True
        
        # Set up mongomock collections
        cls.client = mongomock.MongoClient()
        cls.db = cls.client.Finalproject_db
        
        # Create all required collections
        cls.db.opportunities_collection = cls.db.opportunities
        cls.db.employers_collection = cls.db.employers
        cls.db.modules_collection = cls.db.modules
        cls.db.courses_collection = cls.db.courses
        
        # Patch the database module to use our mock
        cls.patcher = patch('core.database.db', cls.db)
        cls.patcher.start()

    @classmethod
    def tearDownClass(cls):
        cls.patcher.stop()

    def setUp(self):
        # Clear collections before each test
        self.db.opportunities_collection.delete_many({})
        self.db.employers_collection.delete_many({})
        self.db.modules_collection.delete_many({})
        self.db.courses_collection.delete_many({})
        
        # Insert test data
        self.test_employer = {
            "_id": "employer1",
            "company_name": "Test Company",
            "email": "test@company.com"
        }
        self.db.employers_collection.insert_one(self.test_employer)
        
        self.test_module = {
            "module_id": "MOD001",
            "module_name": "Test Module"
        }
        self.db.modules_collection.insert_one(self.test_module)
        
        self.test_course = {
            "course_id": "CRS001",
            "course_name": "Test Course"
        }
        self.db.courses_collection.insert_one(self.test_course)
        
        self.test_opportunity = {
            "_id": "opp1",
            "title": "Test Opportunity",
            "description": "Test Description",
            "url": "http://test.com",
            "employer_id": "employer1",
            "location": "Test Location",
            "modules_required": '["MOD001"]',
            "courses_required": '["CRS001"]',
            "spots_available": "5",
            "duration": "6 months"
        }
        self.db.opportunities_collection.insert_one(self.test_opportunity)
        
        # Initialize the Opportunity class
        self.opportunity = Opportunity()

    def test_add_update_opportunity_new(self):
        with self.app.test_request_context(), \
            patch('flask.request') as mock_request, \
            patch('core.database.opportunities_collection.find_one') as mock_find_one, \
            patch('core.database.opportunities_collection.insert_one') as mock_insert:

            # Simulate request data
            mock_request.form = {
                "_id": "opp2",
                    "title": "New Opportunity",
                    "description": "New Description",
                    "url": "http://new.com",
                    "employer_id": "employer1",
                    "location": "New Location",
                    "modules_required": '["MOD001"]',
                    "courses_required": '["CRS001"]',
                    "spots_available": "3",
                    "duration": "3 months"
            }

            # Simulate not finding existing records
            mock_find_one.return_value = None

            # Simulate insert operation
            mock_insert.return_value.inserted_id = "opp2"

            # Calling method
            result = self.opportunity.add_update_opportunity()

            # Verify the return value
            self.assertEqual(result["action"], "added")
            
            # Verify that insert is called
            mock_insert.assert_called_once()

    def test_add_update_opportunity_existing(self):
        with self.app.test_request_context(), \
            patch('flask.request') as mock_request, \
            patch('core.database.opportunities_collection.update_one') as mock_update, \
            patch('core.database.opportunities_collection.find_one') as mock_find_one:
            
           # Simulate request data - use the same ID as in setUp (opp1)
            mock_request.form = {
                "_id": "opp1",
                "title": "Updated Opportunity",
                "description": "Updated Description",
                "url": "http://updated.com",
                "employer_id": "employer1",
                "location": "Updated Location",
                "modules_required": '["MOD001"]',
                "courses_required": '["CRS001"]',
                "spots_available": "10",
                "duration": "12 months"
            }

            # Simulate an initial query to return existing records
            mock_find_one.return_value = {
                "_id": "opp1",
                "title": "Test Opportunity",  
                "description": "Test Description",
                "url": "http://test.com",
                "employer_id": "employer1",
                "location": "Test Location",
                "modules_required": '["MOD001"]',
                "courses_required": '["CRS001"]',
                "spots_available": "5",
                "duration": "6 months"
            }

            # Calling method
            result = self.opportunity.add_update_opportunity()

            # # Verify update_one is called
            mock_update.assert_called_once()

            # Simulate updated query to return new data
            mock_find_one.return_value = {
                "_id": "opp1",
                "title": "Updated Opportunity",  
                "description": "Updated Description",
                "url": "http://updated.com",
                "employer_id": "employer1",
                "location": "Updated Location",
                "modules_required": '["MOD001"]',
                "courses_required": '["CRS001"]',
                "spots_available": "10",
                "duration": "12 months"
            }

            
            self.assertEqual(result["action"], "updated")

            
            opp = mock_find_one({"_id": "opp1"})
            self.assertEqual(opp["title"], "Updated Opportunity")


    def test_search_opportunities(self):
    
        test_employer = {
            "_id": "employer1",
            "company_name": "Test Company",
            "email": "test@company.com"
        }
        
        test_opportunity = {
            "_id": "opp1",
            "title": "Test Opportunity",
            "employer_id": "employer1",  
            "modules_required": '["MOD001"]',
            "courses_required": '["CRS001"]'
        }
        
        test_module = {
            "module_id": "MOD001",
            "module_name": "Test Module"
        }
        
        test_course = {
            "course_id": "CRS001",
            "course_name": "Test Course"
        }

        # Test Company Name Search
        with patch('opportunities.models.database.employers_collection.find_one') as mock_emp_find, \
            patch('opportunities.models.database.opportunities_collection.find') as mock_opp_find, \
            patch('opportunities.models.Employers') as mock_employers, \
            patch('opportunities.models.database.modules_collection.find_one') as mock_mod_find, \
            patch('opportunities.models.database.courses_collection.find_one') as mock_course_find:
            
            # Set mock return values ​​- make sure the order and parameters are correct
            mock_emp_find.return_value = test_employer
            mock_opp_find.return_value = [test_opportunity]
            
            # Correctly mock the Employers class
            mock_employer_class = mock_employers.return_value
            mock_employer_class.get_employer_by_id.return_value = test_employer
            
            mock_mod_find.return_value = test_module
            mock_course_find.return_value = test_course
            
            # Perform a search
            opportunities = self.opportunity.search_opportunities(None, "Test Company")
            
            # Verify the results
            self.assertEqual(len(opportunities), 1)
            self.assertEqual(opportunities[0]["title"], "Test Opportunity")
            
            #Verifying database calls
            mock_emp_find.assert_called_with({"company_name": "Test Company"})
            mock_opp_find.assert_called_with({"employer_id": "employer1"})
        def test_get_opportunities_by_title(self):
            
            test_opportunity = {
                "_id": "opp1",
                "title": "Test Opportunity",  
                "description": "Test Description",
                
            }

            
            with patch('opportunities.models.database.opportunities_collection.find') as mock_find:
                
                mock_find.return_value = [test_opportunity]
                
                
                opportunities = self.opportunity.get_opportunities_by_title("Test")
                self.assertEqual(len(opportunities), 1)
                self.assertEqual(opportunities[0]["title"], "Test Opportunity")
                
                
                mock_find.assert_called_with({"title": {"$regex": "Test", "$options": "i"}})

            
            with patch('opportunities.models.database.opportunities_collection.find') as mock_find:
                mock_find.return_value = []
                
                opportunities = self.opportunity.get_opportunities_by_title("Nonexistent")
                self.assertEqual(len(opportunities), 0)

    def test_get_opportunities_by_company(self):
    
        test_employer = {
            "_id": "employer1",
            "company_name": "Test Company",
            "email": "test@company.com"
        }
        
        test_opportunity = {
            "_id": "opp1",
            "title": "Test Opportunity",
            "employer_id": "employer1",  
           
        }

      
        with patch('opportunities.models.database.employers_collection.find_one') as mock_employer_find, \
            patch('opportunities.models.database.opportunities_collection.find') as mock_opp_find:
            
            
            mock_employer_find.return_value = test_employer
            
            
            mock_opp_find.return_value = [test_opportunity]
            
           
            opportunities = self.opportunity.get_opportunities_by_company("Test Company")
            self.assertEqual(len(opportunities), 1)
            self.assertEqual(opportunities[0]["title"], "Test Opportunity")
            
            
            mock_employer_find.assert_called_with({"company_name": "Test Company"})
            mock_opp_find.assert_called_with({"employer_id": "employer1"})

        
        with patch('opportunities.models.database.employers_collection.find_one') as mock_employer_find:
            mock_employer_find.return_value = None
            
            opportunities = self.opportunity.get_opportunities_by_company("Nonexistent")
            self.assertEqual(len(opportunities), 0)

    def test_get_opportunity_by_id(self):
        test_opportunity = {
            "_id": "opp1",
            "title": "Test Opportunity",
            "description": "Test Description"
        }

        with self.app.test_request_context():
            # Case 1: Test to get an existing opportunity from the database (cache miss)
            with patch('opportunities.models.database.opportunities_collection.find_one') as mock_find_one, \
                patch('opportunities.models.database.opportunities_collection.find') as mock_find, \
                patch('opportunities.models.cache', {'data': None, 'last_updated': None}):
                
                mock_find_one.return_value = test_opportunity
                mock_find.return_value = [test_opportunity]
                
                opportunity = self.opportunity.get_opportunity_by_id("opp1")
                self.assertIsNotNone(opportunity)
                self.assertEqual(opportunity["title"], "Test Opportunity")
                mock_find_one.assert_called_with({"_id": "opp1"})

            #Case 2: Testing for a non-existent opportunity
            with patch('opportunities.models.database.opportunities_collection.find_one') as mock_find_one, \
                patch('opportunities.models.database.opportunities_collection.find') as mock_find, \
                patch('opportunities.models.cache', {'data': None, 'last_updated': None}):
                
                mock_find_one.return_value = None
                mock_find.return_value = []
                
                opportunity = self.opportunity.get_opportunity_by_id("nonexistent")
                self.assertIsNone(opportunity)

            # Case 3: Testing cache hits
            with patch('opportunities.models.cache', {
                'data': [test_opportunity],
                'last_updated': datetime.now() + timedelta(minutes=5)  # Future time, to ensure cache validity
            }), patch('opportunities.models.database.opportunities_collection.find_one') as mock_find_one:
                
                opportunity = self.opportunity.get_opportunity_by_id("opp1")
                self.assertIsNotNone(opportunity)
                self.assertEqual(opportunity["title"], "Test Opportunity")
                mock_find_one.assert_not_called()  # Make sure there are no calls to the database
        
    def test_get_opportunities(self):

        test_opportunity = {
            "_id": "opp1",
            "title": "Test Opportunity",
            "description": "Test Description",
            "url": "http://test.com",
            "employer_id": "employer1",
            "location": "Test Location",
            "modules_required": '["MOD001"]',
            "courses_required": '["CRS001"]',
            "spots_available": "5",
            "duration": "6 months"
        }

        with self.app.test_request_context():
            # Testing for cache misses - Return to list
            with patch('opportunities.models.database.opportunities_collection.find') as mock_find, \
                patch('opportunities.models.cache', {'data': None, 'last_updated': None}):
                
                mock_find.return_value = [test_opportunity]
                
                result = self.opportunity.get_opportunities()
                
                # The returned value is a list
                self.assertIsInstance(result, list)
                self.assertEqual(len(result), 1)
                self.assertEqual(result[0]["title"], "Test Opportunity")
                mock_find.assert_called_once()

            #Test cache hit - returns (response, status_code)
            with patch('opportunities.models.cache', {
                'data': [test_opportunity],
                'last_updated': datetime.now() + timedelta(minutes=5)
            }), patch('opportunities.models.database.opportunities_collection.find') as mock_find:
                
                result = self.opportunity.get_opportunities()
                
                # Verify that the returned value is a (response, status_code) tuple
                self.assertIsInstance(result, tuple)
                self.assertEqual(len(result), 2)
                self.assertEqual(result[1], 200)  # Status Code
                
                # Verify the response content
                response_data = result[0].json
                self.assertEqual(len(response_data), 1)
                self.assertEqual(response_data[0]["title"], "Test Opportunity")
                
                mock_find.assert_not_called()  # Make sure there are no calls to the database
    def test_delete_opportunities(self):
    # Use the same collection reference style as in production code
        from opportunities.models import database
        collection = database.opportunities_collection
        
        # Clear and insert test data
        collection.delete_many({})
        collection.insert_many([
            {"_id": "opp1", "title": "Test Opportunity"},
            {"_id": "opp2", "title": "Another Opportunity"}
        ])
        
        # Verify that the data has been inserted
        self.assertEqual(collection.count_documents({}), 2)
        
        with self.app.test_request_context():
            # Debug: Print collection references in production code
            print("Production code collection:", database.opportunities_collection)
            print("Production code db:", database.db)
            
            result = self.opportunity.delete_opportunities()
            print("Method returns:", result)
            print("Current Database:", list(collection.find({})))
            
            # 检查返回结果
            self.assertEqual(result[0].json, {"message": "All opportunities deleted"})
            self.assertEqual(collection.count_documents({}), 0)

    def test_delete_opportunity_by_id(self):
        from opportunities.models import database
        collection = database.opportunities_collection
        
        collection.delete_many({})
        collection.insert_one({"_id": "opp1", "title": "Test"})
        
        with self.app.test_request_context():
            result = self.opportunity.delete_opportunity_by_id("opp1")
            self.assertEqual(result[0].json, {"message": "Opportunity deleted"})
            self.assertIsNone(collection.find_one({"_id": "opp1"}))
if __name__ == '__main__':
    unittest.main()