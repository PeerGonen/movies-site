import ManageUsers from "./manageUsers/usersComp";
import Shows from "./manageShows/ShowsComp";
import Members from "./manageMembers/MembersComp";
import MainContext from "../MainContext";
import React, { useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// This is our default[main] folder
export default function MainPage() {
  const {
    change: [anyChange, setAnyChange],
  } = useContext(MainContext);
  const isAdmin = JSON.parse(sessionStorage.getItem("isAdmin"));
  const nameOfUser = JSON.parse(sessionStorage.getItem("name"));
  const permissions = JSON.parse(sessionStorage.getItem("permissions"));

  const navigate = useNavigate();
  const navigateTo = (e) => {
    navigate(`/${e.target.name}`);
  };

  const logOut = () => {
    if (window.confirm("log out?")) {
      sessionStorage.clear();
      console.log("logOut");
      navigate("/");
      setAnyChange(!anyChange);
    }
  };

  const adminBth = (
    <div>
      <button onClick={navigateTo} name="manageusers">
        Users Managment
      </button>
      <button onClick={navigateTo} name="shows">
        Shows
      </button>
      <button onClick={navigateTo} name="Subscribers">
        Subscriptions
      </button>
      <button class="logOutBth" onClick={logOut}>
        Log Out
      </button>
    </div>
  );

  const employeeBth = (
    <div>
      {permissions.find((el) => el === "View Movies") ? (
        <button onClick={navigateTo} name="shows">
          Shows{" "}
        </button>
      ) : null}
      {permissions.find((el) => el === "View Subscriptions") ? (
        <button onClick={navigateTo} name="Subscribers">
          Subscriptions{" "}
        </button>
      ) : null}
      <button class="logOutBth" onClick={logOut}>
        Log Out
      </button>
    </div>
  );

  return (
    <div className="mainComp">
      <h1> {`Hello ${nameOfUser}, Welcome back`}</h1>
      {isAdmin ? adminBth : employeeBth}
      <br />
      <Routes>
        <Route path="*" element={null} />
        <Route path="/manageusers/*" element={<ManageUsers />} />
        <Route path="/shows/*" element={<Shows />} />
        <Route path="/Subscribers/*" element={<Members />} />
      </Routes>
    </div>
  );
}
