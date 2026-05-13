"use client";
import { EditOutlined } from "@ant-design/icons";
import React from "react";
import { FaStickyNote } from "react-icons/fa";
import "../styles/NoteCard.css";
import "../styles/notes.css";
import { useRouter } from "next/navigation";

interface Note {
  note_title: string;
  page_number: number;
  content: string;
}

const NoteCard: React.FC<{ note: Note; selectedProject: string }> = ({ note, selectedProject }) => {
  const router = useRouter();

  return (
    <div
      className="note-card"
      onClick={() => router.push(`/editNotes/${selectedProject}/${note.note_title}/${note.page_number}`)}
    >
      <div className="note-card-top">
        <div className="note-card-icon">
          <FaStickyNote />
        </div>
        <EditOutlined
          className="note-card-edit"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/editNotes/${selectedProject}/${note.note_title}/${note.page_number}`);
          }}
        />
      </div>
      <h2>{note.note_title}</h2>
      <div className="note-card-footer">
        <span className="note-card-page">Page {note.page_number}</span>
      </div>
    </div>
  );
};

export default NoteCard;
