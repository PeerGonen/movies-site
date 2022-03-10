import axios from "axios";
import validator from "validator";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// In this folder we will follow the logic of adding a member
export default function AddMember() {
  const navigate = useNavigate();

  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [cityValid, setCityValid] = useState(false);

  const [newMemberInfo, setNewMemberInfo] = useState({
    Name: "",
    Email: "",
    City: "",
  });

  const setMemberInfo = (e) => {
    let isValid = true;
    switch (e.target.name) {
      case "Name":
        isValid = validator.isAlpha(e.target.value, "en-US", {
          ignore: " -",
        });
        if (isValid) {
          isValid = validator.isByteLength(e.target.value, { min: 2, max: 10 });
        }
        setNameValid(isValid);
        break;

      case "Email":
        isValid = validator.isEmail(e.target.value);
        if (isValid) {
          isValid = validator.isByteLength(e.target.value, {
            min: 2,
            max: undefined,
          });
        }
        setEmailValid(isValid);
        break;
      case "City":
        isValid = validator.isAlpha(e.target.value, "en-US", {
          ignore: " -",
        });
        if (isValid) {
          isValid = validator.isByteLength(e.target.value, { min: 2, max: 10 });
        }
        setCityValid(isValid);
        break;

      default:
        break;
    }
    if (isValid) {
    }
    let member = { ...newMemberInfo };
    member[e.target.name] = e.target.value;
    setNewMemberInfo({ ...member });
  };

  const cancel = () => {
    navigate("/Subscribers/allmembers");
  };

  const submit = async (e) => {
    if (nameValid && emailValid && cityValid) {
      //sand member to DB and sub to DB
      await axios.post(
        `http://localhost:8080/subscriptions/members`,
        newMemberInfo
      );

      //back to all member
      alert("member updated");
      navigate("/Subscribers/allmembers");
    }
  };

  return (
    <div className="userComp">
      <h4>Add Member</h4>
      member Name:
      <input type={"text"} onChange={setMemberInfo} name="Name" />
      <br />
      Email:
      <input type={"text"} onChange={setMemberInfo} name="Email" />
      <br />
      City:
      <input type={"text"} onChange={setMemberInfo} name="City" />
      <br /> <br />
      <button onClick={submit} name="submit">
        <span>Add</span>
      </button>
      <button onClick={cancel} name="cancel">
        <span>Cancel</span>
      </button>
      <br />
      <br />
    </div>
  );
}
