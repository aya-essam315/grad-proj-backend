
import { useState } from "react";
import api from "../api";

function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    DOB: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", form);
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="First Name" onChange={handleChange} />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="DOB" type="date" onChange={handleChange} />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
