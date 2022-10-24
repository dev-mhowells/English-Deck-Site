import React from "react";
import QuestionAnswer from "./QuestionAnswer";
import { v4 as uuidv4 } from "uuid";

export default function Quiz(props) {
  // -------------------------- ---------------------------

  // initialise with quiz, prevents problems with rendering
  const [quiz, setQuiz] = React.useState(props.article.quiz);

  // randomises order of quiz articles on initial render only
  // in useEffect because placed elsewhere will randomise answer order on every state chenge in component
  React.useEffect(() => {
    function randomiseAnswerOrder() {
      const randomised = props.article.quiz.map((quiz) => {
        let randomOrder = quiz.answers.sort((a, b) => 0.5 - Math.random());
        return {
          ...quiz,
          answers: randomOrder,
        };
      });
      setQuiz(randomised);
    }
    randomiseAnswerOrder();
  }, []);

  //-----------------------------------------------------------------------

  // questionSet is the index of quiz.map, and serves as an ID for each QuestionAns component
  // i serves as an ID for each object in quiz array
  // selected is only modified onClick if QuestionAns component ID matches the object ID
  // necessary because otherwise onClick will modify select for all objects in quiz array at once
  // if 'choseCorrectly' is a property of any quiz object, it means check answers has been clicked
  // therefore should not be able to select any more answers until quiz is reset
  function selectA(e, questionSet) {
    !quiz[0].hasOwnProperty("choseCorrectly") &&
      setQuiz((prevQuiz) =>
        prevQuiz.map((questionAnswer, i) => {
          if (i === questionSet) {
            return {
              ...questionAnswer,
              selected: e.target.outerText,
            };
          } else {
            return questionAnswer;
          }
        })
      );
  }

  // adds a chose correctly property to each quiz object with value of true or false
  // depending on whether the selected property matches the correct property
  function checkAnswers() {
    setQuiz((prevQuiz) =>
      prevQuiz.map((questionAnswer) => ({
        ...questionAnswer,
        choseCorrectly:
          questionAnswer.correct === questionAnswer.selected ? true : false,
      }))
    );
  }

  // removes selected and choseCorrectly properties of quiz, therefore resetting its display
  function resetQuiz() {
    setQuiz((prevQuiz) =>
      prevQuiz.map(({ selected, choseCorrectly, ...rest }) => {
        return rest;
      })
    );
  }

  const quizDisplay = quiz.map((qa, questionSet) => (
    <QuestionAnswer
      qaObject={qa}
      question={qa.question}
      answers={qa.answers}
      selectA={selectA}
      questionSet={questionSet}
      key={uuidv4()}
    />
  ));

  return (
    <div className="quiz-app-container">
      <div className="quiz-container">{quizDisplay}</div>
      <button
        className={` check-btn`}
        onClick={
          quiz[0] && quiz[0].hasOwnProperty("choseCorrectly")
            ? resetQuiz
            : checkAnswers
        }
      >
        {quiz[0] && quiz[0].hasOwnProperty("choseCorrectly")
          ? "reset"
          : "check"}
      </button>
    </div>
  );
}
