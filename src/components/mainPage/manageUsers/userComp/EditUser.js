import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import validator from "validator";

// with this folder we control how the user information is edited extensively
export default function EditUser() {
  const navigate = useNavigate();

  const { userid } = useParams();

  const [jsonEmployee, setJsonEmployee] = useState({});
  const [jsonperm, setJsonPrem] = useState({ permissions: [] });
  const [userFromDB, setUserFromDB] = useState({});

  // setUserFromDB(
  // setJsonEmployee(
  // setJsonPrem(
  const settingUser = async () => {
    const { data: usersFromAxios } = await axios.get(
      `http://localhost:7070/company/users/${userid}`
    );
    const { data: employeeFromAxios } = await axios.get(
      `http://localhost:7070/company/employee/${userid}`
    );
    const { data: permissionsFromAxios } = await axios.get(
      `http://localhost:7070/company/permissions/${userid}`
    );

    setUserFromDB({ ...usersFromAxios });
    setJsonEmployee({ ...employeeFromAxios });
    setJsonPrem({ ...permissionsFromAxios });
  };

  useEffect(() => {
    settingUser();
  }, []);

  const [newUserPerm, setNewUserPerm] = useState([
    false /*"View Subscriptions" */,
    false /*Create Subscriptions */,
    false /*Delete Subscriptions */,
    false /*View Movies */,
    false /*Create Movies */,
    false /*Delete Movies */,
  ]);

  // all the permissions
  const handlePerm = () => {
    const allPerm = [false, false, false, false, false, false];
    for (let i = 0; i <= jsonperm.permissions.length; i++) {
      if (jsonperm.permissions[i] === "View Subscriptions") {
        allPerm[0] = true;
      } else if (jsonperm.permissions[i] === "Create Subscriptions") {
        allPerm[1] = true;
      } else if (jsonperm.permissions[i] === "Delete Subscriptions") {
        allPerm[2] = true;
      } else if (jsonperm.permissions[i] === "View Movies") {
        allPerm[3] = true;
      } else if (jsonperm.permissions[i] === "Create Movies") {
        allPerm[4] = true;
      } else if (jsonperm.permissions[i] === "Delete Movies") {
        allPerm[5] = true;
      }
    }
    setNewUserPerm([...allPerm]);
    setNewUserInfo({
      firstName: jsonEmployee.firstName,
      lastName: jsonEmployee.lastName,
      userName: jsonEmployee.userName,
      createdDate: jsonEmployee.createdDate,
      SessionTimeOut: jsonEmployee.SessionTimeOut,
    });
  };

  useEffect(() => {
    handlePerm();
  }, [jsonperm]);

  const [newUserInfo, setNewUserInfo] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    createdDate: "",
    SessionTimeOut: 0,
  });

  const [firstName, setFirstNameValid] = useState(true);
  const [lastName, setLastNameValid] = useState(true);
  const [userName, setUserNameValid] = useState(true);

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

  // submit - sand to db(employee.json, permisions.json ), Password: 2585
  const submit = async (e) => {
    e.preventDefault();
    if (firstName && lastName && userName) {
      let newUser = {
        UserName: newUserInfo.userName,
        Password: `2585`,
      };

      await axios.put(
        `http://localhost:7070/company/users/${userFromDB._id}`,
        newUser
      );
      newUser = { ...newUserInfo };
      newUser.userId = userFromDB._id;

      await axios.put(
        `http://localhost:7070/company/employee/${userFromDB._id}`,
        newUser
      );

      const arrOfPermisions = markedToArr();
      const userPerm = { userId: userFromDB._id, permissions: arrOfPermisions };
      await axios.put(
        `http://localhost:7070/company/permissions/${userFromDB._id}`,
        userPerm
      );

      alert("user updated successfully");
      navigate("/manageusers/allusers");
    }
  };

  const cancel = () => {
    navigate("/manageusers/allusers");
  };

  const doMarked = (e) => {
    const PermissionsArr = [...newUserPerm];
    PermissionsArr[e.target.className] = e.target.checked;
    setNewUserPerm(PermissionsArr);
  };

  const markedToArr = () => {
    const filterdArr = [...newUserPerm];
    const premArr = [
      "View Subscriptions",
      "Create Subscriptions",
      "Create Movies",
      "View Movies",
      "Delete Movies",
      "Delete Subscriptions",
    ];

    if (filterdArr[1] || filterdArr[2]) {
      filterdArr[0] = true;
    }
    if (filterdArr[4] || filterdArr[5]) {
      filterdArr[3] = true;
    }

    const arrOfPermisions = [];
    filterdArr.forEach((el, index) => {
      if (el) {
        arrOfPermisions.push(premArr[index]);
      }
    });
    return premArr;
  };

  return (
    <div className="editUser">
      <h1> Edit user </h1>
      <form>
        <span>View Subscriptions:</span>
        <input
          type={"checkbox"}
          onChange={doMarked}
          checked={newUserPerm[0]}
          className="0"
          name="View Subscriptions"
        />
        <br />
        <span>Create Subscriptions:</span>
        <input
          type={"checkbox"}
          onChange={doMarked}
          checked={newUserPerm[1]}
          className="1"
          name="Create Subscriptions"
        />
        <br />
        <span>Delete Subscriptions:</span>
        <input
          type={"checkbox"}
          onChange={doMarked}
          checked={newUserPerm[2]}
          className="2"
          name="Delete Subscriptions"
        />
        <br />
        <span>View Movies:</span>
        <input
          type={"checkbox"}
          onChange={doMarked}
          name="View Movies"
          checked={newUserPerm[3]}
          className="3"
        />
        <br />
        <span>Create Movies:</span>
        <input
          type={"checkbox"}
          onChange={doMarked}
          checked={newUserPerm[4]}
          className="4"
          name="Create Movies"
        />
        <br />
        <span>Delete Movies:</span>
        <input
          type={"checkbox"}
          onChange={doMarked}
          checked={newUserPerm[5]}
          className="5"
          name="Delete Movies"
        />
        <br /> <br />
        <span>First Name:</span>
        <input
          type={"text"}
          onChange={setUserInfo}
          name="firstName"
          defaultValue={setJsonEmployee.firstName}
        />
        <br />
        <span>Last Name:</span>
        <input
          type={"text"}
          name="lastName"
          onChange={setUserInfo}
          defaultValue={setJsonEmployee.lastName}
        />
        <br />
        <span>User Name:</span>
        <input
          defaultValue={setJsonEmployee.userName}
          type={"text"}
          onChange={setUserInfo}
          name="userName"
        />
        <br />
        <span>Created date:</span>
        <input
          type={"date"}
          defaultValue={setJsonEmployee.createdDate}
          onChange={setUserInfo}
          name="createdDate"
        />
        <br /> <br />
        <span>Session Time Out:</span>
        <input
          type={"number"}
          defaultValue={setJsonEmployee.SessionTimeOut}
          min={0}
          onChange={setUserInfo}
          name="SessionTimeOut"
        />
        <br /> <br />
        <button onClick={submit} name="submit">
          <span>Update</span>
        </button>
        <button onClick={cancel} name="cancel">
          <span>Cancel</span>
        </button>
        <br />
      </form>
    </div>
  );
}
