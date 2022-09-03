import React from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";

import Flashcards from "./Flashcards";
import Comments from "./Comments";
import Quiz from "./Quiz";

export default function ArticleContent(props) {
  //-----------------------------------------------------------------------

  const [savedCards, setSavedCards] = React.useState([]); // tracks cards saved by user
  const [quizStoryDisp, setQuizStoryDisp] = React.useState(true); // tracks display of either quiz or comments section

  const [flashcards, setFlashcards] = React.useState([
    [props.article?.vocabulary[0], props.article?.vocabulary[1]],
    [props.article?.vocabulary[2], props.article?.vocabulary[3]],
  ]);

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

  //   function save(count, groupNumber) {
  //     // First checks if card with the same title already exists in saved cards, so no dupes added
  //     let shouldProceed = true;
  //     for (let savedCard of savedCards) {
  //       if (flashcards[groupNumber][count].title === savedCard.title) {
  //         shouldProceed = false;
  //       }
  //     }
  //     // if not a dupe, adds card to savedCards
  //     if (shouldProceed === true) {
  //       setSavedCards((prevSavedcards) => [
  //         ...prevSavedcards,
  //         flashcards[groupNumber][count],
  //       ]);
  //     }
  //   }
  // --------------------------------------------------------------------------------

  // filter saved cards, if count matches index of card, don't include it
  function deleteCard(count) {
    setSavedCards((prevSavedcards) =>
      prevSavedcards.filter((_, index) => index !== count)
    );
  }

  // manages display of quiz and comment section
  function toggleQuizStory() {
    setQuizStoryDisp((prevQuizStoryDisp) => !prevQuizStoryDisp);
  }

  // ------------------------------ ARTICLE BODY + FLASHCARDS ------------------------

  // ------------ THIS SECTION HANDLES HIGHLIGHTING FLASHCARD WORDS IN THE ARTICLE BODY!!!!!!!

  // //   gets all titles of flashcards i.e. all vocab (repeated code)
  //     let allFlashTitles = [];
  //     for (let i in flashcards) {
  //       let flashTitles = flashcards[i].map((flashcard) => flashcard.title);
  //       allFlashTitles = [...allFlashTitles, ...flashTitles];
  //     }

  // //   returns text with styled words if words are in flashcard titles
  //     function highlightWords(text) {
  //       if (text.text) {
  //         const words = text.text.split(" ");

  //         const highlightedText = words.map((word) => {
  //           if (allFlashTitles.includes(word)) {
  //             word = <b className="highlighted-word">{`${word + " "}`}</b>;
  //             return word;
  //           } else return word + " ";
  //         });
  //         return highlightedText;
  //       }
  //     }

  // FLASHCARDS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
          </p>
        }
      </div>
    ) : (
      <div className="card-text-pair first-pair">
        <p className="article-text">{props.article?.paragraphs[index].text}</p>
        <Flashcards
          savedCards={savedCards}
          save={save}
          flashcards={set}
          groupNumber={index}
        />
      </div>
    )
  );

  //   maps over number of flashcard groups (firebase collections)
  //   passes in group and identifier of group as groupNumber so card can be id'd and saved
  //   const flashymap = flashcards.map((group, i) =>
  //     i % 2 !== 0 ? (
  //       <div className="card-text-pair ">
  //         <Flashcards
  //           savedCards={savedCards}
  //           save={save}
  //           flashcards={group}
  //           groupNumber={i}
  //         />
  //         {<p className="article-text test-flex">{highlightWords(text[1])}</p>}
  //       </div>
  //     ) : (
  //       <div className="card-text-pair first-pair">
  //         <p className="article-text">{highlightWords(text[0])}</p>
  //         <Flashcards
  //           savedCards={savedCards}
  //           save={save}
  //           flashcards={group}
  //           groupNumber={i}
  //         />
  //       </div>
  //     )
  //   );

  // --------------------------------------------------------------------------

  return (
    <div className="article-container">
      <div className="card-text-pair">
        <div className="title-image-container">
          <div className="image-border">
            <img className="title-image"></img>
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
          <h3 className="saved-cards-title">Your Review Deck</h3>
          <Flashcards
            save={save}
            flashcards={savedCards}
            deleteCard={deleteCard}
          />
        </div>
      )}
      <div className="quiz-comment-box">
        <button
          className={`toggle-quiz-btn ${quizStoryDisp && "selected-btn"}`}
          onClick={toggleQuizStory}
        >
          Quiz
        </button>
        <button
          className={`toggle-story-btn ${!quizStoryDisp && "selected-btn"}`}
          onClick={toggleQuizStory}
        >
          Your Story
        </button>
        {quizStoryDisp ? (
          <Quiz article={props.article} />
        ) : (
          <Comments
          quizStoryDisp={quizStoryDisp}
            flashcards={flashcards}
            userIn={props.userIn}
            googleSignIn={props.googleSignIn}
          />
        )}
      </div>
    </div>
  );
}
