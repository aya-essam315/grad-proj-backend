
import { useState } from "react";
import api from "../api";

function ConfirmEmail() {
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch("/auth/confirmEmail", { email, OTP });
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Confirmation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="OTP" onChange={(e) => setOTP(e.target.value)} />
      <button type="submit">Confirm Email</button>
    </form>
  );
}

export default ConfirmEmail;
