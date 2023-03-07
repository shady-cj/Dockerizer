#!/usr/bin/python3
"""
The module calls the fabric task with the use of execute function call from
fabric api module.
"""
from code_processor import codebase_setup
from fabric.api import execute
import sys

def setup_config(app):
    result = execute(codebase_setup, app)
    resp = list(result.values())
    print(resp[0])
    return resp[0]

if __name__ == "__main__":
    get_string = input()
    application = eval(get_string)
    setup_config(application)
