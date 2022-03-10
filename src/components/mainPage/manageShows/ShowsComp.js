import AddShow from "./AddShow";
import AllShows from "./AllShows";
import EditShow from "./EditShow";
import SearchComponent from "./SearchComp";
import SpecificShow from "./ShowById";
import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";

// This is the folder that will display the information about the existing shows on our site -
// who has permissions to access this information and change it, doing a CRUD request to the sows
export default function Shows() {
  const navigate = useNavigate();

  const [searchTaxtInStaet, setSearchTaxtInStaet] = useState("");
  const [canView, setCanView] = useState(undefined);
  const [canCreate, setCanCreate] = useState(false);

  const setPermisionsfromsession = () => {
    const response = sessionStorage.getItem("permissions");
    const arrOfPermi = JSON.parse(response);
    if (arrOfPermi.find((el) => el === "Create Movies")) {
      setCanCreate(true);
    } else {
      setCanCreate(false);
    }
    if (arrOfPermi.find((el) => el === "Delete Movies")) {
      sessionStorage.setItem("canDelete", "true");
    } else {
      sessionStorage.setItem("canDelete", "false");
    }
    if (arrOfPermi.find((el) => el === "View Movies")) {
      setCanView(true);
    } else {
      setCanView(false);
    }
  };

  const userVerify = () => {
    if (!canView) {
      navigate("/");
    }
  };

  useEffect(() => {
    setPermisionsfromsession();
  });

  useEffect(() => {
    if (canView !== undefined) {
      userVerify();
    }
  });

  const searchText = (e) => {
    setSearchTaxtInStaet(e.target.value);
  };

  const search = () => {
    navigate(`/shows/search/${searchTaxtInStaet}`);
  };

  const allShowsButton = () => {
    navigate("/shows/allshows");
  };

  const addShowButton = () => {
    navigate("/shows/addshow");
  };

  return (
    <div className="userComp">
      <button onClick={allShowsButton}>All Shows</button>
      &nbsp;
      {canCreate ? <button onClick={addShowButton}>Add Show</button> : null}
      &nbsp;
      <input
        className="searchInput"
        type={"text"}
        placeholder="search for show:"
        onChange={searchText}
      />
      <button onClick={search}> search </button>
      <Routes>
        <Route path="*" element={<AllShows />} />
        <Route path="/search/:stringToSearch" element={<SearchComponent />} />
        <Route path="/allshows" element={<AllShows />} />
        <Route path="/addshow" element={<AddShow />} />
        <Route path="/editshow/:showid" element={<EditShow />} />
        <Route path="/specifishow/:showid" element={<SpecificShow />} />
      </Routes>
    </div>
  );
}
