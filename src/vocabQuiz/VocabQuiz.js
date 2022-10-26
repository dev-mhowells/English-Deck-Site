import React from "react";
import Sentence from "./Sentence";

import Word from "./Word";

export default function VocabQuiz() {
  const [droppedWords, setDroppedWords] = React.useState([]);

  const words = ["demeanour", "doggy"];
  const sentences = ["a"];

  // takes element and removes from array of dropped words
  function updateUsedWords(word) {
    console.log("remove word ran");
    setDroppedWords((prevDroppedWords) =>
      prevDroppedWords.filter((e) => e !== word)
    );
    console.log("removed: ", word);
  }

  // returns true if word is in droppedWords
  function isDropped(word) {
    return droppedWords.indexOf(word) > -1;
  }

  // isdropped passes in return value of function, true or false
  const wordsDisplay = words.map((word, index) => (
    <Word word={word} isDropped={isDropped(word)} id={index} />
  ));

  const sentenceDisplay = sentences.map((sentence, index) => (
    <Sentence
      setDroppedWords={setDroppedWords}
      updateUsedWords={updateUsedWords}
      id={index}
    />
  ));

  return (
    <div className="quiz-app-container quiz-container vocab-quiz">
      <div className="vocab-questions">{sentenceDisplay}</div>
      <div className="vocab-words">{wordsDisplay}</div>
    </div>
  );
}
