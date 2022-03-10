import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";

// In the next folder we will do the logic and edit the page where a user addition will be displayed
export default function AddUser() {
  const [firstName, setFirstNameValid] = useState(false);
  const [lastName, setLastNameValid] = useState(false);
  const [userName, setUserNameValid] = useState(false);

  const setUserInfo = (e) => {
    let isValid = true;
    switch (e.target.name) {
      case "firstName":
        isValid = validator.isAlpha(e.target.value, "en-US", {
          ignore: " -",
        });
        if (isValid) {
          isValid = validator.isByteLength(e.target.value, { min: 2, max: 10 });
        }
        setFirstNameValid(e.target.value === "" ? true : isValid);
        break;

      case "lastName":
        isValid = validator.isAlpha(e.target.value, "en-US", {
          ignore: " -",
        });
        if (isValid) {
          isValid = validator.isByteLength(e.target.value, { min: 2, max: 10 });
        }
        setLastNameValid(e.target.value === "" ? true : isValid);
        break;
      case "userName":
        isValid = validator.isAlphanumeric(e.target.value);
        setUserNameValid(e.target.value === "" ? true : isValid);
        break;

      default:
        break;
    }
    if (isValid) {
      let user = { ...newUserInfo };
      user[e.target.name] = e.target.value;
      setNewUserInfo({ ...user });
    }
  };

  const navigate = useNavigate();
  const [coretTime, setCoretTime] = useState([]);
  const [newUserInfo, setNewUserInfo] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    createdDate: new Date().toISOString().slice(0, 10),
    SessionTimeOut: 60,
  });
  const [newUserPermissions, setNewUserPermissions] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const getTime = () => {
    let todayDate = new Date().toISOString().slice(0, 10);
    setCoretTime(todayDate);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (firstName && lastName && userName) {
      //sand to db
      //Password: `${newUserInfo.lastName}1234`
      let newUser = {
        UserName: newUserInfo.userName,
        Password: `1234`,
      };
      const { data: userResponsFromDB } = await axios.post(
        `http://localhost:7070/company/users`,
        newUser
      );
      //get id tnd sand to employee.json
      newUser = { ...newUserInfo };
      // newUser.userName = "userName exist";
      newUser.userId = userResponsFromDB._id;

      await axios.post(
        `
    http://localhost:7070/company/employee`,
        newUser
      );

      //get id tnd sand to permisions.json
      const arrOfPermisions = checkboxsToArrOfString();
      const userPermi = {
        userId: userResponsFromDB._id,
        permissions: arrOfPermisions,
      };
      await axios.post(
        `
    http://localhost:7070/company/permissions`,
        userPermi
      );

      //back to all users
      alert("User added successfully");

      navigate("/manageusers/allusers");
    }
  };

  const cancel = () => {
    navigate("/manageusers/allusers");
  };

  useEffect(() => {
    getTime();
  });

  const hendelCheckbox = (e) => {
    const PermissionsArr = [...newUserPermissions];
    PermissionsArr[e.target.className] = e.target.checked;
    setNewUserPermissions(PermissionsArr);
  };

  const checkboxsToArrOfString = () => {
    const arrOfBol = [...newUserPermissions];
    //if have Create or Dalete => have to get view
    const arrOfOpsions = [
      "View Subscriptions",
      "Create Subscriptions",
      "Delete Subscriptions",
      "View Movies",
      "Create Movies",
      "Delete Movies",
    ];
    if (arrOfBol[1] || arrOfBol[2]) {
      arrOfBol[0] = true;
    }
    if (arrOfBol[4] || arrOfBol[5]) {
      arrOfBol[3] = true;
    }
    const arrOfPermisions = [];
    arrOfBol.forEach((el, index) => {
      if (el) {
        arrOfPermisions.push(arrOfOpsions[index]);
      }
    });
    return arrOfPermisions;
  };

  //========================================return
  return (
    <div className="userComp">
      <h4>Add user</h4>
      <form>
        spanView Subscriptions:
        <input
          type={"checkbox"}
          className="0"
          onClick={hendelCheckbox}
          name="View Subscriptions"
        />
        <br />
        Create Subscriptions:
        <input
          type={"checkbox"}
          className="1"
          onClick={hendelCheckbox}
          name="Create Subscriptions"
        />
        <br />
        Delete Subscriptions:
        <input
          type={"checkbox"}
          className="2"
          onClick={hendelCheckbox}
          name="Delete Subscriptions"
        />
        <br />
        View Movies:{" "}
        <input
          type={"checkbox"}
          className="3"
          onClick={hendelCheckbox}
          name="View Movies"
        />
        <br />
        Create Movies:{" "}
        <input
          type={"checkbox"}
          className="4"
          onClick={hendelCheckbox}
          name="Create Movies"
        />
        <br />
        Delete Movies:
        <input
          type={"checkbox"}
          className="5"
          onClick={hendelCheckbox}
          name="Delete Movies"
        />
        <br /> <br />
        First Name:
        <input type={"text"} name="firstName" onChange={setUserInfo} />
        <br />
        Last Name:
        <input type={"text"} name="lastName" onChange={setUserInfo} />
        <br />
        User Name:{" "}
        <input type={"text"} name="userName" onChange={setUserInfo} />
        <br />
        Created date:
        <input
          type={"date"}
          name="createdDate"
          onChange={setUserInfo}
          defaultValue={coretTime}
          style={{ width: "170px" }}
        />
        <br /> <br />
        Session Time Out:
        <input
          type={"number"}
          min={0}
          onChange={setUserInfo}
          name="SessionTimeOut"
          defaultValue={60}
          style={{ width: "120px" }}
        />
        <br /> <br />
        <button
          className="Bth"
          onClick={submit}
          name="submit"
        >
          <span>Add</span>
        </button>
        <button
          className="deleteBth"
          onClick={cancel}
          name="cancel"
        >
          <span>Cancel</span>
        </button>
        <br />
      </form>
    </div>
  );
}
