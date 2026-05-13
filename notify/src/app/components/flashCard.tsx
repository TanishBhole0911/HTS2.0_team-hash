"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/flashCard.css";

interface FlashCardProps {
  projectTitle: string;
}

interface FlashCardData {
  question: string;
  answer: string;
  flipped: boolean;
}

const FlashCard: React.FC<FlashCardProps> = ({ projectTitle }) => {
  const username = useSelector((state: any) => state.user.user.username);
  const [flashCards, setFlashCards] = useState<FlashCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectTitle) return;
    setLoading(true);
    setError(null);

    fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/flashcards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, project_title: projectTitle }),
    })
      .then((r) => r.json())
      .then((data) => {
        const cards = (data.data || []).map((card: FlashCardData) => ({
          ...card,
          flipped: false,
        }));
        setFlashCards(cards);
      })
      .catch(() => setError("Failed to load flashcards."))
      .finally(() => setLoading(false));
  }, [projectTitle, username]);

  const handleCardClick = (index: number) => {
    setFlashCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, flipped: !card.flipped } : card))
    );
  };

  if (loading) {
    return (
      <div className="fc-state">
        <div className="fc-spinner" />
        <p>Generating flashcards…</p>
      </div>
    );
  }

  if (error) {
    return <div className="fc-state fc-error">{error}</div>;
  }

  if (flashCards.length === 0) {
    return (
      <div className="fc-state">
        <p>No flashcards available for this project.</p>
      </div>
    );
  }

  return (
    <div className="fc-container">
      <p className="fc-hint">Click a card to reveal the answer</p>
      <div className="fc-grid">
        {flashCards.map((card, index) => (
          <div
            key={index}
            className={`fc-card ${card.flipped ? "fc-card--flipped" : ""}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="fc-card-inner">
              <div className="fc-card-front">
                <div className="fc-card-label">Question</div>
                <p>{card.question}</p>
              </div>
              <div className="fc-card-back">
                <div className="fc-card-label">Answer</div>
                <p>{card.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashCard;
