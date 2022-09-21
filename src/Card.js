import "./index.css";
import React from "react";

import { Link } from "react-router-dom";

import { storage } from "./firebase-config";
import { ref, getDownloadURL } from "firebase/storage";

export default function Card(props) {
  const [cardDetails, setCardDetails] = React.useState(false);
  const [imgURL, setImgURL] = React.useState("");

  // fetches image from firebase
  // uses the image reference passed in to article.articleInfo which
  // corresponds to the image name
  React.useEffect(() => {
    getDownloadURL(ref(storage, `images/${props.article.articleInfo.image}`))
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
      <h3>{props.article.articleInfo.title}</h3>
      <p>{props.article.articleInfo.summary}</p>
      <h4>Level: {props.article.articleInfo.level}</h4>
      <div className="card-buttons">
        <button onClick={toggleCardDetails}>details</button>
        <Link to={`/${props.article.articleId}`}>
          <button className="button">read</button>
        </Link>
      </div>
    </div>
  ) : (
    <div className="article-card-back">
      <h3 id="featured-back-title">{props.article.articleInfo.title}</h3>
      <div className="detail-block">
        <h3 className="subheading-back">Paragraphs:</h3>
        <h3 className="subheading-back">{props.article.paragraphs.length}</h3>
      </div>
      {/* <div className="detail-block">
        <h3 className="subheading-back">Theme:</h3>
        <p>people</p>
      </div> */}
      <div className="detail-block">
        <h3 className="subheading-back">Vocabulary:</h3>

        <ul>
          {props.article.vocabulary.map((wordObj) => (
            <li>{wordObj.word}</li>
          ))}
        </ul>
      </div>
      <div className="back-buttons card-back-buttons">
        <button onClick={toggleCardDetails}>back</button>
        <Link to={`/${props.article.articleId}`}>
          <button>read</button>
        </Link>
      </div>
    </div>
  );
}
