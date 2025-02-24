from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = os.environ.get('SCRAPED_DATA_FILE', 'scraped_data.json')

def load_data():
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        return {"error": f"Unable to load data: {str(e)}"}

@app.route('/')
def index():
    data = load_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
