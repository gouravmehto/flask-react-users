from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

DATABASE = "users.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():

    conn = get_db_connection()
    cursor = conn.cursor()

    # FIRST TABLE


    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            address1 TEXT,
            address2 TEXT,
            city TEXT,
            state TEXT,
            pincode TEXT,
            weekendDelivery INTEGER,
            expressDelivery TEXT,
            instructions TEXT,
            birthday TEXT
        )
    """)

    # SECOND TABLE - REGISTRATION USERS

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS registration_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            password TEXT,
            age INTEGER
        )
    """)


    # ADD NEW COLUMNS TO EXISTING REGISTRATION TABLE

    new_columns = [
        ("dob", "TEXT"),
        ("phone", "TEXT"),
        ("website", "TEXT"),
        ("gender", "TEXT"),
        ("country", "TEXT"),
        ("skills", "TEXT"),
        ("experience", "INTEGER"),
        ("favorite_color", "TEXT"),
        ("interview_time", "TEXT"),
        ("joining_month", "TEXT"),
        ("profile_photo", "TEXT"),
        ("resume", "TEXT"),
        ("newsletter", "INTEGER DEFAULT 0"),
        ("terms", "INTEGER DEFAULT 0")
    ]

    for column_name, column_type in new_columns:

        try:

            cursor.execute(
                f"""
                ALTER TABLE registration_users
                ADD COLUMN {column_name} {column_type}
                """
            )

        except sqlite3.OperationalError:

            # Column already exists
            pass

    conn.commit()
    conn.close()


init_db()


# =========================================================
# FIRST FORM - USERS
# =========================================================

@app.route("/users", methods=["GET"])
def get_users():

    conn = get_db_connection()

    rows = conn.execute("""
        SELECT *
        FROM users
    """).fetchall()

    conn.close()

    users = []

    for row in rows:

        users.append({
            "id": row["id"],
            "first_name": row["first_name"],
            "last_name": row["last_name"],
            "address1": row["address1"],
            "address2": row["address2"],
            "city": row["city"],
            "state": row["state"],
            "pincode": row["pincode"],
            "weekendDelivery": bool(row["weekendDelivery"]),
            "expressDelivery": row["expressDelivery"],
            "instructions": row["instructions"],
            "birthday": row["birthday"]
        })

    return jsonify(users)


@app.route("/users", methods=["POST"])
def add_user():

    data = request.get_json()

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO users (
            first_name,
            last_name,
            address1,
            address2,
            city,
            state,
            pincode,
            weekendDelivery,
            expressDelivery,
            instructions,
            birthday
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (

        data.get("first_name"),
        data.get("last_name"),
        data.get("address1"),
        data.get("address2"),
        data.get("city"),
        data.get("state"),
        data.get("pincode"),
        int(data.get("weekendDelivery", False)),
        data.get("expressDelivery"),
        data.get("instructions"),
        data.get("birthday")

    ))

    user_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return jsonify({
        "message": "User added!",
        "id": user_id
    })


@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):

    data = request.get_json()

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET
            first_name=?,
            last_name=?,
            address1=?,
            address2=?,
            city=?,
            state=?,
            pincode=?,
            weekendDelivery=?,
            expressDelivery=?,
            instructions=?,
            birthday=?
        WHERE id=?
    """, (

        data.get("first_name"),
        data.get("last_name"),
        data.get("address1"),
        data.get("address2"),
        data.get("city"),
        data.get("state"),
        data.get("pincode"),
        int(data.get("weekendDelivery", False)),
        data.get("expressDelivery"),
        data.get("instructions"),
        data.get("birthday"),
        user_id

    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "User updated!"
    })


@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM users
        WHERE id=?
    """, (user_id,))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "User deleted!"
    })


# SECOND FORM - REGISTRATION USERS
# GET ALL REGISTRATION USERS


@app.route("/registration_users", methods=["GET"])
def get_registration_users():

    conn = get_db_connection()

    rows = conn.execute("""
        SELECT *
        FROM registration_users
    """).fetchall()

    conn.close()

    users = []

    for row in rows:

        users.append({
            "id": row["id"],
            "first_name": row["first_name"],
            "last_name": row["last_name"],
            "email": row["email"],
            "password": row["password"],
            "age": row["age"],
            "dob": row["dob"],
            "phone": row["phone"],
            "website": row["website"],
            "gender": row["gender"],
            "country": row["country"],
            "skills": row["skills"],
            "experience": row["experience"],
            "favorite_color": row["favorite_color"],
            "interview_time": row["interview_time"],
            "joining_month": row["joining_month"],
            "profile_photo": row["profile_photo"],
            "resume": row["resume"],
            "newsletter": bool(row["newsletter"]),
            "terms": bool(row["terms"])
        })

    return jsonify(users)


# ADD REGISTRATION USER

@app.route("/registration_users", methods=["POST"])
def add_registration_user():

    data = request.get_json()

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    age = data.get("age")

    dob = data.get("dob")
    phone = data.get("phone")
    website = data.get("website")
    gender = data.get("gender")
    country = data.get("country")
    skills = data.get("skills")
    experience = data.get("experience")
    favorite_color = data.get("favorite_color")
    interview_time = data.get("interview_time")
    joining_month = data.get("joining_month")
    profile_photo = data.get("profile_photo")
    resume = data.get("resume")
    newsletter = data.get("newsletter", False)
    terms = data.get("terms", False)

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO registration_users (
            first_name,
            last_name,
            email,
            password,
            age,
            dob,
            phone,
            website,
            gender,
            country,
            skills,
            experience,
            favorite_color,
            interview_time,
            joining_month,
            profile_photo,
            resume,
            newsletter,
            terms
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (

        first_name,
        last_name,
        email,
        password,
        age,
        dob,
        phone,
        website,
        gender,
        country,
        skills,
        experience,
        favorite_color,
        interview_time,
        joining_month,
        profile_photo,
        resume,
        int(newsletter),
        int(terms)

    ))

    user_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Registration user added!",
        "id": user_id
    })


# GET ONE REGISTRATION USER


@app.route("/registration_users/<int:user_id>", methods=["GET"])
def get_registration_user(user_id):

    conn = get_db_connection()

    row = conn.execute("""
        SELECT *
        FROM registration_users
        WHERE id=?
    """, (user_id,)).fetchone()

    conn.close()

    if row is None:

        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({
        "id": row["id"],
        "first_name": row["first_name"],
        "last_name": row["last_name"],
        "email": row["email"],
        "password": row["password"],
        "age": row["age"],
        "dob": row["dob"],
        "phone": row["phone"],
        "website": row["website"],
        "gender": row["gender"],
        "country": row["country"],
        "skills": row["skills"],
        "experience": row["experience"],
        "favorite_color": row["favorite_color"],
        "interview_time": row["interview_time"],
        "joining_month": row["joining_month"],
        "profile_photo": row["profile_photo"],
        "resume": row["resume"],
        "newsletter": bool(row["newsletter"]),
        "terms": bool(row["terms"])
    })


# =========================================================
# UPDATE REGISTRATION USER
# =========================================================

@app.route("/registration_users/<int:user_id>", methods=["PUT"])
def update_registration_user(user_id):

    data = request.get_json()

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    age = data.get("age")

    dob = data.get("dob")
    phone = data.get("phone")
    website = data.get("website")
    gender = data.get("gender")
    country = data.get("country")
    skills = data.get("skills")
    experience = data.get("experience")
    favorite_color = data.get("favorite_color")
    interview_time = data.get("interview_time")
    joining_month = data.get("joining_month")
    profile_photo = data.get("profile_photo")
    resume = data.get("resume")
    newsletter = data.get("newsletter", False)
    terms = data.get("terms", False)

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""
        UPDATE registration_users
        SET
            first_name=?,
            last_name=?,
            email=?,
            password=?,
            age=?,
            dob=?,
            phone=?,
            website=?,
            gender=?,
            country=?,
            skills=?,
            experience=?,
            favorite_color=?,
            interview_time=?,
            joining_month=?,
            profile_photo=?,
            resume=?,
            newsletter=?,
            terms=?
        WHERE id=?
    """, (

        first_name,
        last_name,
        email,
        password,
        age,
        dob,
        phone,
        website,
        gender,
        country,
        skills,
        experience,
        favorite_color,
        interview_time,
        joining_month,
        profile_photo,
        resume,
        int(newsletter),
        int(terms),
        user_id

    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Registration user updated!"
    })



# DELETE REGISTRATION USER


@app.route("/registration_users/<int:user_id>", methods=["DELETE"])
def delete_registration_user(user_id):

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM registration_users
        WHERE id=?
    """, (user_id,))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Registration user deleted!"
    })



if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )