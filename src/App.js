import Home from "./Home";
import Article from "./Article";

import { Routes, Route } from "react-router-dom";
import React from "react";

import { db } from "./firebase-config";
import { collection, query, getDocs } from "firebase/firestore";

export default function App() {
  const [cards, setCards] = React.useState([
    { title: "title1", difficulty: "hard" },
    { title: "title2", difficulty: "medium" },
    { title: "title3", difficulty: "easy" },
  ]);

  const [allArticles, setAllArticles] = React.useState([]);

  React.useEffect(() => {
    async function getAllArticles() {
      // clear articles array so that it doesn't double up if useEffect called again
      setAllArticles([]);

      const q = query(collection(db, "articles"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setAllArticles((prevAllArticles) => [...prevAllArticles, doc.data()]);
      });
    }

    getAllArticles();
  }, []);

  // gets card object from card array
  //   function getArticleDetails(articleName) {
  //     return cards.find((card) => card.title === articleName);
  //   }

  function getArticleDetails(articleId) {
    return allArticles.find((article) => article.meta.id === articleId);
  }

  console.log("ALL", allArticles);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home cards={cards} allArticles={allArticles} />}
      />
      <Route
        path=":articleId"
        element={
          <Article
            cards={cards}
            allArticles={allArticles}
            getArticleDetails={getArticleDetails}
          />
        }
      />
    </Routes>
  );
}
