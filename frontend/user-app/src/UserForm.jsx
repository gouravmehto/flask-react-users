import React, { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    weekendDelivery: false,
    expressDelivery: "",
    instructions: "",
    birthday: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("https://shiny-fiesta-rx76wq694rph5pjr-5000.app.github.dev/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
   const validateForm = () => {
    let newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.address1.trim()) newErrors.address1 = "Address1 is required";
    if (!form.address2.trim()) newErrors.address2 = "Address2 is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.pincode.trim() || form.pincode.length !== 6) newErrors.pincode = "Valid 6-digit Pincode required";
    if (!form.birthday) newErrors.birthday = "Birthday is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    fetch("https://shiny-fiesta-rx76wq694rph5pjr-5000.app.github.dev/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => {
        setUsers([...users, form]);
        setForm({
          first_name: "",
          last_name: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          pincode: "",
          weekendDelivery: false,
          expressDelivery: "",
          instructions: "",
          birthday: ""
        });
        setErrors({});
      });
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>User Registration</h1>
      <form onSubmit={handleSubmit}>
       <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} />
        {errors.first_name && <p style={{color:"red"}}>{errors.first_name}</p>}
        <br />

        <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} />
        {errors.last_name && <p style={{color:"red"}}>{errors.last_name}</p>}
        <br />

        <input name="address1" placeholder="Address 1" value={form.address1} onChange={handleChange} />
        {errors.address1 && <p style={{color:"red"}}>{errors.address1}</p>}
        <br />

        <input name="address2" placeholder="Address 2" value={form.address2} onChange={handleChange} />
        {errors.address2 && <p style={{color:"red"}}>{errors.address2}</p>}
        <br />

        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
        {errors.city && <p style={{color:"red"}}>{errors.city}</p>}
        <br />

        <select name="state" value={form.state} onChange={handleChange}>
          <option value="">Select State</option>
          <option value="MH">Maharashtra</option>
          <option value="DL">Delhi</option>
          <option value="KA">Karnataka</option>
        </select>
        {errors.state && <p style={{color:"red"}}>{errors.state}</p>}
        <br />

        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
        {errors.pincode && <p style={{color:"red"}}>{errors.pincode}</p>}
        <br />

        <label>
          <input type="checkbox" name="weekendDelivery" checked={form.weekendDelivery} onChange={handleChange} />
          Delivery on weekends allowed
        </label>
        <br />

        <div>
          Express Delivery:
          <label>
            <input type="radio" name="expressDelivery" value="yes" checked={form.expressDelivery === "yes"} onChange={handleChange} /> Yes
          </label>
          <label>
            <input type="radio" name="expressDelivery" value="no" checked={form.expressDelivery === "no"} onChange={handleChange} /> No
          </label>
          <br />
        </div>

        <textarea name="instructions" placeholder="Special Instructions" value={form.instructions} onChange={handleChange}></textarea>
        <br />

        <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
        {errors.birthday && <p style={{color:"red"}}>{errors.birthday}</p>}
        <br />

        <button type="submit">Add User</button>
      </form>

      <h2>Users List</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>First Name</th><th>Last Name</th><th>Address1</th><th>Address2</th><th>City</th><th>State</th><th>Pincode</th><th>Weekend Delivery</th><th>Express Delivery</th><th>Instructions</th><th>Birthday</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.first_name}</td>
              <td>{u.last_name}</td>
              <td>{u.address1}</td>
              <td>{u.address2}</td>
              <td>{u.city}</td>
              <td>{u.state}</td>
              <td>{u.pincode}</td>
              <td>{u.weekendDelivery ? "Yes" : "No"}</td>
              <td>{u.expressDelivery}</td>
              <td>{u.instructions}</td>
              <td>{u.birthday}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;