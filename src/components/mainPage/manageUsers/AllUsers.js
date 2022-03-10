import axios from "axios";
import React, { useEffect, useState } from "react";
import User from "./userComp/UserComp";

// In this folder we will create an array that will show us all the information about the users we have on the site
export default function AllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [reload, setReload] = useState([]);

  useEffect(() => {
    getAllEmployees();
  }, [reload]);

  const getAllEmployees = async () => {
    const { data: allEmployees } = await axios.get(
      `http://localhost:7070/company/employee`
    );
    const Users = allEmployees.map((el) => {
      return <User key={el.userId} data={el} setReload={[reload, setReload]} />;
    });
    setAllUsers(Users);
  };

  return <div className="userComp">{allUsers}</div>;
}
