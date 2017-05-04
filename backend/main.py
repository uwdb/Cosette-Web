""" Main api routes for frontend """

import os
from flask import Flask, render_template, request, send_from_directory, abort
import logging
from logging.handlers import RotatingFileHandler

template_dir = os.path.abspath('../frontend')
static_dir = os.path.abspath('../frontend/static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)


import Cosette.solver as solver

import psycopg2

import time


# Index page for GET
@app.route('/')
def index():
    return render_template('index.html')

# Solve api call
@app.route('/solve', methods = ['POST'])
def solve():
    hostname = 'grabthar.cs.washington.edu'
    username = os.environ['COS_DB_USERNAME']
    password = os.environ['COS_DB_PASSWORD']
    database = os.environ['COS_DB_DATABASE']
    if 'username' in request.cookies:
        username = request.cookies['username']
        query = request.form.get('query')
        email = ''
        if 'email' in request.cookies:
            email = request.cookies['email']
        institution = ''
        if 'institution' in request.cookies:
            institution = request.cookies['institution']
        res = solver.solve(query, "./Cosette")
        conn = psycopg2.connect(host=hostname, user=username, password=password, dbname=database)
        cur = conn.cursor()
        cur.execute('INSERT INTO queries (username, institution, email, timestamp, cosette_code, result_json) VALUES (%s, %s, %s, %s, %s, %s)', (username, institution, email, time.time() * 1000, query, json.dumps(res)))
        conn.close()
        return res
    else:
        conn = psycopg2.connect(host=hostname, user=username, password=password, dbname=database)
        cur = conn.cursor()
        cur.execute('SELECT count(*) FROM queries')
        res = cur.fetchone()
        return res[0]
        abort(403)

@app.route('/register', methods = ['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')

@app.route('/compiled/<path:file>')
def serve_compiled(file):
    compiled_dir = os.path.abspath('Cosette/.compiled')
    return send_from_directory(compiled_dir, file, mimetype='text/plain')
