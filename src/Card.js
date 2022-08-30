import "./index.css";
import React from "react";

import { Link } from "react-router-dom";

import { storage } from "./firebase-config";
import { ref, getDownloadURL } from "firebase/storage";

export default function Card(props) {
  const [cardDetails, setCardDetails] = React.useState(false);
  const [imgURL, setImgURL] = React.useState("");

  // fetches image from firebase
  // uses the image reference passed in to article.meta which
  // corresponds to the image name
  React.useEffect(() => {
    getDownloadURL(ref(storage, `images/${props.article.meta.image}`))
      .then((url) => {
        setImgURL(url);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  }, []);

  // toggles card back and front
  function toggleCardDetails() {
    setCardDetails(!cardDetails);
  }

  return !cardDetails ? (
    <div className="article-card">
      <div className="circle-image-border">
        <img className="featured-image" src={imgURL}></img>
      </div>
      <h3>{props.article.meta.title}</h3>
      <p>
        Just some text explaining stuff about the card. Maybe it's this long.
      </p>
      <h4>Level: Intermediate</h4>
      <div className="card-buttons">
        <button onClick={toggleCardDetails}>details</button>
        <button>
          <Link to={`/${props.article.meta.id}`}>read</Link>
        </button>
      </div>
    </div>
  ) : (
    <div className="article-card-back">
      <h3 id="featured-back-title">The title of the card</h3>
      <div className="detail-block">
        <h3 className="subheading-back">Paragraphs:</h3>
        <p>3</p>
      </div>
      <div className="detail-block">
        <h3 className="subheading-back">Theme:</h3>
        <p>people</p>
      </div>
      <div className="detail-block">
        <h3 className="subheading-back">Vocabulary:</h3>
        <ul>
          <li>banana</li>
          <li>apple</li>
          <li>monkey</li>
        </ul>
      </div>
      <div className="featured-back-buttons">
        <button onClick={toggleCardDetails}>back</button>
        <Link to={`/${props.article.meta.id}`}>
          <button>read</button>
        </Link>
      </div>
    </div>
  );
}
