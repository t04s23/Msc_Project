# tests/conftest.py
import pytest
import mongomock

@pytest.fixture(autouse=True)
def mock_db(monkeypatch):
    mock_client = mongomock.MongoClient()
    mock_db = mock_client.db
    monkeypatch.setattr('core.database', mock_db)
    return mock_db