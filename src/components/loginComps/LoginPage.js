import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import MainContext from "../MainContext";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";

// The folder that will be responsible for the secure login to the site
// To get in the password and userName is : "admin"
export default function Login() {
  const navigate = useNavigate();
  const [nameValid, setNameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [adminClick, setAdminClick] = useState(false);

  const {
    change: [anyChange, setAnyChange],
  } = useContext(MainContext);

  const [userLog, setUserLog] = useState({ userName: "", password: "" });

  const getInputText = (e) => {
    let isValid = true;
    switch (e.target.name) {
      case "userName":
        isValid = validator.isAlphanumeric(e.target.value);
        setNameValid(e.target.value === "" ? true : isValid);
        break;

      case "password":
        isValid = validator.isAlphanumeric(e.target.value, "en-US");
        setPasswordValid(e.target.value === "" ? true : isValid);
        break;

      default:
        break;
    }

    if (isValid) {
      let user = { ...userLog };
      user[e.target.name] = e.target.value;
      setUserLog({ ...user });
    }
  };

  const verifyUser = async () => {
    if (nameValid && passwordValid) {
      const { data: allUsers } = await axios.get(
        "http://localhost:7070/company/users"
      );
      const user = allUsers.find((el) => el.UserName === userLog.userName);
      if (user === undefined) {
        alert("we sorry but the userName is not match ");
      } else {
        if (user.Password === userLog.password) {
          login(user);
        } else {
          alert("we sorry but the password is not match");
        }
      }
      return;
    }
  };

  const login = async (user) => {
    if (userLog.password !== "2585") {
      const { data: userPremission } = await axios.get(
        `http://localhost:7070/company/permissions/${user._id}`
      );
      sessionStorage.setItem(
        "permissions",
        JSON.stringify(userPremission.permissions)
      );
      sessionStorage.setItem("isLogged", JSON.stringify(true));

      if (userPremission.permissions.find((el) => el === "Admin")) {
        sessionStorage.setItem("isAdmin", JSON.stringify(true));
        sessionStorage.setItem("name", JSON.stringify("admin"));
      } else {
        sessionStorage.setItem("isAdmin", JSON.stringify(false));
        const { data: employee } = await axios.get(
          `http://localhost:7070/company/employee/${user._id}`
        );
        sessionStorage.setItem("name", JSON.stringify(`${employee.firstName}`));
      }
      setAnyChange(!anyChange);
    } else {
      alert("welcom new user");
      navigate("/newuser");
    }
  };

  const adminBth = async () => {
    setUserLog({ userName: "admin", password: "admin" });
    setAdminClick(!adminClick);
  };

  useEffect(() => {
    if (adminClick) {
      verifyUser();
    }
  }, [adminClick]);

  return (
    <div className="loginPage">
      &nbsp;
      <h1>Login Page</h1>
      <button className="button" onClick={adminBth}>
        Admin
      </button>{" "}
      <br />
      <br />
      <span className="spanLogin">userName:</span>
      <input
        name="userName"
        id="userName"
        type={"text"}
        onChange={getInputText}
      />
      <br />
      <span>password :</span>{" "}
      <input
        name="password"
        id="password"
        type={"password"}
        onChange={getInputText}
      />
      <br />
      <button class="loginBth" onClick={verifyUser}>
        log here
      </button>
      <Link to="/newuser" style={{ color: "goldenrod" }}>
        first time?
      </Link>
    </div>
  );
}
