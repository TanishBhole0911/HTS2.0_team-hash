// components/NoteCard.tsx
import { EditOutlined } from "@ant-design/icons";
import React from "react";
import { FaStickyNote } from "react-icons/fa";
import classNames from "classnames";
import "../styles/NoteCard.css";
import { useRouter } from "next/navigation";
interface Note {
  note_title: string;
  page_number: number;
  content: string;
}

const NoteCard: React.FC<{ note: Note }> = ({ note }) => {
  const router = useRouter();
  return (
    <div className={classNames("note-card", "p-4", "shadow-lg", "rounded-lg", "bg-white", "hover:shadow-xl", "transition-shadow", "duration-300")}>
      <div className="flex items-center mb-2">
        <FaStickyNote className="text-yellow-500 mr-2" />
        <h2 className="text-xl font-semibold">{note.note_title}</h2>
        <EditOutlined className="ml-auto" onClick={() => router.push(`/notes/${note.page_number}`)} />
      </div>
    </div>
  );
};

export default NoteCard;
