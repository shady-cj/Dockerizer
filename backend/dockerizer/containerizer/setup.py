#!/usr/bin/python3
"""
The module calls the fabric task with the use of execute function call from
fabric api module.
"""
from code_processor import codebase_setup
from fabric.api import execute
import json

def setup_config(app):
    result = execute(codebase_setup, app)
    resp = list(result.values())
    return resp[0]

if __name__ == "__main__":

    with open("application_config", "r") as f:
        application = json.load(f)
    response = setup_config(application)
    with open("application_config", "w") as f_obj:
        json.dump(response, f_obj)
