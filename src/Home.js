import "./index.css";
import React from "react";
import Card from "./Card";

import FeaturedCard from "./FeaturedCard";

function Home(props) {
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
      <FeaturedCard allArticles={props.allArticles}/>
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
