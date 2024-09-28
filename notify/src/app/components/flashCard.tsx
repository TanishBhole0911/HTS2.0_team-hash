import React, { useEffect, useState } from "react";
import "../styles/flashCard.css"; // Import the CSS file for styling

interface FlashCardProps {
  projectTitle: string;
}

interface FlashCardData {
  question: string;
  answer: string;
  flipped: boolean; // Add flipped property
}

const FlashCard: React.FC<FlashCardProps> = ({ projectTitle }) => {
  const [flashCards, setFlashCards] = useState<FlashCardData[]>([]);

  useEffect(() => {
    const fetchFlashCards = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "jayesh1",
            project_title: projectTitle,
          }),
        });
        const data = await response.json();
        // Initialize flipped property to false for each card
        const initializedData = data.data.map((card: FlashCardData) => ({
          ...card,
          flipped: false,
        }));
        setFlashCards(initializedData);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    fetchFlashCards();
  }, [projectTitle]);

  const handleCardClick = (index: number) => {
    setFlashCards((prevCards) =>
      prevCards.map((card, i) =>
        i === index ? { ...card, flipped: !card.flipped } : card
      )
    );
  };

  return (
    <div className="flash-card-container">
      {flashCards.map((flashCard, index) => (
        <div
          key={index}
          className="flash-card"
          onClick={() => handleCardClick(index)}
        >
          <div
            className="flash-card-inner"
            style={{ transform: `rotateY(${flashCard.flipped ? 180 : 0}deg)` }}
          >
            <div className="flash-card-front">
              <p>{flashCard.question}</p>
            </div>
            <div className="flash-card-back">
              <p>{flashCard.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashCard;
