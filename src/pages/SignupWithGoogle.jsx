
import { GoogleLogin } from '@react-oauth/google';
import api from '../api';

function SignupWithGoogle() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/signupwirhgoogle", {
        idToken: credentialResponse.credential,
      });
      alert("Signed up with Google!");
      console.log(res.data);
    } catch (err) {
      alert("Google signup failed");
    }
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={() => alert("Login Failed")} />;
}

export default SignupWithGoogle;
