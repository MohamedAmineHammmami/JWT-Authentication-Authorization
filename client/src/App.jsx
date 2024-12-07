import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const axiosInstane = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [inputData, setInputData] = useState({ email: "", password: "" });
  const handleOnChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleLoginIn = async () => {
    try {
      const res = await axiosInstane.post("/login", inputData);
      console.log(res.data);
      setAccessToken(res.data.access_token);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogOut = async () => {
    try {
      const res = await axiosInstane.post("/logout");
      console.log(res.data.msg);
      setAccessToken(res.data.msg);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleRefresh = async () => {
    try {
      const res = await axiosInstane.post("/refresh");
      setAccessToken(res.data.access_token);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h3 style={{ width: "500px" }}>
        AccessToken:<span style={{ color: "red" }}>{accessToken}</span>
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLoginIn();
        }}
      >
        <label>email:</label>
        <input
          type="email"
          placeholder="example@gmail.com"
          name="email"
          onChange={(e) => handleOnChange(e)}
        />
        <label>password:</label>
        <input
          type="text"
          placeholder="password"
          name="password"
          onChange={(e) => handleOnChange(e)}
        />
        <button type="submit">login</button>
      </form>
      <button onClick={handleRefresh}>refresh</button>
      <button onClick={handleLogOut}>logout</button>
    </div>
  );
}

export default App;
