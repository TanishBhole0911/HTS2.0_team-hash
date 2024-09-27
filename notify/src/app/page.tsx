"use client";

import "./page.css"; // Import the CSS file for styling
import Hero from "./components/Hero";
import React, { useState } from "react";
import FlashCard from "./components/flashCard";
import { Floating } from "./components/FloatingComponent";
export default function Home() {
  const [flipCounts, setFlipCounts] = useState<number[]>([0, 0, 0]);
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
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

  const cards = [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is the boiling point of water?", answer: "100°C" },
  ];

  return (
    <>
      <div className="stack-container">
        <Hero />
      </div>
    </>
  );
}
