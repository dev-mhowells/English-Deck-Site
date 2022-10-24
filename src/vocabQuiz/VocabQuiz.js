import React from "react";
import { useDrop, useDrag } from "react-dnd";

import Word from "./Word";

export default function VocabQuiz() {
  const [element, setElement] = React.useState();
  const [droppedWords, setDroppedWords] = React.useState([]);

  const words = ["demeanour", "doggy"];

  // accept is a ref to type in useDrag(), ref={drop} used on empty-box
  // drop executed function on drop, callback function takes item object created in useDrag()
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "word",
    drop: (item) => fillGap(item),
  }));

  // takes element and removes from array of dropped words
  function updateUsedWords(word) {
    console.log("going to remove");
    setDroppedWords((prevDroppedWords) =>
      prevDroppedWords.filter((e) => e !== word)
    );
    console.log("removed: ", word);
  }

  // sets the element to the word(item.word) dropped in, changing sentence display
  // adds word to droppedWords arr
  function fillGap(item) {
    element && updateUsedWords(element);
    setElement(item.word);
    setDroppedWords((prevDroppedWords) => [...prevDroppedWords, item.word]);
  }
  console.log("element:", element);
  console.log(droppedWords);

  const [hovering, setHovering] = React.useState();

  function handleMouseOver() {
    setHovering(true);
  }
  function handleMouseOut() {
    setHovering(false);
  }

  // returns true if word is in droppedWords
  function isDropped(word) {
    return droppedWords.indexOf(word) > -1;
  }

  // isdropped passes in return value of function, true or false
  const wordsDisplay = words.map((word) => (
    <Word word={word} isDropped={isDropped(word)} />
  ));

  return (
    <div className="quiz-app-container quiz-container vocab-quiz">
      <div className="vocab-questions">
        <p>
          1. His calm{" "}
          <span
            className={`empty-box ${element && "filled-box"}`}
            ref={drop}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={(e) => {
              element && setElement("");
              element && updateUsedWords(element);
            }}
          >
            {element && hovering ? "\u2716" : element}
          </span>
          made me feel relaxed when I was with him
        </p>
      </div>
      <div className="vocab-words">{wordsDisplay}</div>
    </div>
  );
}
