import axios from "axios";
import Show from "./ShowComp";
import Fuse from "fuse.js";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//In this folder we will perform the logic of the input search
export default function SearchComponent() {
  const [allShows, setAllShows] = useState([]);
  const { stringToSearch } = useParams();
  const [reload, setReload] = useState(false);

  const getAllshwos = async () => {
    const { data: allShowsFromDB } = await axios.get(
      `http://localhost:8080/subscriptions/shows`
    );

    const options = {
      includeScore: true,
      keys: ["Name", "Genres"],
    };
    const fuse = new Fuse(allShowsFromDB, options);
    const result = fuse.search(stringToSearch);
    const showsResult = result.map((el) => el.item);

    const Shwos = showsResult.map((el) => {
      return <Show key={el._id} data={el} setReload={[reload, setReload]} />;
    });
    setAllShows(Shwos);
  };

  useEffect(() => {
    getAllshwos();
  }, [stringToSearch]);

  return (
    <div>
      <h3>Search result:</h3>
      {allShows}
    </div>
  );
}
