# Main api routes for frontend

import os

from flask import Flask, render_template, request
template_dir = os.path.abspath('../frontend')
static_dir = os.path.abspath('../frontend/static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

# Index page for GET
@app.route('/')
def index():
    return render_template('index.html')

# Solve api call
@app.route('/solve', methods = ['POST'])
def solve():
    query = request.form.get('query')
