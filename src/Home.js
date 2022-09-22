import "./index.css";
import React from "react";
import Card from "./Card";

import FeaturedCard from "./FeaturedCard";

function Home(props) {
  const [filteredCards, setFilteredCards] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState("all");

  function filterByLevel(level) {
    const filtered = props.allArticles.filter(
      (article) => article.articleInfo.level === level
    );
    setFilteredCards(filtered);
  }

  function getSelected(e) {
    setSelectedFilter(e.target.innerText);
  }

  const allCards =
    props.allArticles &&
    props.allArticles.map((article) => {
      return <Card article={article} />;
    });

  // for some reason need to pass filtered cards so it can be used
  // in useEffect[] to re-render imgURLs in right order after filter
  const allFilteredCards = filteredCards.map((article) => {
    return <Card article={article} filteredCards={filteredCards} />;
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
      {props.allArticles && <FeaturedCard allArticles={props.allArticles} />}
      <section className="articles-section">
        <h2>All Articles</h2>
        <div className="organise-articles">
          <div className="organise-left">
            <button
              className={selectedFilter === "all" && "selected-button"}
              onClick={(e) => {
                setFilteredCards([]);
                getSelected(e);
              }}
            >
              all
            </button>
            <button
              className={selectedFilter === "beginner" && "selected-button"}
              onClick={(e) => {
                filterByLevel("beginner");
                getSelected(e);
              }}
            >
              beginner
            </button>
            <button
              className={selectedFilter === "intermediate" && "selected-button"}
              onClick={(e) => {
                filterByLevel("intermediate");
                getSelected(e);
              }}
            >
              intermediate
            </button>
            <button
              className={selectedFilter === "advanced" && "selected-button"}
              onClick={(e) => {
                filterByLevel("advanced");
                getSelected(e);
              }}
            >
              advanced
            </button>
          </div>
          <div className="organise-right">
            <button className="selected-button">newest</button>
            <button>oldest</button>
          </div>
        </div>
        <div className="articles-display">
          {filteredCards.length ? allFilteredCards : allCards}
        </div>
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
