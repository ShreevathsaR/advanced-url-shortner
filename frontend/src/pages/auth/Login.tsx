import GoogleButton from "react-google-button";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };
  return (
    <>
      <div className="min-h-screen bg-[#0f0f1a] flex justify-center items-center">
        <GoogleButton onClick={handleLogin}/>
      </div>
    </>
  );
};

export default Login;
