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

export default function Comments(props) {
  const [userStory, setUserStory] = React.useState(""); // user input on page
  // const [checklist, setChecklist] = React.useState(getAllVocabWords()); // list of target words from article
  const [usedWords, setUsedWords] = React.useState([]); // real time updated list of words user has written and match checklist
  const [currentComment, setCurrentComment] = React.useState(0); // manages displayed comment
  const [comments, setComments] = React.useState(props.article.comments); // user submitted comments stored in Firebase

  function getAllVocabWords() {
    return props.article.vocabulary.map((wordObj) => wordObj.word);
  }

  // NEED TO WORK ON THIS CODE TO MANAGE DELETION OF FIRST COMMENT - CAUSES BUG
  // manages currently displayed comment
  function nextComment() {
    currentComment < postsDisplay.length - 1 &&
      setCurrentComment((prevComment) => prevComment + 1);
  }

  function lastComment() {
    if (comments)
      currentComment > 0 && setCurrentComment((prevComment) => prevComment - 1);
  }

  // updates Firebase with newly created comment
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
  // also gets id, which is the auto-generated doc name on document creation done by FB
  // this is used to delete and update.
  React.useEffect(() => {
    const q = query(
      collection(db, "articles", props.article.articleInfo.title, "comments")
    );
    onSnapshot(q, (snapshot) => {
      setComments([]);
      const allComments = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setComments(allComments);
    });
  }, []);

  const allVocab = props.article.vocabulary.map((wordObj) => wordObj.word);

  // reads input of text area on keystroke, checks if checklist word is written, if so adds to usedWords
  // also checks usedWords, if item in usedWords is no longer in textarea, removes
  // from usedWords. One keystroke delay

  function readStory(e) {
    setUserStory(e.target.value);
  }

  function checkStory(e) {
    const comment = e.target.value;
    for (let i in allVocab) {
      let userStoryLower = comment.toLocaleLowerCase();
      if (
        userStoryLower.includes(allVocab[i]) &&
        !usedWords.includes(allVocab[i])
      ) {
        setUsedWords((prevUsedWords) => [...prevUsedWords, allVocab[i]]);
      } else if (
        !userStoryLower.includes(allVocab[i]) &&
        usedWords.includes(allVocab[i])
      ) {
        setUsedWords((prevUsedWords) =>
          prevUsedWords.filter((word) => word !== allVocab[i])
        );
      }
    }
  }

  // deletes post from Firebase
  async function deletePost(postId) {
    const postDoc = doc(
      db,
      "articles",
      props.article.articleInfo.title,
      "comments",
      postId
    );
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

  const checklistDisplay = allVocab.map((title) => (
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

  const postsDisplay = comments.map((comment) => {
    const created = new Date(comment.createdAt?.seconds * 1000);
    const firstName = comment.author.name.split(" ")[0];
    return (
      <div className="comment">
        <div className="comment-data">
          <p>By: {firstName}</p>
          <p>{`${created.getDate()}/${
            created.getMonth() + 1
          }/${created.getFullYear()}`}</p>
        </div>
        <div className="comment-text">
          <p>{comment.post}</p>
          <p className="comment-vocab-count">
            Vocabulary used: {comment.usedWords.length}
          </p>
        </div>
        {props.userIn && comment.author.id === auth.currentUser.uid && (
          <div className="edit-comment">
            <p
              onClick={() => {
                deletePost(comment.id);
              }}
            >
              delete
            </p>
            <p
              onClick={() => edit(comment.post, comment.id, comment.usedWords)}
            >
              edit
            </p>
          </div>
        )}
      </div>
    );
  });

  return (
    <div>
      <div className="comment-section-container">
        <div className="comment-section">
          <h3 className="comment-section-title">
            Practice using the words from the article
          </h3>
          <div className="post-box">
            <textarea
              className="textarea"
              value={userStory}
              onChange={(e) => {
                readStory(e);
                checkStory(e);
              }}
            ></textarea>
            <button
              className="post-btn"
              onClick={props.userIn ? createSubcollection : props.googleSignIn}
            >
              {props.userIn ? "post" : "log in to post"}
            </button>
          </div>
          <div className="checklist-container">{checklistDisplay}</div>
        </div>
      </div>
      <div className="posts-container">
        <h2 className="comments-title">Comments and Stories</h2>
        <div className="comments-container">{postsDisplay}</div>
      </div>
    </div>
  );
}
