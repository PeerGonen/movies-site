import React, { useState, useContext } from "react";
import axios from "axios";
import MainContext from "../MainContext";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";

// The folder that will be responsible for creating a new account
export default function FirstTime() {
  const navigate = useNavigate();
  const [nameValid, setNameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [newpasswordValid, setNewPasswordValid] = useState(false);

  const {
    change: [anyChange, setAnyChange],
  } = useContext(MainContext);

  const [newloggdUser, setNewLoggdUser] = useState({ newPassword: "" });
  const [loggdUser, setLoggdUser] = useState({ userName: "", password: "" });

  const setNewUser = (e) => {
    let isValid = true;
    switch (e.target.name) {
      case "userName":
        isValid = validator.isAlphanumeric(e.target.value);
        setNameValid(isValid);
        break;

      case "password":
        isValid = validator.isAlphanumeric(e.target.value, "en-US");
        setPasswordValid(isValid);
        break;

      default:
        break;
    }
    if (isValid) {
      let user = { ...loggdUser };
      user[e.target.name] = e.target.value;
      setLoggdUser({ ...user });
    }
  };

  const defineUser = (e) => {
    let isValid = true;
    switch (e.target.name) {
      case "newPassword":
        isValid = validator.isAlphanumeric(e.target.value, "en-US");
        if (isValid) {
          isValid = validator.isByteLength(e.target.value, { min: 5, max: 12 });
        }
        setNewPasswordValid(isValid);
        break;

      default:
        break;
    }
    if (isValid) {
      let user = { ...newloggdUser };
      user[e.target.name] = e.target.value;
      setNewLoggdUser({ ...user });
    }
  };

  const verifyUser = async () => {
    if (nameValid && passwordValid && newpasswordValid) {
      const { data: allUsers } = await axios.get(
        "http://localhost:7070/company/users"
      );
      const user = allUsers.find((el) => el.UserName === loggdUser.userName);
      if (user === undefined) {
        alert("we sorry but the userName is not match");
      } else {
        if (user.Password === loggdUser.password) {
          replacePassword(user);
        } else {
          alert("we sorry but the password is not match");
        }
      }
    }
  };

  const replacePassword = async (user) => {
    if (loggdUser.password === "2585") {
      if (newloggdUser.newPassword !== "2585") {
        const newUser = { ...user };
        newUser.Password = newloggdUser.newPassword;
        console.log(newUser);
        const { data: response } = await axios.put(
          `http://localhost:7070/company/users/${user._id}`,
          newUser
        );
        console.log(response);
        setAnyChange(!anyChange);
        navigate("/");
      } else {
        alert("2585 ​​This is your boot password and you can change it later");
      }
    } else {
      alert("2585 is the the boot pasword ");
    }
  };

  return (
    <div className="loginPage">
      &nbsp;
      <h1>Create Accunt</h1>
      <span className="spanLogin">userName :</span>
      <input name="userName" type={"text"} onChange={setNewUser} />
      <br />
      <span className="spanLogin">password :</span>
      <input name="password" type={"text"} onChange={setNewUser} />
      <br />
      <span className="spanLogin">New password :</span>
      <input
        style={{ width: "13%" }}
        name="newPassword"
        type={"password"}
        onChange={defineUser}
      />
      <br />
      <button className="loginBth" onClick={verifyUser}>
        set me
      </button>
      <Link to="/" style={{ color: "goldenrod" }}>
        Back to Login{" "}
      </Link>
      <br />
      <br />
    </div>
  );
}
