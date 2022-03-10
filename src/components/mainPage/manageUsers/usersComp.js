import AddUser from "./AddUser";
import AllUsers from "./AllUsers";
import EditUser from "./userComp/EditUser";
import React, { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";

// This is the folder through which we will control how the users are displayed
export default function ManageUsers() {
  const navigate = useNavigate();
  const navigateToMainPage = () => {
    navigate("/");
  };
  const navigateTo = (e) => {
    navigate(`/${e.target.name}`);
  };

  useEffect(() => {
    if (!JSON.parse(sessionStorage.getItem("isAdmin"))) {
      navigateToMainPage();
    }
  });

  const buttons = (
    <div>
      <button onClick={navigateTo} name="manageusers/allusers">
        {" "}
        All Users{" "}
      </button>
      <button onClick={navigateTo} name="manageusers/adduser">
        {" "}
        Add User{" "}
      </button>
    </div>
  );

  return (
    <div>
      {buttons}
      <Routes>
        <Route path="*" element={<AllUsers />} />
        <Route path="/allusers" element={<AllUsers />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/editUser/:userid" element={<EditUser />} />
      </Routes>
    </div>
  );
}
