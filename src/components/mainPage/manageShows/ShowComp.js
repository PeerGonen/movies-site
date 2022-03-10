import React from "react";
import SubscriptionsTOShow from "./ShowBySub";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// This is the folder that will manage the entire activity of the shows that will be displayed on the site
export default function Show(props) {
  const navigate = useNavigate();
  const [reload, setReload] = props.setReload;
  const date = props.data.Premiered.slice(0, 4);
  const canDelete = JSON.parse(sessionStorage.getItem("canDelete"));

  const edit = () => {
    navigate(`/shows/editshow/${props.data._id}`);
  };

  // Using this function we will delete a sub`s show
  const deleteShow = async () => {
    if (window.confirm(`You sure you want to delete ${props.data.Name}?`)) {
      await axios.delete(`
      http://localhost:8080/subscriptions/shows/${props.data._id}`);
      const { data: SubsFromDb } = await axios.get(
        `http://localhost:8080/subscriptions/subscribers`
      );

      SubsFromDb.forEach((element) => {
        element.Shows.forEach(async (el) => {
          if (el.showId === props.data._id) {
            console.log(el.showId);
            console.log(props.data._id);
            console.log(element.MemberId);

            delete (await axios.put(
              `http://localhost:8080/subscriptions/subscribers/removeShow/${element.MemberId}/${props.data._id}`
            ));
          }
        });
      });
      setReload(!reload);
    }
  };

  return (
    <div className="allShows">
      <div className="shows">
        <img
          src={props.data.Image}
          alt={`of ${props.data.Name}`}
          height="300"
        />
        <div style={{ padding: "1px" }}>
          <span style={{ fontSize: "40px" }}>{props.data.Name} , </span>
          <span> {date}</span> <br />
          <br />
          <span>Genres:</span>
          <span>{`"${props.data.Genres.join('", "')}" `}</span> <br />
        </div>
      </div>
      <div className="shows">
        <div>
          <br />
          <button onClick={edit}>
            <span>Edit</span>
          </button>
          {canDelete ? (
            <button onClick={deleteShow}>
              <span>Delete</span>
            </button>
          ) : null}
        </div>
        <div style={{ paddingLeft: "40px" }}>
          <SubscriptionsTOShow showId={props.data._id} />
        </div>
      </div>
    </div>
  );
}
