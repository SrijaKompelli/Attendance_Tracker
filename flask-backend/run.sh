#!/bin/bash
source venv/bin/activate
FLASK_APP=app.py flask run --host=0.0.0.0 --port=5001