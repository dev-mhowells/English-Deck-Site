import "./index.css";
import React from "react";
import Card from "./Card";

import leftArrow from "./icons/left-arrow.png";
import rightArrow from "./icons/right-arrow.png";
import dot from "./icons/dot.png";
import emptyDot from "./icons/empty-dot.png";

function Home(props) {
  const [featuredDetails, setFeaturedDetails] = React.useState(false);

  function toggleFeaturedDetails() {
    setFeaturedDetails(!featuredDetails);
  }

  const allCards = props.allArticles.map((article) => {
    return <Card article={article} />;
  });

  return (
    <div className="app">
      <nav>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <section className="header-section">
        <h1>English Deck</h1>
        <div className="subheadings">
          <h4>Read</h4>
          <h4>Remember</h4>
          <h4>Repeat</h4>
        </div>
      </section>
      <section className="featured-section">
        <h2>Featured Article</h2>
        <div className="featured-card">
          {!featuredDetails ? (
            <div className="featured-card-front">
              <div className="featured-image-border">
                <img className="featured-image"></img>
              </div>
              <div className="featured-info">
                <h3>The title of the card</h3>
                <p>
                  Just some text explaining stuff about the card. Maybe it's
                  this long but probably a bit longer, I don't know.
                </p>
                <h4>Level: intermediate</h4>
                <div className="featured-buttons">
                  <button onClick={toggleFeaturedDetails}>details</button>
                  <button>read</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="featured-card-back">
              <h3 id="featured-back-title">The title of the card</h3>
              <div className="detail-block">
                <h3>Paragraphs:</h3>
                <p>3</p>
              </div>
              <div className="detail-block">
                <h3>Theme:</h3>
                <p>people</p>
              </div>
              <div className="detail-block">
                <h3>Vocabulary:</h3>
                <ul>
                  <li>banana</li>
                  <li>apple</li>
                  <li>monkey</li>
                </ul>
              </div>
              <div className="featured-back-buttons">
                <button onClick={toggleFeaturedDetails}>back</button>
                <button>read</button>
              </div>
            </div>
          )}
          <div className="featured-flashcards">
            <div className="flashcard"></div>
            <div className="flashcard-nav">
              <img className="left-arrow" src={leftArrow}></img>
              <div className="dots">
                <img className="dot" src={dot}></img>
                <img className="dot" src={emptyDot}></img>
                <img className="dot" src={emptyDot}></img>
              </div>
              <img className="right-arrow" src={rightArrow}></img>
            </div>
          </div>
        </div>
      </section>
      <section className="articles-section">
        <h2>All Articles</h2>
        <div className="organise-articles">
          <div className="organise-left">
            <button className="selected-button">all</button>
            <button>beginner</button>
            <button>intermediate</button>
            <button>advanced</button>
          </div>
          <div className="organise-right">
            <button className="selected-button">newest</button>
            <button>oldest</button>
          </div>
        </div>
        <div className="articles-display">{allCards}</div>
      </section>
    </div>
  );
}

export default Home;
