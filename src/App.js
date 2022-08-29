import Home from "./Home";
import Article from "./Article";
import { Routes, Route } from "react-router-dom";
import React from "react";

export default function App() {
  const [cards, setCards] = React.useState([
    { title: "title1", difficulty: "hard" },
    { title: "title2", difficulty: "medium" },
    { title: "title3", difficulty: "easy" },
  ]);

  // gets card object from card array
  function getArticleDetails(articleName) {
    return cards.find((card) => card.title === articleName);
  }

  return (
    <Routes>
      <Route path="/" element={<Home cards={cards} />} />
      <Route path=":articleTitle" element={<Article cards={cards} getArticleDetails={getArticleDetails}/>} />
    </Routes>
  );
}
