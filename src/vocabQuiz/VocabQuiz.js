import React from "react";
import { useDrop, useDrag } from "react-dnd";

import Word from "./Word";

export default function VocabQuiz() {
  const [element, setElement] = React.useState();

  const words = [
    {
      word: "demeanour",
      id: 1,
    },
    {
      word: "doggy",
      id: 2,
    },
  ];

  // accept is a ref to type in useDrag(), ref={drop} used on empty-box
  // drop executed function on drop, callback function takes item object created in useDrag()
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "word",
    drop: (item) => fillGap(item),
  }));

  //   console.log("this is drag", drag);

  function fillGap(item) {
    setElement(item.word);
  }

  const wordsDisplay = words.map((word) => <Word word={word.word} />);

  const [hovering, setHovering] = React.useState();

  function handleMouseOver() {
    setHovering(true);
  }
  function handleMouseOut() {
    setHovering(false);
  }

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
            onClick={() => {
              element && setElement("");
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
