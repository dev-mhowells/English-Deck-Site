import "./index.css";
import React from "react";

import { Link } from "react-router-dom";

export default function Card(props) {
  const [cardDetails, setCardDetails] = React.useState(false);

  function toggleCardDetails() {
    setCardDetails(!cardDetails);
  }

  return !cardDetails ? (
    <div className="article-card">
      <div className="circle-image-border">
        <img className="featured-image"></img>
      </div>
      <h3>The Title of the Card</h3>
      <p>
        Just some text explaining stuff about the card. Maybe it's this long.
      </p>
      <h4>Level: Intermediate</h4>
      <div className="card-buttons">
        <button onClick={toggleCardDetails}>details</button>
        <button>
          <Link to={`/${props.article.title}`}>read</Link>
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
        <Link to={`/${props.article.title}`}>
          <button>read</button>
        </Link>
      </div>
    </div>
  );
}
