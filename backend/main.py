""" Main api routes for frontend """

import os
from flask import Flask, render_template, request, send_from_directory, abort
import logging
from logging.handlers import RotatingFileHandler
import Cosette.solver as solver
import psycopg2
import time
import json
from passlib.hash import pbkdf2_sha256


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
    db_hostname = os.environ['COS_DB_HOST']
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
                  "rosette_source", "api_key"]
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
                 get_or_default("rosette_source"),
                 get_or_default("api_key")))
    conn.commit()
    cur.close()
    conn.close()


# Index page for GET
@app.route('/')
def index():
    return render_template('index.html')

# Solve api call
@app.route('/solve', methods = ['POST'])
def solve():
    # there should be a username in the cookies
    if 'token' in request.cookies:
        token = request.cookies['token']
        cos_query = request.form.get('query')
        res_string = solver.solve(cos_query, "./Cosette", True)
        res = json.loads(res_string)
        res["api_key"] = token
        try:
            log_query(res)
        except Exception as e:
            res["error_msg"] = e.message
        return json.dumps(res)
    else:
        abort(403)

@app.route('/login', methods = ['POST'])
def login():
    email = request.form.get('email')
    attempt = request.form.get('password')

    db_hostname = os.environ['COS_DB_HOST']
    db_username = os.environ['COS_DB_USERNAME']
    db_password = os.environ['COS_DB_PASSWORD']
    db_name = os.environ['COS_DB_DATABASE']
    conn = psycopg2.connect(host=db_hostname, user=db_username,
                            password=db_password, dbname=db_name)
    
    cur = conn.cursor()
    cur.execute("SELECT password, api_key FROM users WHERE email='{}'".format(email))
    rows = cur.fetchall()

    if len(rows) > 0:
        if pbkdf2_sha256.verify(attempt, rows[0][0]):
            return json.dumps({'status': 0, 'token': rows[0][1]})
        else:
            return json.dumps({'status': 1})
    else:
        return json.dumps({'status': 1})

@app.route('/register', methods = ['POST'])
def register():
    name = request.form.get('name')
    password = request.form.get('password')
    email = request.form.get('email')
    institution = request.form.get('institution')

    if not (name and password and email and institution):
        # not enough fields
        return json.dumps({'status': 2})
    
    db_hostname = os.environ['COS_DB_HOST']
    db_username = os.environ['COS_DB_USERNAME']
    db_password = os.environ['COS_DB_PASSWORD']
    db_name = os.environ['COS_DB_DATABASE']
    conn = psycopg2.connect(host=db_hostname, user=db_username,
                            password=db_password, dbname=db_name)
    
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM users WHERE email='{}'".format(email))
    rows = cur.fetchall()

    if len(rows) > 0:
        # email already registered
        return json.dumps({'status': 1})
    else:
        users_cols = ['name', 'email', 'institution', 'password', 'api_key']
        pass_hashed = pbkdf2_sha256.encrypt(password, rounds=200000, salt_size=16)
        api_key = os.urandom(64).encode('hex')
        
        cur.execute('INSERT INTO users ({}) VALUES ({})'.format(
            ", ".join(users_cols), ", ".join(["%s"]*len(users_cols))),
                    (name,
                     email,
                     institution,
                     pass_hashed,
                     api_key,
                     ))
        conn.commit()
        cur.close()
        conn.close()
        return json.dumps({'status': 0, 'token': api_key})


@app.route('/compiled/<path:file>')
def serve_compiled(file):
    compiled_dir = os.path.abspath('Cosette/.compiled')
    return send_from_directory(compiled_dir, file, mimetype='text/plain')
