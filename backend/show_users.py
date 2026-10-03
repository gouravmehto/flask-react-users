import sqlite3

def show_users():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()

    print("Users in the database:")
    for row in rows:
        print(f"ID: {row[0]}, Name: {row[1]} {row[2]}, Address: {row[3]}")

if __name__ == "__main__":
    show_users()
