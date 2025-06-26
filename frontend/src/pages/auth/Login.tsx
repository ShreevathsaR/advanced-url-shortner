import GoogleButton from "react-google-button";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };
  return (
    <>
      <div>
        <GoogleButton onClick={handleLogin} />
      </div>
    </>
  );
};

export default Login;
