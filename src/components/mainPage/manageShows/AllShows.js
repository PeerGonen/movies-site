import React, { useState, useEffect } from "react";
import axios from "axios";
import Show from "./ShowComp";

// In this folder we will create an array that will show us all the information about the shows we have on the site
export default function AllShows() {
  const [allShows, setAllShows] = useState([]);
  const [reload, setReload] = useState(false);

  const getAllshwos = async () => {
    const { data: allShowsFromDB } = await axios.get(
      `http://localhost:8080/subscriptions/shows`
    );

    const Shwos = allShowsFromDB.map((el) => {
      return <Show key={el._id} data={el} setReload={[reload, setReload]} />;
    });
    setAllShows(Shwos);
  };
  useEffect(() => {
    getAllshwos();
  }, [reload]);
  return <div>{allShows}</div>;
}
