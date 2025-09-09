from flask import Flask, jsonify, request
from core import database, handlers
from .models import Log

app = Flask(__name__)

@app.route('/logs', methods=['GET'])
def get_logs():
    """
    This endpoint returns the logs.
    """
    logs = Log.get_logs()
    return jsonify(logs)

