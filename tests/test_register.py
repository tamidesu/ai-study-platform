import requests

url = 'http://127.0.0.1:8000/api/auth/register/'
data = {
    'email': 'newtestuser@example.com',
    'username': 'newtestuser',
    'password': 'password123'
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
