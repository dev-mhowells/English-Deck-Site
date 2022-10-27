import React from "react";
import Sentence from "./Sentence";

import Word from "./Word";

export default function VocabQuiz(props) {
  const [droppedWords, setDroppedWords] = React.useState([]);
  const [check, setCheck] = React.useState(false);

  const words = props.article.vocabulary.map((obj) => obj.word);
  const sentencesWords = props.article.vocabulary.map((obj) => ({
    sentence: obj.example,
    word: obj.word,
  }));

  function checkAnswers() {
    setCheck((prevCheck) => !prevCheck);
  }

  // takes element and removes from array of dropped words
  function updateUsedWords(word) {
    setDroppedWords((prevDroppedWords) =>
      prevDroppedWords.filter((e) => e !== word)
    );
  }

  // returns true if word is in droppedWords
  function isDropped(word) {
    return droppedWords.indexOf(word) > -1;
  }

  // isdropped passes in return value of function, true or false
  const wordsDisplay = words.map((word, index) => (
    <Word word={word} isDropped={isDropped(word)} id={index} />
  ));

  const sentenceDisplay = sentencesWords.map((sentenceWord, index) => (
    <Sentence
      setDroppedWords={setDroppedWords}
      updateUsedWords={updateUsedWords}
      sentenceWord={sentenceWord}
      id={index}
      check={check}
    />
  ));

  return (
    <div className="quiz-app-container quiz-container vocab-quiz">
      <div className="vocab-questions">{sentenceDisplay}</div>
      <div className="vocab-words">{wordsDisplay}</div>
      <button className="check-btn" onClick={checkAnswers}>
        check
      </button>
    </div>
  );
}
