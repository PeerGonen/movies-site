import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Show from "./ShowComp";

// In this folder we will perform the logic of show search by ID
export default function SpecificShow() {
  const { showid } = useParams();
  const [infoShow, setInfoShow] = useState();
  const [redy, setRedy] = useState(false);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    const getdata = async () => {
      const { data: showData } = await axios.get(
        `http://localhost:8080/subscriptions/shows/${showid}`
      );
      setInfoShow(showData);
      setRedy(true);
    };
    getdata();
  }, []);
  return (
    <div>
      {redy ? (
        <Show key={1} data={infoShow} setReload={[reload, setReload]} />
      ) : null}
    </div>
  );
}
