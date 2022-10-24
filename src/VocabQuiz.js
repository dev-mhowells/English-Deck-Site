import React from "react";
import { useDrop, useDrag } from "react-dnd";

export default function VocabQuiz() {
  const [element, setElement] = React.useState();

  const words = [
    {
      word: "demeanour",
      id: 1,
    },
  ];

  // accept is a ref to type in useDrag(), ref={drop} used on empty-box
  // drop executed function on drop, callback function takes item object created in useDrag()
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "word",
    drop: (item) => fillGap(item),
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "word",
    item: { word: words[0].word },
  }));

  function fillGap(item) {
    console.log(item);
    setElement(item.word);
  }

  const vocab = words.map((word) => <p ref={drag}>{word.word}</p>);

  return (
    <div className="quiz-app-container quiz-container vocab-quiz">
      <div className="vocab-questions">
        <p>
          1. His calm{" "}
          <span className="empty-box" ref={drop}>
            {element}
          </span>
          made me feel relaxed when I was with him
        </p>
      </div>
      <div className="vocab-words">{vocab}</div>
    </div>
  );
}
