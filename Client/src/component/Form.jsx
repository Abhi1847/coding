import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Form = ({ isSignIn = true }) => {
  const [data, setdata] = useState({
    ...(!isSignIn && {
      name: "",
    }),
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const endpoint = isSignIn
        ? "http://localhost:3000/login"
        : "http://localhost:3000/register";
      const response = await axios.post(endpoint, data, {
        withCredentials: true,
      });

      if (isSignIn && response.data.token) {
        localStorage.setItem("user:token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <>
      <div className="form-container">
        <div className="form">
          <h1>Welcome {isSignIn && "Back"}</h1>
          <h3 className="heading">
            {isSignIn ? "Sign In to Get Explore" : "Sign In to Get Started"}
          </h3>
          <form onSubmit={handleSubmit}>
            {!isSignIn && (
              <Input
                label={"Name"}
                placeholder={"Enter your Name"}
                type={"text"}
                id={"name"}
                value={data.name}
                onChange={(e) => setdata({ ...data, name: e.target.value })}
              />
            )}
            <Input
              label={"Email"}
              placeholder={"Enter your Email"}
              type={"email"}
              id={"email"}
              value={data.email}
              onChange={(e) => setdata({ ...data, email: e.target.value })}
            />
            <Input
              label={"Password"}
              placeholder={"Enter your Password"}
              type={"password"}
              id={"password"}
              value={data.password}
              onChange={(e) => setdata({ ...data, password: e.target.value })}
            />
            <Button name={isSignIn ? "Sign In" : "Sign UP"} />
          </form>
          <div>
            {isSignIn ? "Don`t have Account ? " : "I have Account ? "}
            <span onClick={() => navigate(isSignIn ? "/" : "/signin")}>
              {isSignIn ? "Sign UP" : "Sign In"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
