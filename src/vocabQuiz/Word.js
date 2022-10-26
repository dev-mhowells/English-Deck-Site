import React from "react";
import { useDrag } from "react-dnd";

export default function Word(props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "word",
    item: {
      word: props.word,
      id: props.id,
    },
  }));

  return (
    <p ref={drag} style={{ opacity: props.isDropped ? 0.5 : 1 }}>
      {props.word}
    </p>
  );
}
