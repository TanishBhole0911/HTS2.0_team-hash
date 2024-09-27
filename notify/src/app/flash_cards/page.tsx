"use client";
import "../styles/flashCard.css"; // Import the CSS file for styling
import React, { useState, useEffect } from "react";
import FlashCard from "../components/flashCard"; // Import the FlashCard component


export default function FlashCardPage() {
  const [flipCounts, setFlipCounts] = useState<number[]>([0, 0, 0]);
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [shouldFlipAll, setShouldFlipAll] = useState<boolean>(false);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [score, setScore] = useState<number | null>(null);
  const [s3BucketUrl, setS3BucketUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    setS3BucketUrl(process.env.S3_BUCKET_URL || null);
  }, []);

  const handleCardClick = (index: number) => {
    if (quizMode) return; // Do nothing in quiz mode
    setFlipCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      if (flippedCardIndex !== null && flippedCardIndex !== index) {
        newCounts[flippedCardIndex] += 1; // Flip back the previously flipped card
      }
      newCounts[index] += 1; // Flip the clicked card
      return newCounts;
    });
    setFlippedCardIndex(index === flippedCardIndex ? null : index);
  };

  const handleToggleMode = () => {
    setQuizMode(!quizMode);
    setShouldFlipAll(false); // Reset flip all state when mode changes
    setScore(null); // Reset score when mode changes
  };

  const handleSubmit = () => {
    setShouldFlipAll(true);
    let newScore = 0;
    cards.forEach((card, index) => {
      if (answers[index].toLowerCase() === card.answer.toLowerCase()) {
        newScore += 1;
      }
    });
    setScore(newScore);
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.currentTarget.play();
    setIsHovered(true);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.currentTarget.pause();
    setIsHovered(false);
  };

  const cards = [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is the boiling point of water?", answer: "100°C" },
  ];

  return (
    <>
      <div>
        <h1>FlashCard Example</h1>
        <button className="toggle-mode-button" onClick={handleToggleMode}>
          {quizMode ? "Notes" : "Quiz"}
        </button>
        <div className="flashcard-container">
          {cards.map((card, index) => (
            <FlashCard
              key={index}
              question={card.question}
              answer={card.answer}
              flipCount={
                shouldFlipAll ? flipCounts[index] + 1 : flipCounts[index]
              }
              onClick={() => handleCardClick(index)}
              quizMode={quizMode}
              userAnswer={answers[index]}
              onAnswerChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          ))}
        </div>
        {quizMode && (
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        )}
        {score !== null && (
          <div className="score-display">
            Score: {score}/{cards.length}
          </div>
        )}
        <div className="video">
          <video
            src={`https://raipur.s3.ap-south-1.amazonaws.com/Question.mp4`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            loop
            style={{ filter: isHovered ? "grayscale(100%)" : "none" }} // Apply filter based on hover state
          />
        </div>
      </div>
    </>
  );
}
