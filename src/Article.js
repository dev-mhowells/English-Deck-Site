import { useParams } from "react-router-dom";
import React from "react";
import ArticleContent from "./ArticleContent";

//------------------------------------------------------
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config";

// -----------------------------------------------------------

export default function Article(props) {
  //:articleTitle from App.js routing - URL param
  let params = useParams();

  // function finds artlicle object from articleID which
  // is from params above, which in turn gets the value from <Link to>
  // in Card.js - cannot find by title because spaces etc.

  let article = props.getArticleDetails(params.articleId);

  // ---------------------- FIREBASE GOOGLE SIGN IN ------------------------- //

  // authstatechange sets userIn on log in and log out
  const [userIn, setUserIn] = React.useState({});

  onAuthStateChanged(auth, (user) => {
    setUserIn(user);
  });

  function googleSignIn() {
    signInWithPopup(auth, provider);
  }

  function googleSignOut() {
    signOut(auth);
  }

  console.log("THIS IS THE ARTICLE ----------- ", article);

  // ---------------------------------------------------------------

  //   return <h2>{article && article.articleInfo.title}</h2>;

  return (
    <div className="whole-page">
      <nav className="nav">
        <div className="nav-left">
          <p className="nav-link">Home</p>
          <p className="nav-link">About</p>
          <p className="nav-link">Contact</p>
        </div>
        <div className="nav-title">
          <h1 className="nav-title">English Deck</h1>
        </div>
        <div className="nav-right">
          <p
            className="nav-link login"
            onClick={!userIn ? googleSignIn : googleSignOut}
          >
            {!userIn ? "Login" : "Log out"}
          </p>
        </div>
      </nav>
      <ArticleContent
        userIn={userIn}
        googleSignIn={googleSignIn}
        article={article}
      />
      <footer>
        <p>Home</p>
        <p>Contact</p>
        <p
          className="footer-login"
          onClick={!userIn ? googleSignIn : googleSignOut}
        >
          {!userIn ? "Login" : "Log out"}
        </p>
      </footer>
    </div>
  );
}

// --------------------------------------------------------------------------//
