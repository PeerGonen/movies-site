import axios from "axios";
import Subscribers from "./Subscribers";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Member(props) {
  const navigate = useNavigate();
  const [reload, setReload] = props.setReload;

  const canDelete = JSON.parse(sessionStorage.getItem("canDelete"));

  const edit = () => {
    navigate(`/Subscribers/editmember/${props.data._id}`);
  };

  const deleteMember = async () => {
    if (window.confirm(`You sure you want to delete ${props.data.Name}?`)) {
      // delet member
      await axios.delete(
        `http://localhost:8080/subscriptions/members/${props.data._id}`
      );

      //delet Member from subs
      await axios.delete(
        `http://localhost:8080/subscriptions/subscribers/${props.data._id}`
      );

      //reload
      setReload(!reload);
    }
  };

  return (
    <div className="userComp">
      <span>{props.data.Name}</span> <br />
      <span>Email: {`${props.data.Email} `}</span> <br />
      <span>City: {`${props.data.City} `}</span> <br />
      &nbsp;
      <button onClick={edit}>
        <span>Edit</span>
      </button>
      &nbsp; &nbsp;
      {canDelete ? (
        <button onClick={deleteMember}>
          <span>Delete</span>
        </button>
      ) : null}
      <Subscribers memberId={props.data._id} setReload={props.setReload} />
    </div>
  );
}
