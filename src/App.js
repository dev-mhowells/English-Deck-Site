import Home from "./Home";
import Article from "./Article";

import { Routes, Route } from "react-router-dom";
import React from "react";

import { db } from "./firebase-config";

import { collection, query, getDocs } from "firebase/firestore";

export default function App() {
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

  function getArticleDetails(articleId) {
    return allArticles.find((article) => article.meta.id === articleId);
  }

  // ----------------------------------------------------- //

//   const [imgURL, setImgURL] = React.useState("");

//   React.useEffect(() => {
//     getDownloadURL(ref(storage, "images/eye.png"))
//       .then((url) => {
//         setImgURL(url);
//       })
//       .catch((error) => {
//         switch (error.code) {
//           case "storage/object-not-found":
//             // File doesn't exist
//             break;
//           case "storage/unauthorized":
//             // User doesn't have permission to access the object
//             break;
//           case "storage/unknown":
//             // Unknown error occurred, inspect the server response
//             break;
//         }
//       });
//   }, []);

//   console.log("IMG URL", imgURL);

  console.log("ALL", allArticles);

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
