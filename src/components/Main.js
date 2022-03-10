import MainContext from "./MainContext";
import Login from "./loginComps/LoginPage";
import FirstTime from "./loginComps/CreateAccount";
import MainPage from "./mainPage/MainComp";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// This is the main and providor folder of our site
export default function Main() {
  const [editUserId, setEditId] = useState("");
  const [change, setChange] = useState(false);
  if (sessionStorage.getItem("isLogged") === null) {
    sessionStorage.setItem("isLogged", JSON.stringify(false));
  }

  const data = {
    change: [change, setChange],
    editUserId: [editUserId, setEditId],
  };

  return (
    <MainContext.Provider value={data}>
      <div className="App">
        {JSON.parse(sessionStorage.getItem("isLogged")) ? (
          <div>
            <Routes>
              <Route path="*" element={<MainPage />} />
            </Routes>
          </div>
        ) : (
          <div>
            <Routes>
              <Route path="*" element={<Login />} />

              <Route path="/newuser" element={<FirstTime />} />
            </Routes>
          </div>
        )}
      </div>
    </MainContext.Provider>
  );
}
