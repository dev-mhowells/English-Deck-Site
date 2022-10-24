import React from "react";
import { useDrag } from "react-dnd";

export default function Word(props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "word",
    item: { word: props.word },
  }));

  return <p ref={drag}>{props.word}</p>;
}
