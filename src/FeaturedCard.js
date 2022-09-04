import React from "react";
import { Link } from "react-router-dom";

import Flashcards from "./Flashcards";

import { storage } from "./firebase-config";
import { ref, getDownloadURL } from "firebase/storage";

export default function FeaturedCard(props) {
  const [featuredDetails, setFeaturedDetails] = React.useState(false);

  const [imgURL, setImgURL] = React.useState("");

  // NOT SURE IF THERE IS A WAY NOT TO REPEAT THIS CALL..
  // fetches image from firebase
  // uses the image reference passed in to article.articleInfo which
  // corresponds to the image name
  React.useEffect(() => {
    getDownloadURL(
      ref(storage, `images/${props.allArticles[0].articleInfo.image}`)
    )
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

  function toggleFeaturedDetails() {
    setFeaturedDetails(!featuredDetails);
  }

  return (
    props.allArticles[0] && (
      <section className="featured-section">
        <h2>Featured Article</h2>
        <div className="featured-card">
          {!featuredDetails ? (
            <div className="featured-card-front">
              <div className="featured-image-border">
                <img className="featured-image" src={imgURL}></img>
              </div>
              <div className="featured-info">
                <h3>{props.allArticles[0].articleInfo.title}</h3>
                <p>{props.allArticles[0].articleInfo.summary}</p>
                <h4>Level: {props.allArticles[0].articleInfo.level}</h4>
                <div className="featured-buttons">
                  <button onClick={toggleFeaturedDetails}>details</button>
                  <Link to={`/${props.allArticles[0].articleId}`}>
                    <button>read</button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="featured-card-back">
              <h3 id="featured-back-title">
                {props.allArticles[0].articleInfo.title}
              </h3>
              <div className="detail-block">
                <h3>Paragraphs:</h3>
                <p>{props.allArticles[0].paragraphs.length}</p>
              </div>
              {/* <div className="detail-block">
              <h3>Theme:</h3>
              <p>people</p>
            </div> */}
              <div className="detail-block">
                <h3>Vocabulary:</h3>
                <ul>
                  {props.allArticles[0].vocabulary.map((wordObj) => (
                    <li>{wordObj.word}</li>
                  ))}
                </ul>
              </div>
              <div className="featured-back-buttons">
                <button onClick={toggleFeaturedDetails}>back</button>
                <button>read</button>
              </div>
            </div>
          )}
          <div className="featured-flashcards">
            <Flashcards flashcards={props.allArticles[0].vocabulary} />
          </div>
        </div>
      </section>
    )
  );
}
