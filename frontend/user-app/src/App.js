import React, { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ first_name: "", last_name: "", address: "" });

  useEffect(() => {
    fetch("https://shiny-fiesta-rx76wq694rph5pjr-5000.app.github.dev/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://shiny-fiesta-rx76wq694rph5pjr-5000.app.github.dev/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => {
        setUsers([...users, [users.length + 1, form.first_name, form.last_name, form.address]]);
        setForm({ first_name: "", last_name: "", address: "" });
      });
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>User Registration</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <button type="submit">Add User</button>
      </form>

      <h2>Users List</h2>
      <ul>
        {users.map((u, i) => (
          <li key={i}>{u[1]} {u[2]} - {u[3]}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
