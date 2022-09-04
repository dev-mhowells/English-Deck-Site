import React from "react";

import leftArrow from "./icons/left-arrow.png";
import rightArrow from "./icons/right-arrow.png";
import dot from "./icons/dot.png";
import emptyDot from "./icons/empty-dot.png";
import Flashcards from "./Flashcards";

export default function FeaturedCard(props) {
  const [featuredDetails, setFeaturedDetails] = React.useState(false);

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
                <img className="featured-image"></img>
              </div>
              <div className="featured-info">
                <h3>{props.allArticles[0].articleInfo.title}</h3>
                <p>{props.allArticles[0].articleInfo.summary}</p>
                <h4>Level: {props.allArticles[0].articleInfo.level}</h4>
                <div className="featured-buttons">
                  <button onClick={toggleFeaturedDetails}>details</button>
                  <button>read</button>
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
            {/* <div className="flashcard"></div>
            <div className="flashcard-nav">
              <img className="left-arrow" src={leftArrow}></img>
              <div className="dots">
                <img className="dot" src={dot}></img>
                <img className="dot" src={emptyDot}></img>
                <img className="dot" src={emptyDot}></img>
              </div>
              <img className="right-arrow" src={rightArrow}></img>
            </div> */}
          </div>
        </div>
      </section>
    )
  );
}
