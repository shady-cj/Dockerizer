#!/usr/bin/python3
import json
import jwt

read_input = input()
data = json.loads(read_input)
password = jwt.decode(data.get("enc"), data.get("secret"), algorithms=["HS256"])
print(password.get('password'))
