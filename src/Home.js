import "./index.css";
import React from "react";
import Card from "./Card";

import FeaturedCard from "./FeaturedCard";

function Home(props) {
  const [filteredCards, setFilteredCards] = React.useState([]);
  const [levelFilter, setLevelFilter] = React.useState("all");
  const [orderFilter, setOrderFilter] = React.useState("newest");
  const [reverseOrder, setReverseOrder] = React.useState(false);

  function filterByLevel(level) {
    const filtered = props.allArticles.filter(
      (article) => article.articleInfo.level === level
    );
    setFilteredCards(filtered);
  }

  function getLevel(e) {
    setLevelFilter(e.target.innerText);
  }

  function getOrder(e) {
    setOrderFilter(e.target.innerText);
  }

  // need to pass in props for filteredcard and reverse order to trigger useeffect in
  // card.js which calls imageURLs again to place them correctly - this seems strange
  // may be better way
  function renderCards() {
    let render;
    if (filteredCards.length) {
      render = filteredCards.map((article) => {
        return (
          <Card
            article={article}
            filteredCards={filteredCards}
            reverseOrder={reverseOrder}
          />
        );
      });
    } else
      render = props.allArticles.map((article) => {
        return <Card article={article} reverseOrder={reverseOrder} />;
      });
    return reverseOrder ? render.reverse() : render;
  }

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
      {props.allArticles && <FeaturedCard allArticles={props.allArticles} />}
      <section className="articles-section">
        <h2>All Articles</h2>
        <div className="organise-articles">
          <div className="organise-left">
            <button
              className={levelFilter === "all" && "selected-button"}
              onClick={(e) => {
                setFilteredCards([]);
                getLevel(e);
              }}
            >
              all
            </button>
            <button
              className={levelFilter === "beginner" && "selected-button"}
              onClick={(e) => {
                filterByLevel("beginner");
                getLevel(e);
              }}
            >
              beginner
            </button>
            <button
              className={levelFilter === "intermediate" && "selected-button"}
              onClick={(e) => {
                filterByLevel("intermediate");
                getLevel(e);
              }}
            >
              intermediate
            </button>
            <button
              className={levelFilter === "advanced" && "selected-button"}
              onClick={(e) => {
                filterByLevel("advanced");
                getLevel(e);
              }}
            >
              advanced
            </button>
          </div>
          <div className="organise-right">
            <button
              className={orderFilter === "newest" && "selected-button"}
              onClick={(e) => {
                setReverseOrder(false);
                getOrder(e);
              }}
            >
              newest
            </button>
            <button
              className={orderFilter === "oldest" && "selected-button"}
              onClick={(e) => {
                setReverseOrder(true);
                getOrder(e);
              }}
            >
              oldest
            </button>
          </div>
        </div>
        <div className="articles-display">{renderCards()}</div>
      </section>
      <footer>
        <p>Home</p>
        <p>About</p>
        <p>Contact</p>
      </footer>
    </div>
  );
}

export default Home;
