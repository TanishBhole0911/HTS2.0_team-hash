import React from "react";
import "../styles/SidePanel.css";
import MindMap from "./MindMap";
import FlashCard from "../flash_cards/page"; // Import the FlashCard component

interface MindmapItem {
  id: string;
  title: string;
  description: string;
  type: string; // Add a type field to differentiate node types
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface SidePanelProps {
  isOpen: boolean;
  mindmap: MindmapItem[];
  flashcards: Flashcard[];
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  mindmap,
  flashcards,
}) => {
  return (
    <div className={`side-panel ${isOpen ? "open" : "closed"}`}>
      <div className="panel-content">
        <h2>Mind Maps</h2>
        <MindMap mindmap={mindmap} />
        <div className="flashcards-section">
          <h2>Flashcards</h2>
          {flashcards.map((card) => (
            <FlashCard
              key={card.id}
              question={card.question}
              answer={card.answer}
              flipCount={0} // Initialize flipCount to 0
              onClick={() => { }} // No-op for now
              quizMode={false} // Set quizMode to false for now
              userAnswer=""
              onAnswerChange={() => { }} // No-op for now
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
