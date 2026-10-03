from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

def init_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            address TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/users", methods=["GET"])
def get_users():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

@app.route("/users", methods=["POST"])
def add_user():
    data = request.json
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (first_name, last_name, address) VALUES (?, ?, ?)",
                   (data["first_name"], data["last_name"], data["address"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "User added!"})

if __name__ == "__main__":
    app.run(port=5000)
