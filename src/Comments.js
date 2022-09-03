import React from "react";
import check from "./icons/check.png";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  serverTimestamp,
  query,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "./firebase-config";

import leftTriangle from "./icons/left-triangle-small.png";
import rightTriangle from "./icons/right-triangle-small.png";
import downArrow from "./icons/small-down-arrow.png";
import binBtn from "./icons/bin.png";
import editBtn from "./icons/edit.png";

export default function Comments(props) {
  const [userStory, setUserStory] = React.useState(""); // user input on page
  const [checklist, setChecklist] = React.useState(getAllVocabWords()); // list of target words from article
  const [usedWords, setUsedWords] = React.useState([]); // real time updated list of words user has written and match checklist
  const [posts, setPosts] = React.useState([]); // user submitted posts stored in Firebase
  const [currentComment, setCurrentComment] = React.useState(0); // manages displayed comment
  const [comments, setComments] = React.useState(props.article.comments);

  function getAllVocabWords() {
    return props.article.vocabulary.map((wordObj) => wordObj.word);
  }

  console.log("COMMENTS", comments);

  // manages currently displayed comment
  function nextComment() {
    currentComment < postsDisplay.length - 1 &&
      setCurrentComment((prevComment) => prevComment + 1);
  }

  function lastComment() {
    if (comments)
      currentComment > 0 && setCurrentComment((prevComment) => prevComment - 1);
  }

  // updates Firebase with newly created post
  //   const postsCollectionRef = collection(db, "posts");

  //   const q = query(postsCollectionRef, orderBy("createdAt", "desc"));

  // creates subcollection of comments inside the article document
  async function createSubcollection() {
    await addDoc(
      collection(db, "articles", props.article.articleInfo.title, "comments"),
      {
        createdAt: serverTimestamp(),
        post: userStory,
        usedWords: usedWords,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
      }
    );
    setUserStory("");
    setUsedWords([]);
    lastComment();
  }

  // updates comment section
  // subscription / real time snapshot update of data - use onSnapshot instead of getDocs
  // onSnapshot fires on initial render, does not return promise
  React.useEffect(() => {
    const q = query(
      collection(db, "articles", props.article.articleInfo.title, "comments")
    );
    onSnapshot(q, (snapshot) => {
      setComments([]);
      const allComments = snapshot.docs.map((doc) => {
        return { ...doc.data() };
      });
      setComments(allComments);
    });
  }, []);

  console.log("THESE ARE COMMENTS", comments);

  // reads input of text area on keystroke, checks if checklist word is written, if so adds to usedWords
  // also checks usedWords, if item in usedWords is no longer in textarea, removes
  // from usedWords. One keystroke delay
  function readStory(e) {
    setUserStory(e.target.value);

    for (let i in checklist) {
      let userStoryLower = userStory.toLocaleLowerCase();
      if (
        userStoryLower.includes(checklist[i]) &&
        !usedWords.includes(checklist[i])
      ) {
        setUsedWords((prevUsedWords) => [...prevUsedWords, checklist[i]]);
      } else if (
        !userStoryLower.includes(checklist[i]) &&
        usedWords.includes(checklist[i])
      ) {
        setUsedWords((prevUsedWords) =>
          prevUsedWords.filter((word) => word !== checklist[i])
        );
      }
    }
  }

  // deletes post from Firebase
  async function deletePost(postId) {
    const postDoc = doc(db, "posts", postId);
    await deleteDoc(postDoc);
  }

  // sets text in textarea (takes post.post), deletes post
  // sets used words to the array saved in the post object of words used
  // state updates used words checklist
  function edit(text, postId, postUsedWords) {
    setUserStory(text);
    deletePost(postId);
    setUsedWords(postUsedWords);
  }

  const checklistDisplay = checklist.map((title) => (
    <div className="check-word-pair">
      {usedWords.includes(title) && <img src={check} className="check"></img>}
      <p
        className={`checklist-items ${
          usedWords.includes(title) && "used-word"
        }`}
      >
        {title}
      </p>
    </div>
  ));

  const postsDisplay =
    comments &&
    comments.map((post) => {
      return (
        <div className="posted-story">
          {props.userIn && post.author.id === auth.currentUser.uid && (
            <img
              className="post-icons"
              src={binBtn}
              onClick={() => {
                deletePost(post.id);
              }}
            ></img>
          )}
          {props.userIn && post.author.id === auth.currentUser.uid && (
            <img
              className="post-icons edit-btn"
              src={editBtn}
              onClick={() => edit(post.post, post.id, post.usedWords)}
            ></img>
          )}

          <p className="post-body">{post.post}</p>
          <p className="post-author">
            <b>By: </b>
            {post.author.name}
          </p>
        </div>
      );
    });

  return (
    <div>
      <div className="comment-section-container">
        <div className="comment-section">
          <h4 className="comment-section-title">
            Practice using the words from the article
          </h4>
          <p className="comment-section-subtitle">
            <b>Leave a comment or tell your own story!</b>
          </p>
          <div className="post-box">
            <textarea
              className="textarea"
              value={userStory}
              onChange={readStory}
            ></textarea>
            <button
              className="post-btn"
              onClick={props.userIn ? createSubcollection : props.googleSignIn}
            >
              {props.userIn ? "post" : "log in to post"}
            </button>
          </div>
          <div className="checklist-container">{checklistDisplay}</div>
          <div className="more-stories">
            <img src={downArrow}></img>
            <p>Stories from other learners</p>
          </div>
        </div>
      </div>
      <div className="posts-container">
        <h3 className="comments-title">Comments and Stories</h3>
        <div className="comment-slider">
          <img
            src={leftTriangle}
            onClick={lastComment}
            className="triangle"
          ></img>
          {postsDisplay && postsDisplay[currentComment]}
          <img
            src={rightTriangle}
            onClick={nextComment}
            className="triangle"
          ></img>
        </div>
      </div>
    </div>
  );
}
