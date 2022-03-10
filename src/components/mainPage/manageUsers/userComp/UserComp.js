import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// This is a folder through which we control how the user information is displayed and edited
export default function User(props) {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({});
  const [reload, setReload] = props.setReload;
  const edit = () => {
    navigate(`/manageusers/editUser/${props.data.userId}`);
  };

  useEffect(() => {
    getUserPermissions();
  });
  const getUserPermissions = async () => {
    const { data: UserPermissions } = await axios.get(
      `http://localhost:7070/company/permissions/${props.data.userId}`
    );
    setPermissions(UserPermissions);
  };

  const deleteUser = async () => {
    if (
      window.confirm(`Last warning before deleting ${props.data.firstName}`)
    ) {
      //After confirmation of the warning we will delete all the information from the server
      await axios.delete(
        `http://localhost:7070/company/users/${props.data.userId}`
      );
      await axios.delete(
        `http://localhost:7070/company/permissions/${props.data.userId}`
      );
      await axios.delete(
        `http://localhost:7070/company/employee/${props.data.userId}`
      );
      setReload(!reload); //reload
    }
  };

  return (
    <div className="userComp">
      <div style={{ display: "flex" }}>
        <div>
          Name:
          <span style={{ fontSize: "17px" }}>
            {`${props.data.firstName} ${props.data.lastName}`}
          </span>{" "}
          <br />
          User Name: <span>{`${props.data.userName}`}</span>
          <br />
          created date: <span>{`${props.data.createdDate}`}</span>
          <br />
          session time out: <span>{`${props.data.SessionTimeOut}`}</span> <br />
          <br /> &nbsp;
          <button className="bth" onClick={edit} name="">
            Edit
          </button>
          &nbsp;
          <button className="deleteBth" onClick={deleteUser} name="">
            Delete
          </button>
        </div>

        <div style={{ paddingLeft: "10px" }}>
          <h3 style={{ paddingLeft: "23px" }}>{`permissions:`}</h3>
          <ul>
            {permissions.permissions === undefined
              ? null
              : permissions.permissions.map((el, index) => (
                  <li key={index}>{el}</li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
