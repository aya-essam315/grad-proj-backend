
import { useState } from "react";
import api from "../api";

function ForgetPassword() {
  const [email, setEmail] = useState("");

  const handleForget = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgetpassord", { email });
      alert(res.data.message);
    } catch (err) {
      alert("Error sending code");
    }
  };

  return (
    <form onSubmit={handleForget}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Send Reset Code</button>
    </form>
  );
}

export default ForgetPassword;
