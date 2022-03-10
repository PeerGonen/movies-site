import axios from "axios";
import validator from "validator";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// This is the folder that we will be able to add new movies bt the parmeters we declerd
export default function AddShow() {
  const navigate = useNavigate();

  const [nameValid, setNameValid] = useState(false);
  const [genresValid, setGenresValid] = useState(false);
  const [imagValid, setimagValid] = useState(false);

  const [newShowInfo, setNewShowInfo] = useState({
    Name: "",
    Genres: [],
    Image: "",
    Premiered: "",
  });

  const setShowInfo = (e) => {
    let isValid = true;
    switch (e.target.name) {
      case "Name":
        isValid = validator.isByteLength(e.target.value, {
          min: 1,
          max: undefined,
        });

        setNameValid(isValid);
        break;

      case "Genres":
        isValid = validator.isByteLength(e.target.value, {
          min: 1,
          max: undefined,
        });

        setGenresValid(isValid);
        break;
      case "Image":
        isValid = validator.isByteLength(e.target.value, {
          min: 1,
          max: undefined,
        });
        setimagValid(isValid);
        break;

      default:
        break;
    }
    if (isValid) {
      let show = { ...newShowInfo };
      show[e.target.name] = e.target.value;
      setNewShowInfo({ ...show });
    }
  };

  const cancel = () => {
    navigate("/shows/allshows");
  };

  const submit = async () => {
    if (nameValid && genresValid && imagValid) {
      //sand to db
      await axios.post(
        `http://localhost:8080/subscriptions/shows`,
        newShowInfo
      );
      //back to all show
      alert("show added");
      navigate("/shows/allshows");
    }
  };

  //nameValid genresValid imagValid
  return (
    <div style={{ border: "1px solid black", margin: "4px" }}>
      <br />
      <span>Add Show</span>
      <br />
      <br />
      show Name:
      <input type={"text"} onChange={setShowInfo} name="Name" />
      <br />
      Genres:
      <input
        type={"text"}
        onChange={setShowInfo}
        placeholder="Science-Fiction,Action,Crime"
        name="Genres"
        style={{ width: "200px" }}
      />
      <br />
      Image URL:{" "}
      <input
        type={"text"}
        onChange={setShowInfo}
        name="Image"
        style={{ width: "175px" }}
      />
      <br />
      Premiered date:
      <input
        type={"date"}
        onChange={setShowInfo}
        name="Premiered"
        style={{ width: "150px" }}
      />
      <br /> <br />
      <button onClick={submit} name="submit">
        {" "}
        <span>Add</span>
      </button>
      <button onClick={cancel} name="cancel">
        <span>Cancel</span>
      </button>
      <br />
    </div>
  );
}
