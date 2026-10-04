import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RegistrationPage.css";

const BACKEND_URL =
  "https://shiny-fiesta-rx76wq694rph5pjr-5000.app.github.dev";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    dob: "",
    phone: "",
    website: "",

    gender: "",
    country: "",
    skills: [],
    experience: "",

    favoriteColor: "",
    interviewTime: "",
    joiningMonth: "",

    profilePhoto: "",
    resume: "",

    newsletter: false,
    terms: false,
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load existing user when editing
  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true);

    fetch(`${BACKEND_URL}/registration_users/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }

        return response.json();
      })
      .then((data) => {
        setForm({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          password: data.password || "",
          age: data.age ? String(data.age) : "",
          dob: data.dob || "",
          phone: data.phone || "",
          website: data.website || "",

          gender: data.gender || "",
          country: data.country || "",
          skills: data.skills
            ? data.skills.split(",").map((skill) => skill.trim())
            : [],
          experience:
            data.experience !== null && data.experience !== undefined
              ? String(data.experience)
              : "",

          favoriteColor: data.favorite_color || "",
          interviewTime: data.interview_time || "",
          joiningMonth: data.joining_month || "",

          profilePhoto: data.profile_photo || "",
          resume: data.resume || "",

          newsletter: Boolean(data.newsletter),
          terms: Boolean(data.terms),
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Unable to load user data");
        navigate("/grid");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  // Normal input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Skills checkbox
  const handleSkillChange = (e) => {
    const { value, checked } = e.target;

    let updatedSkills = [...form.skills];

    if (checked) {
      updatedSkills.push(value);
    } else {
      updatedSkills = updatedSkills.filter((skill) => skill !== value);
    }

    setForm({
      ...form,
      skills: updatedSkills,
    });

    setErrors({
      ...errors,
      skills: "",
    });
  };

  // Profile photo
  const handleProfilePhoto = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        profilePhoto: "Only JPG, JPEG, PNG and WEBP files are allowed",
      });

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        profilePhoto: "Profile photo must be less than 5 MB",
      });

      return;
    }

    setForm({
      ...form,
      profilePhoto: file.name,
    });

    setErrors({
      ...errors,
      profilePhoto: "",
    });
  };

  // Resume
  const handleResume = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        resume: "Only PDF, DOC and DOCX files are allowed",
      });

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({
        ...errors,
        resume: "Resume must be less than 10 MB",
      });

      return;
    }

    setForm({
      ...form,
      resume: file.name,
    });

    setErrors({
      ...errors,
      resume: "",
    });
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    // First Name
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(form.firstName.trim())) {
      newErrors.firstName = "First name should contain only letters";
    } else if (form.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[A-Za-z]+$/.test(form.lastName.trim())) {
      newErrors.lastName = "Last name should contain only letters";
    } else if (form.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one number";
    }

    // Age
    if (!form.age) {
      newErrors.age = "Age is required";
    } else if (!/^\d+$/.test(form.age)) {
  newErrors.age = "Age must contain only numbers";
    }

    // DOB
    if (!form.dob) {
      newErrors.dob = "Date of birth is required";
    } else { const selectedDate = new Date(form.dob); const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
    }

    // Phone
    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must contain exactly 10 digits";
    }

    // Website
    if (form.website.trim()) {
      try {new URL(form.website);
      } catch {
        newErrors.website = "Enter a valid website URL";
      }
    }

    // Gender
    if (!form.gender) {
      newErrors.gender = "Gender is required";
    }

    // Country
    if (!form.country) {
      newErrors.country = "Country is required";
    }

    // Skills
    if (form.skills.length === 0) {
      newErrors.skills = "Select at least one skill";
    }

    // Experience
    if (form.experience === "") {
      newErrors.experience = "Experience is required";
    } else if (
      Number(form.experience) < 0 ||
      Number(form.experience) > 20
    ) {
      newErrors.experience = "Experience must be between 0 and 20 years";
    }

    // Favorite Color
    if (!form.favoriteColor) {
      newErrors.favoriteColor = "Favorite color is required";
    }

    // Interview Time
    if (!form.interviewTime) {
      newErrors.interviewTime = "Interview time is required";
    }

    // Joining Month
    if (!form.joiningMonth) {
      newErrors.joiningMonth = "Joining month is required";
    }

    // Profile Photo
    if (!form.profilePhoto) {
      newErrors.profilePhoto = "Profile photo is required";
    }

    // Resume
    if (!form.resume) {
      newErrors.resume = "Resume is required";
    }

    // Terms
    if (!form.terms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const url = id
        ? `${BACKEND_URL}/registration_users/${id}`
        : `${BACKEND_URL}/registration_users`;

      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          password: form.password,
          age: Number(form.age),

          dob: form.dob,
          phone: form.phone,
          website: form.website,

          gender: form.gender,
          country: form.country,
          skills: form.skills.join(", "),
          experience: Number(form.experience),

          favorite_color: form.favoriteColor,
          interview_time: form.interviewTime,
          joining_month: form.joiningMonth,

          profile_photo: form.profilePhoto,
          resume: form.resume,

          newsletter: form.newsletter ? 1 : 0,
          terms: form.terms ? 1 : 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Operation failed");
        return;
      }

      if (id) {
        alert("User updated successfully!");
      } else {
        alert("Registration successful!");
      }

      setForm(initialFormState);
      setErrors({});

      navigate("/grid");
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  // Reset
  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
  };

  if (loading) {
    return <h2>Loading user...</h2>;
  }

  return (
    <div className="registration-page">
      <div className="registration-container">

        <h1>Registration Form</h1>

        <form onSubmit={handleSubmit}>

          {/* PERSONAL INFORMATION */}

          <h2 className="section-heading">
            Personal Information
          </h2>

          <div className="section-box">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={form.firstName}  onChange={handleChange} placeholder="Enter first name"
              />
              {errors.firstName && (  <p className="error">{errors.firstName}</p>
              )}
            </div>

            <div className="form-group"> <label>Last Name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Enter last name"
              />
              {errors.lastName && ( <p className="error">{errors.lastName}</p>
              )}
            </div>

            <div className="form-group"> <label>Email</label>
              <input type="email"  name="email" value={form.email} onChange={handleChange}placeholder="Enter email"
              />

              {errors.email && (
                <p className="error">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
              />

              {errors.password && (
                <p className="error">{errors.password}</p>
              )}
            </div>


            <div className="form-group">
              <label>Age</label>

              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter age"
              />

              {errors.age && (
                <p className="error">{errors.age}</p>
              )}
            </div>


            <div className="form-group">
              <label>Date of Birth</label>

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />

              {errors.dob && (
                <p className="error">{errors.dob}</p>
              )}
            </div>


            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter 10 digit phone number"
                maxLength="10"
              />

              {errors.phone && (
                <p className="error">{errors.phone}</p>
              )}
            </div>


            <div className="form-group">
              <label>Website</label>

              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />

              {errors.website && (
                <p className="error">{errors.website}</p>
              )}
            </div>

          </div>


          {/* GENDER - OUTSIDE BOX */}

          <div className="normal-field">

            <label>Gender</label>

            <div className="radio-group">

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={handleChange}
                />
                Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={handleChange}
                />
                Female
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={form.gender === "Other"}
                  onChange={handleChange}
                />
                Other
              </label>

            </div>

            {errors.gender && (
              <p className="error">{errors.gender}</p>
            )}

          </div>


          {/* COUNTRY - OUTSIDE BOX */}

          <div className="normal-field">

            <label>Country</label>

            <select
              name="country"
              value={form.country}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>

            {errors.country && (
              <p className="error">{errors.country}</p>
            )}

          </div>


          {/* SKILLS - OUTSIDE BOX */}

          <div className="normal-field">

            <label>Skills</label>

            <div className="skills-group">

              <label>
                <input
                  type="checkbox"
                  value="Python"
                  checked={form.skills.includes("Python")}
                  onChange={handleSkillChange}
                />
                Python
              </label>

              <label>
                <input
                  type="checkbox"
                  value="SQL"
                  checked={form.skills.includes("SQL")}
                  onChange={handleSkillChange}
                />
                SQL
              </label>

              <label>
                <input
                  type="checkbox"
                  value="React"
                  checked={form.skills.includes("React")}
                  onChange={handleSkillChange}
                />
                React
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Excel"
                  checked={form.skills.includes("Excel")}
                  onChange={handleSkillChange}
                />
                Excel
              </label>

              <label>
                <input
                  type="checkbox"
                  value="Power BI"
                  checked={form.skills.includes("Power BI")}
                  onChange={handleSkillChange}
                />
                Power BI
              </label>

            </div>

            {errors.skills && (
              <p className="error">{errors.skills}</p>
            )}

          </div>


          {/* EXPERIENCE - OUTSIDE BOX */}

          <div className="normal-field">

            <label>
              Experience: {form.experience || 0} years
            </label>

            <input
              className="experience-range"
              type="range"
              name="experience"
              min="0"
              max="20"
              value={form.experience || 0}
              onChange={handleChange}
            />

            {errors.experience && (
              <p className="error">{errors.experience}</p>
            )}

          </div>


          {/* OTHER INFORMATION */}

          <h2 className="section-heading">
            Other Information
          </h2>

          <div className="section-box">

            <div className="form-group">
              <label>Favorite Color</label>

              <input
                type="color"
                name="favoriteColor"
                value={form.favoriteColor || "#000000"}
                onChange={handleChange}
              />

              {errors.favoriteColor && (
                <p className="error">{errors.favoriteColor}</p>
              )}
            </div>


            <div className="form-group">
              <label>Interview Time</label>

              <input
                type="time"
                name="interviewTime"
                value={form.interviewTime}
                onChange={handleChange}
              />

              {errors.interviewTime && (
                <p className="error">
                  {errors.interviewTime}
                </p>
              )}
            </div>


            <div className="form-group">
              <label>Joining Month</label>

              <input
                type="month"
                name="joiningMonth"
                value={form.joiningMonth}
                onChange={handleChange}
              />

              {errors.joiningMonth && (
                <p className="error">
                  {errors.joiningMonth}
                </p>
              )}
            </div>


            <div className="form-group">
              <label>Profile Photo</label>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleProfilePhoto}
              />

              {form.profilePhoto && (
                <p className="file-name">
                  Selected: {form.profilePhoto}
                </p>
              )}

              {errors.profilePhoto && (
                <p className="error">
                  {errors.profilePhoto}
                </p>
              )}
            </div>


            <div className="form-group">
              <label>Resume</label>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResume}
              />

              {form.resume && (
                <p className="file-name">
                  Selected: {form.resume}
                </p>
              )}

              {errors.resume && (
                <p className="error">{errors.resume}</p>
              )}
            </div>

          </div>


          {/* BOTTOM OPTIONS */}

          <div className="bottom-options">

            <label>
              <input
                type="checkbox"
                name="newsletter"
                checked={form.newsletter}
                onChange={handleChange}
              />
              Subscribe to newsletter
            </label>


            <label>
              <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange}
              />
              I accept terms and condition </label>

            {errors.terms && ( <p className="error">{errors.terms}</p>)}
          </div>

          {/* BUTTONS */}

          <div className="form-actions">

            <button
              type="submit"
              className="register-button"
            >
              {id ? "Update" : "Register"}
            </button>

            <button
              type="button"
              className="reset-button"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}