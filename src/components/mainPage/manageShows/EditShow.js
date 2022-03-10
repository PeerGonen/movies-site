import axios from "axios";
import validator from "validator";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// with this folder we control how the show information is edited extensively
export default function EditShow() {
  const navigate = useNavigate();
  const { showid } = useParams();

  const [nameValid, setNameValid] = useState(true);
  const [genresValid, setGenresValid] = useState(true);
  const [imagValid, setimagValid] = useState(true);

  const [newShowInfo, setNewShowInfo] = useState({
    Name: "", Genres: [], Image: "", Premiered: "",
});

  const settingShow = async () => {
    const { data: showsFromAxios } = await axios.get(
      `http://localhost:8080/subscriptions/shows/${showid}`
    );
    setNewShowInfo({ ...showsFromAxios });
  };

  useEffect(() => { settingShow() } );

  const setShowInfo = (e) => {
    let isValid = true;
    switch (e.target.name) {
      case "Name":
        isValid = validator.isByteLength(
          e.target.value, { min: 1, max: undefined });

        setNameValid(isValid);
      break;

      case "Genres":
        isValid = validator.isByteLength(
          e.target.value, { min: 1, max: undefined });

        setGenresValid(isValid);
      break;
      case "Image":
        isValid = validator.isByteLength(
          e.target.value, { min: 1, max: undefined });
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

  const cancel = () => { navigate("/shows/allshows") };

  // send to db and back to all the shows
  const submit = async (e) => {
    if (nameValid && genresValid && imagValid) {
      
    await axios.put(
      `http://localhost:8080/subscriptions/shows/${showid}`,
       newShowInfo);
      alert("Show updated successfully");
      navigate("/shows/allshows");
    }
  };

  
  return (
    <div style={{ border: "3px solid black" }}>

      <h3 className="h3">Edit Show</h3>
      show Name: <input type={"text"} onChange={setShowInfo}
      name="Name" defaultValue={newShowInfo.Name} />
<br />
      Genres:<input type={"text"} onChange={setShowInfo}
      name="Genres" defaultValue={newShowInfo.Genres} />
<br />
      Image URL:<input type={"text"} onChange={setShowInfo}
       name="Image" defaultValue={newShowInfo.Image} />
<br />
      Premiered date:<input onChange={setShowInfo} name="Premiered"
      type={"date"} defaultValue={newShowInfo.Premiered.slice(0, 10)} />
<br /> <br />

      <button className="updateBth" onClick={submit} name="submit">
      <span class="text">Update</span>
      </button>
      
 <button className="deleteBth"  onClick={cancel} name="cancel">
      <span>Cancel</span> 
      </button>
<br />
    </div>
  );
}
