""" Main api routes for frontend """

import os
from flask import Flask, render_template, request, send_from_directory, abort
import logging
from logging.handlers import RotatingFileHandler
import Cosette.solver as solver
import psycopg2
import time
import json

template_dir = os.path.abspath('../frontend')
static_dir = os.path.abspath('../frontend/static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

def log_query(query):
    """ log query in database """
    assert isinstance(query, dict)

    def get_or_default(field, default="None"):
        """ helper function return field value or default """
        return query[field] if field in query else default

    # write to database
    db_hostname = 'grabthar.cs.washington.edu'
    db_username = os.environ['COS_DB_USERNAME']
    db_password = os.environ['COS_DB_PASSWORD']
    db_name = os.environ['COS_DB_DATABASE']

    # counterexample should converted to string if it is a list
    counterexamples = get_or_default("counterexamples")
    if isinstance(counterexamples, list):
        counterexamples = json.dumps(counterexamples)

    conn = psycopg2.connect(host=db_hostname, user=db_username,
                            password=db_password, dbname=db_name)
    db_columns = ["username", "email", "timestamp", "cosette_code", "result",
                  "institution", "coq_result", "rosette_result", "coq_log",
                  "rosette_log", "error_msg", "counterexamples", "coq_source",
                  "rosette_source"]
    cur = conn.cursor()
    cur.execute('INSERT INTO queries ({}) VALUES ({})'.format(
        ", ".join(db_columns), ", ".join(["%s"]*len(db_columns))),
                (get_or_default("username"),
                 get_or_default("email"),
                 time.time() * 1000,
                 get_or_default("cosette_code"),
                 get_or_default("result"),
                 get_or_default("instituion"),
                 get_or_default("coq_result"),
                 get_or_default("rosette_result"),
                 get_or_default("coq_log"),
                 get_or_default("rosette_log"),
                 get_or_default("error_msg"),
                 counterexamples,
                 get_or_default("coq_source"),
                 get_or_default("rosette_source")))
    conn.commit()
    cur.close()
    conn.close()


@app.route('/')
def index():
    """ index page for get """
    return render_template('index.html')

@app.route('/challenge')
def challenge():
    """ cosette challenge for sigmod """
    return render_template('challenge.html')

@app.route('/solve', methods=['POST'])
def solve():
    """ solve cosette queries """
    # there should be a username in the cookies
    if 'username' in request.cookies:
        username = request.cookies['username']
        cos_query = request.form.get('query')
        email = 'None'
        if 'email' in request.cookies:
            email = request.cookies['email']
        institution = 'None'
        if 'institution' in request.cookies:
            institution = request.cookies['institution']
        res_string = solver.solve(cos_query, "./Cosette", True)
        res = json.loads(res_string)
        res["username"] = username
        res["email"] = email
        res["instituion"] = institution
        try:
            log_query(res)
        except Exception as e:
            res["error_msg"] = e.message
        return json.dumps(res)
    else:
        abort(403)

@app.route('/register', methods=['POST'])
def register():
    """ register, under construction. """
    username = request.form.get('username')
    password = request.form.get('password')

@app.route('/compiled/<path:file>')
def serve_compiled(file):
    """ show compiled files, deprecated """
    compiled_dir = os.path.abspath('Cosette/.compiled')
    return send_from_directory(compiled_dir, file, mimetype='text/plain')
