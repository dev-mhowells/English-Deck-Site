import Home from "./Home";
import Article from "./Article";

import { Routes, Route } from "react-router-dom";
import React from "react";

import { db } from "./firebase-config";
import { collection, query, getDocs } from "firebase/firestore";

export default function App() {
  const [allArticles, setAllArticles] = React.useState([]);

  // this wont run again when refreshing a /something route..
  // 1. call a seperate useEffect inside article.js
  // 2. have some other state change that will cause it to run again..
  React.useEffect(() => {
    async function getAllArticles() {
      const q = query(collection(db, "articles"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setAllArticles((prevAllArticles) => [...prevAllArticles, doc.data()]);
      });
    }

    getAllArticles();
  }, []);

  // used in article.js to get correct article to render
  function getArticleDetails(articleId) {
    return allArticles.find((article) => article.articleId === articleId);
  }

  return (
    <Routes>
      <Route path="/" element={<Home allArticles={allArticles} />} />
      <Route
        path=":articleId"
        element={
          <Article
            allArticles={allArticles}
            getArticleDetails={getArticleDetails}
          />
        }
      />
    </Routes>
  );
}
