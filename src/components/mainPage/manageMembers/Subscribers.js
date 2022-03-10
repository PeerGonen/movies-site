import axios from "axios";
import AddSubscripsion from "./AddSub";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// In this folder we will manage our subscriptions
export default function Subscribers(props) {
  const [userSubscripsions, setUserSubscripsions] = useState({
    Shows: [{ showId: "" }],
  });
  const [listOfSubs, setListOfSubs] = useState([]);
  const [addSubComponent, setAddSubComponent] = useState(false);
  const [reload, setReload] = props.setReload;

  const getSub = async () => {
    const { data: responesFromDb } = await axios.get(
      `http://localhost:8080/subscriptions/subscribers/memnerId/${props.memberId}`
    );

    setUserSubscripsions(responesFromDb);
  };
  useEffect(() => {
    getSub();
  }, []);

  const subToListItem = async () => {
    if (userSubscripsions.Shows.length >= 1) {
      const listItems = await Promise.all(
        userSubscripsions.Shows.map(async (el, index) => {
          const { data: showInfo } = await axios.get(
            `http://localhost:8080/subscriptions/shows/${el.showId}`
          );

          return (
            <li key={index}>
              {" "}
              <Link
                to={`/shows/specifishow/${el.showId}`}
              >{`${showInfo.Name},`}</Link>
              {` ${el.date}`}
            </li>
          );
        })
      );
      const helper = [...listOfSubs];
      helper.push(listItems);
      setListOfSubs(helper);
    }
  };

  useEffect(() => {
    subToListItem();
  }, [userSubscripsions]);

  const addSub = () => {
    const helper = addSubComponent;
    setAddSubComponent(!helper);
  };

  return (
    <div className="userComp">
      &nbsp;
      <button onClick={addSub}>Add Show to Subscripsions</button>
      {addSubComponent ? (
        <AddSubscripsion
          memberId={props.memberId}
          setReload={props.setReload}
        />
      ) : null}
      <br />
      <span>Subscripsions status:</span>
      {userSubscripsions.Shows.length >= 1 ? (
        <ul>{listOfSubs}</ul>
      ) : (
        <span> no Subscripsions</span>
      )}
    </div>
  );
}
