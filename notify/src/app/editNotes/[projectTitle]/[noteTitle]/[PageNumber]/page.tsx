"use client";
import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation"; // Import useParams
import "../../../../styles/editNotes.css";
import { Button } from "antd"; // Import Button from antd
import { message } from "antd"; // Import message from antd
import { Resizable } from "re-resizable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const helpCommand = {
  name: "help",
  keyCommand: "help",
  buttonProps: { "aria-label": "Insert help" },
  icon: (
    <span title="Help">
      <FontAwesomeIcon icon={faQuestionCircle} />
    </span>
  ),
  execute: (state: any, api: any) => {
    // Open a help modal or link to documentation
    window.open("https://www.markdownguide.org/basic-syntax/", "_blank");
  },
};
export default function EditNotes() {
  const { projectTitle, noteTitle, PageNumber } = useParams(); // Get projectTitle and noteTitle from params
  // Use useSelector to get values from Redux store
  const cachedUsername = useSelector((state: any) => state.user.user.username);

  // Initialize state without default values
  const [editorContent, setEditorContent] = useState<string>("");
  const [noteTitleState, setNoteTitleState] = useState<string>(
    Array.isArray(decodeURIComponent(noteTitle as string))
      ? decodeURIComponent(noteTitle as string)[0]
      : decodeURIComponent(noteTitle as string),
  );
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const decodedProjectTitle = decodeURIComponent(projectTitle as string);
    const decodedNoteTitle = decodeURIComponent(noteTitle as string);
    const raw = JSON.stringify({
      username: cachedUsername,
      project_title: decodedProjectTitle,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/get_notes`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const parsedResult = JSON.parse(result);
        const correctNote = parsedResult.pages.find(
          (page: any) =>
            page.note_title === decodedNoteTitle &&
            page.page_number === parseInt(PageNumber as string),
        );
        if (correctNote) {
          setEditorContent(correctNote.content);
          console.log(correctNote.content);
        } else {
          console.error("Note not found");
        }
      })
      .catch((error) => console.error(error));
  }, [cachedUsername, projectTitle, noteTitle, PageNumber]);
  useEffect(() => {
    // Ensure username is available
    if (!cachedUsername) {
      console.error("Username is missing in the Redux store");
    }
    // Ensure project title is available
    if (!projectTitle) {
      console.error("Project title is missing in the params");
    }
  }, [cachedUsername, projectTitle]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(editorContent);

    try {
      const decodedProjectTitle = decodeURIComponent(projectTitle as string);
      const decodedNoteTitle = decodeURIComponent(noteTitle as string);
      const noteSaveRequest = {
        username: cachedUsername,
        project_title: decodedProjectTitle,
        pages: [
          {
            note_title: decodedNoteTitle,
            page_number: parseInt(PageNumber as string),
            content: editorContent,
          },
        ],
      };

      const saveResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_FETCH_API}/notes/save_note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteSaveRequest),
        },
      );
      if (!saveResponse.ok) {
        throw new Error(`Failed to save content: ${saveResponse.statusText}`);
      }
      message.success("Note saved successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="edit-notes-container" data-color-mode="light">
        <form onSubmit={handleSubmit} className="edit-notes-form">
          <div className="edit-notes-title">
            <label className="edit-notes-title-label">Note Title</label>
            <input
              className="edit-notes-title-input"
              type="text"
              value={noteTitleState}
              onChange={(e) => setNoteTitleState(e.target.value)}
              required
            />
          </div>
          <MDEditor
            value={editorContent}
            onChange={(value) => setEditorContent(value || "")}
            height={800}
            preview="live"
          />
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "1.5rem" }}
          >
            Save Content
          </Button>
        </form>
      </div>
    </>
  );
}
