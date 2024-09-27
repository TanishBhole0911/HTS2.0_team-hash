"use client";
import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import TurndownService from "turndown";
import { useSelector } from "react-redux";

export default function App() {
  // Use useSelector to get values from Redux store
  const cachedUsername = useSelector((state: any) => state.user.user.username);
  const projects = useSelector((state: any) => state.user.user.projects);

  // Log the projects to check their structure
  console.log("Projects from Redux store:", projects);

  // Access the project directly from the object
  const cachedProjectTitle = "TestProject";
  const cachedProject = projects[cachedProjectTitle];

  // Log the cached project to check its structure
  console.log("Cached Project:", cachedProject);

  // Initialize state without default values
  const [editorContent, setEditorContent] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");

  useEffect(() => {
    // Ensure username is available
    if (!cachedUsername) {
      console.error("Username is missing in the Redux store");
    }
    // Ensure project is available
    if (!cachedProject) {
      console.error("Project is missing in the Redux store");
    }
  }, [cachedUsername, cachedProject]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(editorContent);

    console.log("HTML Content:", editorContent);
    console.log("Markdown Content:", markdownContent);

    try {
      if (!cachedProject) {
        throw new Error("Project is missing in the Redux store");
      }

      // Calculate the next page number based on the number of existing pages
      const currentPageNumber = cachedProject.length + 1;

      const noteSaveRequest = {
        username: cachedUsername,
        project_title: cachedProjectTitle,
        pages: [
          {
            note_title: noteTitle,
            page_number: currentPageNumber,
            content: markdownContent,
          },
        ],
      };

      console.log("Note Save Request:", noteSaveRequest);

      const saveResponse = await fetch(
        "http://localhost:8000/notes/save_note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteSaveRequest),
        }
      );
      if (!saveResponse.ok) {
        throw new Error(`Failed to save content: ${saveResponse.statusText}`);
      }
      console.log("Content saved successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Note Title:
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
          />
        </label>
      </div>
      <Editor
        apiKey="ydnb0b1pgkxfx9x7tyvm51ji8qqs1fqmny2r8gjpjj40hoj3"
        init={{
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "checklist",
            "mediaembed",
            "casechange",
            "export",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "editimage",
            "advtemplate",
            "ai",
            "mentions",
            "tinycomments",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "typography",
            "inlinecss",
            "markdown",
            "linkchecker",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          ai_request: (request: any, respondWith: any) =>
            respondWith.string(() =>
              Promise.reject("See docs to implement AI Assistant")
            ),
        }}
        initialValue="Welcome to TinyMCE!"
        onEditorChange={handleEditorChange}
      />
      <button type="submit">Save Content</button>
    </form>
  );
}
