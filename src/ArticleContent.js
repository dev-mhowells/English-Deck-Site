import React from "react";

import { storage } from "./firebase-config";
import { ref, getDownloadURL } from "firebase/storage";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Flashcards from "./Flashcards";
import Comments from "./Comments";
import Quiz from "./Quiz";
import VocabQuiz from "./vocabQuiz/VocabQuiz";

export default function ArticleContent(props) {
  //-----------------------------------------------------------------------

  const [savedCards, setSavedCards] = React.useState([]); // tracks cards saved by user

  const [flashcards, setFlashcards] = React.useState(splitVocab()); // see function below

  const [imgURL, setImgURL] = React.useState("");

  // NOT SURE IF THERE IS A WAY NOT TO REPEAT THIS CALL..
  // fetches image from firebase
  // uses the image reference passed in to article.articleInfo which
  // corresponds to the image name
  React.useEffect(() => {
    getDownloadURL(ref(storage, `images/${props.article.articleInfo.image}`))
      .then((url) => {
        setImgURL(url);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  }, []);

  // splits original array of vocabulary from database into an array of
  // arrays with each nested array representing a different paragraph
  // database vocabulary objects come with paragraph number attached,
  // its purpose is to match with the correct paragraph.
  function splitVocab() {
    let splitByPara = [];
    for (let paragraphObj of props.article.paragraphs) {
      let arr = [];
      for (let vocabObj of props.article.vocabulary) {
        if (Number(vocabObj.paragraphNumber) === paragraphObj.number) {
          arr.push(vocabObj);
        }
      }
      splitByPara.push(arr);
    }
    return splitByPara;
  }

  // count is passed into the function in Flashcard.js to ensure current card is saved!
  // groupNumber is passed in to ensure the correct flashcard group
  function save(count, groupNumber) {
    // First checks if card with the same title already exists in saved cards, so no dupes added
    let shouldProceed = true;
    for (let savedCard of savedCards) {
      if (flashcards[groupNumber][count].word === savedCard.word) {
        shouldProceed = false;
      }
    }
    // if not a dupe, adds card to savedCards
    if (shouldProceed === true) {
      setSavedCards((prevSavedcards) => [
        ...prevSavedcards,
        flashcards[groupNumber][count],
      ]);
    }
  }

  // --------------------------------------------------------------------------------

  // filter saved cards, if count matches index of card, don't include it
  function deleteCard(count) {
    setSavedCards((prevSavedcards) =>
      prevSavedcards.filter((_, index) => index !== count)
    );
  }

  // ------------------------------ ARTICLE BODY + FLASHCARDS ------------------------

  // ------------ THIS SECTION HANDLES HIGHLIGHTING FLASHCARD WORDS IN THE ARTICLE BODY!!!!!!!

  // highlightWords() to be called on text to render in paragraphs, however,
  // needs to be called using an array which is not the vocab on the flashcards
  // but a list of variations which should be created in CMS. e.g. 'phenomenon'
  // in vocab list won't highlight 'phenomena' in article.

  function highlightWords(text) {
    const allVocab = props.article.vocabulary.map((wordObj) => wordObj.word);
    console.log(allVocab);
    if (text.text) {
      const words = text.text.split(" ");
      console.log(words);
      const highlightedText = words.map((word) => {
        if (allVocab.includes(word)) {
          word = <b className="highlighted-word">{`${word + " "}`}</b>;
          return word;
        } else return word + " ";
      });
      return highlightedText;
    }
  }

  //   maps over number of flashcard groups (firebase collections)
  //   passes in set and identifier of group as groupNumber so card can be id'd and saved
  const cardTextPair = flashcards.map((set, index) =>
    index % 2 !== 0 ? (
      <div className="card-text-pair ">
        <Flashcards
          savedCards={savedCards}
          save={save}
          flashcards={set}
          groupNumber={index}
        />
        {
          <p className="article-text test-flex">
            {props.article?.paragraphs[index].text}
            {/* {highlightWords(props.article.paragraphs[index])} */}
          </p>
        }
      </div>
    ) : (
      <div className="card-text-pair first-pair">
        <p className="article-text">
          {props.article?.paragraphs[index].text}
          {/* {highlightWords(props.article.paragraphs[index])} */}
        </p>
        <Flashcards
          savedCards={savedCards}
          save={save}
          flashcards={set}
          groupNumber={index}
        />
      </div>
    )
  );

  // --------------------------------------------------------------------------

  const [quizTab, setQuizTab] = React.useState("Quiz");

  function swapQuizTab(e) {
    setQuizTab(e.target.innerHTML);
    console.log(e.target.innerHTML);
  }

  return (
    <div className="article-container">
      <div className="card-text-pair">
        <div className="title-image-container">
          <div className="image-border">
            <img className="title-image" src={imgURL}></img>
          </div>
        </div>
        <div className="article-title-container">
          <p className="author-level">
            <b>Level:</b> {props.article?.articleInfo.level}
          </p>
          <h2 className="article-title">{props.article?.articleInfo.title}</h2>
          <p className="author-level">
            <b>Author:</b> {props.article?.articleInfo.author}
          </p>
        </div>
      </div>
      {cardTextPair}

      {savedCards[0] && (
        <div>
          <h2 className="saved-cards-title">Your Review Deck</h2>
          <Flashcards
            save={save}
            flashcards={savedCards}
            deleteCard={deleteCard}
          />
        </div>
      )}
      <div className="quiz-comment-box">
        <button
          className={`toggle-quiz-btn ${quizTab === "Quiz" && "selected-btn"}`}
          onClick={(e) => {
            swapQuizTab(e);
          }}
        >
          Quiz
        </button>
        <button
          className={`toggle-quiz-btn ${
            quizTab === "Vocabulary" && "selected-btn"
          }`}
          onClick={(e) => {
            swapQuizTab(e);
          }}
        >
          Vocabulary
        </button>
        <button
          className={`toggle-quiz-btn ${
            quizTab === "Your Story" && "selected-btn"
          }`}
          onClick={(e) => {
            swapQuizTab(e);
          }}
        >
          Your Story
        </button>
        {quizTab === "Quiz" && <Quiz article={props.article} />}
        {quizTab === "Your Story" && (
          <Comments
            article={props.article}
            flashcards={flashcards}
            userIn={props.userIn}
            googleSignIn={props.googleSignIn}
          />
        )}
        {quizTab === "Vocabulary" && (
          <DndProvider backend={HTML5Backend}>
            <VocabQuiz article={props.article} />
          </DndProvider>
        )}
      </div>
    </div>
  );
}
