import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL =
  "https://shiny-fiesta-rx76wq694rph5pjr-5000.app.github.dev";

export default function RegistrationGrid() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all users from Flask backend
  useEffect(() => {
    fetch(`${BACKEND_URL}/registration_users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        alert("Cannot load users");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/registration_users/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      // Remove deleted user from the grid
      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== id)
      );

      alert("User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Cannot connect to backend");
    }
  };

  // Loading message
  if (loading) {
    return <h2>Loading users...</h2>;
  }

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Registered Users</h1>

      <button
        onClick={() => navigate("/registration")}
        style={{
          padding: "10px 18px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        Add New User
      </button>

      {users.length === 0 ? (
        <p>No registered users found.</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            width: "100%",
          }}
        >
          <table
            border="1"
            cellPadding="10"
            cellSpacing="0"
            style={{
              borderCollapse: "collapse",
              minWidth: "1800px",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Age</th>
                <th>Date of Birth</th>
                <th>Phone</th>
                <th>Website</th>
                <th>Gender</th>
                <th>Country</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Favorite Color</th>
                <th>Interview Time</th>
                <th>Joining Month</th>
                <th>Profile Photo</th>
                <th>Resume</th>
                <th>Newsletter</th>
                <th>Terms</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>{user.first_name}</td>

                  <td>{user.last_name}</td>

                  <td>{user.email}</td>

                  <td>{user.password}</td>

                  <td>{user.age}</td>

                  <td>{user.dob}</td>

                  <td>{user.phone}</td>

                  <td>{user.website}</td>

                  <td>{user.gender}</td>

                  <td>{user.country}</td>

                  <td>{user.skills}</td>

                  <td>
                    {user.experience !== null &&
                    user.experience !== undefined
                      ? `${user.experience} years`
                      : ""}
                  </td>

                  <td>
                    {user.favorite_color && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "25px",
                            height: "25px",
                            backgroundColor: user.favorite_color,
                            border: "1px solid #999",
                            borderRadius: "4px",
                          }}
                        ></span>

                        {user.favorite_color}
                      </div>
                    )}
                  </td>

                  <td>{user.interview_time}</td>

                  <td>{user.joining_month}</td>

                  <td>{user.profile_photo}</td>

                  <td>{user.resume}</td>

                  <td>
                    {user.newsletter ? "Yes" : "No"}
                  </td>

                  <td>
                    {user.terms ? "Accepted" : "Not Accepted"}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(`/registration/${user.id}`)
                      }
                      style={{
                        padding: "7px 12px",
                        marginRight: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        padding: "7px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}