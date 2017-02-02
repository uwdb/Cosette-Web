#!/bin/sh

cd backend
export FLASK_APP=main.py
ls -a
python -m flask run --host=0.0.0.0
