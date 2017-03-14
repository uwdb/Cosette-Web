# Main api routes for frontend

import os
#from data.db import db
from flask import Flask, render_template, request
template_dir = os.path.abspath('../frontend')
static_dir = os.path.abspath('../frontend/static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.debug = True

import solver


# Index page for GET
@app.route('/')
def index():
    return render_template('index.html')

# Solve api call
@app.route('/solve', methods = ['POST'])
def solve():
    query = request.form.get('query')
    return solver.solve(query)

@app.route('/register', methods = ['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')
    username_check = db.query('select count(*) from users where username=' + username)
    if username_check > 0:
        return 'Username taken.'
    db.insert('users', username=username)
