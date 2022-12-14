import React from "react";
import { useDrop } from "react-dnd";

export default function Sentence(props) {
  const [hovering, setHovering] = React.useState();
  const [element, setElement] = React.useState();
  const [isCorrect, setIsCorrect] = React.useState();

  // accept is a ref to type in useDrag(), ref={drop} used on empty-box
  // drop executed function on drop, callback function takes item object created in useDrag()
  // needs to take [element] state as a depenency or won't be able to access updated version
  // of it inside fillGap
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "word",
      drop: (item) => fillGap(item),
    }),
    [element]
  );

  function checkAnswer(chosenWord) {
    setIsCorrect(chosenWord === props.sentenceWord.word);
    // return {question: props.id, isCorrect}
  }

  // sets the element to the word(item.word) dropped in, changing sentence display
  // adds word to droppedWords arr
  function fillGap(item) {
    // if there is already an element, remove that element from droppedWords
    // element needs to be included as dependency in useDrop to work
    element && props.updateUsedWords(element);
    // set element to the word just dropped - props.droppedWords.index
    setElement(item.word);
    // update droppedWords with new element just dropeed
    props.setDroppedWords((prevDroppedWords) => [
      ...prevDroppedWords,
      item.word,
    ]);
    checkAnswer(item.word);
  }

  function handleMouseOver() {
    setHovering(true);
  }
  function handleMouseOut() {
    setHovering(false);
  }

  const words = props.sentenceWord.sentence.split(" ");

  const replacedText = words.map((word) => {
    // remove full stops from end of words for comparisons
    const removedPunctuation =
      word.charAt(word.length - 1) === "." ? word.slice(0, -1) : word;

    if (removedPunctuation == props.sentenceWord.word) {
      word = (
        <span
          className={`empty-box 
          ${element && "filled-box"}
          ${props.check && isCorrect && "vocab-correct"}
          ${props.check && !isCorrect && "vocab-incorrect"}
          `}
          ref={drop}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={(e) => {
            element && setElement("");
            element && props.updateUsedWords(element);
          }}
        >
          {element && hovering ? "\u2716" : element}
        </span>
      );
      return word;
    } else return word + " ";
  });

  console.log("this is replaced text", replacedText);

  return (
    <div>
      <p>{replacedText}</p>
    </div>
  );
}
