import requests
import json

url = "http://127.0.0.1:5000/tweets/"

json_input={"message":"oxygen AND agra AND verified"}

j_data=json.dumps(json_input)
headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}
r = requests.post(url, data=j_data, headers=headers)
print(r, r.text)

