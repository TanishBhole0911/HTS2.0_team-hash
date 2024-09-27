import React from "react";
import "../styles/flashCard.css"; // Import the CSS file for styling

interface FlashCardProps {
  question: string;
  answer: string;
  flipCount: number;
  onClick: () => void;
  quizMode: boolean;
  userAnswer: string;
  onAnswerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({
  question,
  answer,
  flipCount,
  onClick,
  quizMode,
  userAnswer,
  onAnswerChange,
}) => {
  return (
    <div className="flash-card" onClick={onClick}>
      <div
        className="flash-card-inner"
        style={{ transform: `rotateY(${flipCount % 2 === 0 ? 0 : 180}deg)` }}
      >
        <div className="flash-card-front">
          <p>{question}</p>
        </div>
        <div className="flash-card-back">
          {quizMode ? (
            <input
              type="text"
              value={userAnswer}
              onChange={onAnswerChange}
              className="answer-textarea"
            />
          ) : (
            <p>{answer}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
