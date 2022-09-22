import "./index.css";
import React from "react";
import { useRef } from "react";

import { Link } from "react-router-dom";

import { storage } from "./firebase-config";
import { ref, getDownloadURL } from "firebase/storage";

import { animated } from "react-spring";
import { useSpring, to } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

export default function Card(props) {
  const [cardDetails, setCardDetails] = React.useState(false);
  const [imgURL, setImgURL] = React.useState("");

  // fetches image from firebase
  // uses the image reference passed in to article.articleInfo which
  // corresponds to the image name
  React.useEffect(() => {
    getDownloadURL(ref(storage, `images/${props.article.articleInfo.image}`))
      .then((url) => {
        console.log(
          props.article.articleInfo.title,
          props.article.articleInfo.image
        );
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
  }, [props.filteredCards, props.reverseOrder]);

  // toggles card back and front
  function toggleCardDetails() {
    setCardDetails(!cardDetails);
  }

  // ----------------- ANIMATION ---------------------

  const target = useRef(null);

  const [{ scale, zoom }, api] = useSpring(() => ({
    scale: 1,
    zoom: 0,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  useGesture(
    {
      onHover: ({ hovering }) => {
        hovering
          ? api.start({
              scale: 1.03,
            })
          : api.start({ scale: 1 });
      },
    },
    { target, eventOptions: { passive: false } }
  );

  return !cardDetails ? (
    <animated.div
      className="article-card"
      ref={target}
      style={{
        scale: to([scale, zoom], (s, z) => s + z),
      }}
    >
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
    </animated.div>
  ) : (
    <animated.div
      className="article-card-back"
      ref={target}
      style={{
        scale: to([scale, zoom], (s, z) => s + z),
      }}
    >
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
    </animated.div>
  );
}
