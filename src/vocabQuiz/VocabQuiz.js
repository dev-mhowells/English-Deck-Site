import React from "react";
import Sentence from "./Sentence";

import Word from "./Word";

export default function VocabQuiz(props) {
  const [droppedWords, setDroppedWords] = React.useState([]);
  const [check, setCheck] = React.useState(false);

  const words = props.article.vocabulary.map((obj) => obj.word);

  // returns array of words with no full stop at the end of any words
  function removeEndPunctuation(sentence) {
    const wordsWithoutPunctuation = sentence.split(" ").map((word) => {
      return word.charAt(word.length - 1) === "." ? word.slice(0, -1) : word;
    });
    return wordsWithoutPunctuation;
  }

  // returns an object with a sentence, and a word, word is either the main vocab
  // word or one of the variations, depending on which occurs in the example sentence
  const sentencesWords = props.article.vocabulary.map((obj) => {
    // get variations array if there is one
    const variations = obj.variations && obj.variations;
    // get example sentence
    const sentence = obj.example;
    // get an array of words where all fullstops have been removed from the end of each
    const wordsWithoutPunctuation = removeEndPunctuation(sentence);

    let returnedWord;
    // for each word of the sentence, if the word is equal to the obj.word(main vocab word) then return
    // that word, if not, check if the word of the sentence is euqal to any words in the
    // variation array
    wordsWithoutPunctuation.forEach((word) => {
      if (word === obj.word) {
        returnedWord = word;
      } else {
        variations &&
          variations.forEach((variation) => {
            if (variation === word) returnedWord = variation;
          });
      }
    });

    return {
      sentence: obj.example,
      word: returnedWord,
    };
  });

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
  const wordsDisplay = sentencesWords.map((sentenceWord, index) => (
    <Word
      word={sentenceWord.word}
      isDropped={isDropped(sentenceWord.word)}
      id={index}
    />
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
        {!check ? "check" : "uncheck"}
      </button>
    </div>
  );
}
