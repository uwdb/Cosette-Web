# Main api routes for frontend

from flask import Flask
from flask import request
app = Flask(__name__)

# Index page for GET
@app.route('/')
def index():


# Solve api call
@app.route('/solve', methods = ['POST'])
def solve():
    query = request.form.get('query')
