# Main api routes for frontend

import os
import subprocess

from flask import Flask, render_template, request
template_dir = os.path.abspath('../frontend')
static_dir = os.path.abspath('../frontend/static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.debug = True


# Index page for GET
@app.route('/')
def index():
    return render_template('index.html')

# Solve api call
@app.route('/solve', methods = ['POST'])
def solve():
    query = request.form.get('query')
    qid = request.form.get("qid")
    if qid == "1":
        cmd = ['racket', '/Users/chushumo/Project/Cosette/rosette/tests/count-bug.rkt']
        output = subprocess.Popen( cmd, stdout=subprocess.PIPE ).communicate()[0]
        ret = "NOT EQUAL \n\n"
        ret = ret + output.split('\n', 1)[0]
        ret = ret + "\n\n"
        ret = ret + "parts: \n"
        ret = ret + "pnum | qoh | MUL  \n"
        ret = ret + "================= \n"
        ret = ret + "0    | 0   | 8    \n"
        ret = ret + "2    | 2   | 15   \n"
        ret = ret + "\n"
        ret = ret + "supply:\n"
        ret = ret + "pnum | shipdate | MUL \n"
        ret = ret + "====================== \n"
        ret = ret + "2    | 9        | 2    "
        return ret
    else:
        return "I am not integers"
