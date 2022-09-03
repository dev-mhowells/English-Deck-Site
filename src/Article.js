import { useParams } from "react-router-dom";
import React from "react";
import ArticleContent from "./ArticleContent";

//------------------------------------------------------
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config";

// -----------------------------------------------------------

export default function Article(props) {
  let params = useParams();

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

  // ---------------------------------------------------------------

  // ARTICLECONTENT ONLY LOADS IF THERE IS AN ARTICLE, REMOVES ERRORS IN
  // CHILD COMPONENTS TRYING TO RENDER BASED ON ARTICLE WHEN DOESNT
  // EXIST YET
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
      {article && (
        <ArticleContent
          userIn={userIn}
          googleSignIn={googleSignIn}
          article={article}
        />
      )}
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
