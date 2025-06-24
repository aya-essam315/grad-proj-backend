
import { useState } from "react";
import api from "../api";

function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    OTP: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch("/auth/resetpassord", form);
      alert(res.data.message);
    } catch (err) {
      alert("Reset failed");
    }
  };

  return (
    <form onSubmit={handleReset}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="OTP" placeholder="OTP" onChange={handleChange} />
      <input name="newPassword" placeholder="New Password" onChange={handleChange} />
      <button type="submit">Reset Password</button>
    </form>
  );
}

export default ResetPassword;
