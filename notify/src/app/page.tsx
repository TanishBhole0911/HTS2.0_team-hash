"use client";

import "./page.css"; // Import the CSS file for styling
import Hero from "./components/Hero";
import React, { useState } from "react";
import { Floating } from "./components/FloatingComponent";
export default function Home() {
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
