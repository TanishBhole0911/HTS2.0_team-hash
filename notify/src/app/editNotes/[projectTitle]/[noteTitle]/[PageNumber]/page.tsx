"use client";
import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import "../../../../styles/editNotes.css";
import { message } from "antd";

export default function EditNotes() {
  const router = useRouter();
  const { projectTitle, noteTitle, PageNumber } = useParams();
  const cachedUsername = useSelector((state: any) => state.user.user.username);

  const [editorContent, setEditorContent] = useState<string>("");
  const [noteTitleState, setNoteTitleState] = useState<string>(
    Array.isArray(noteTitle)
      ? decodeURIComponent(noteTitle[0])
      : decodeURIComponent(noteTitle as string)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const decodedProject = decodeURIComponent(projectTitle as string);
  const decodedNote = decodeURIComponent(noteTitle as string);

  useEffect(() => {
    const myHeaders = new Headers({ "Content-Type": "application/json" });
    fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/get_notes`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ username: cachedUsername, project_title: decodedProject }),
      redirect: "follow",
    })
      .then((r) => r.json())
      .then((data) => {
        const note = data.pages.find(
          (p: any) =>
            p.note_title === decodedNote &&
            p.page_number === parseInt(PageNumber as string)
        );
        if (note) setEditorContent(note.content);
      })
      .catch(console.error);
  }, [cachedUsername, decodedProject, decodedNote, PageNumber]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/notes/save_note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cachedUsername,
          project_title: decodedProject,
          pages: [
            {
              note_title: decodedNote,
              page_number: parseInt(PageNumber as string),
              content: editorContent,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      message.success("Note saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      message.error("Failed to save");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-notes-container" data-color-mode="light">
      {/* ── Top bar ── */}
      <div className="edit-notes-topbar">
        <button className="edit-notes-back-btn" onClick={() => router.push("/Notes")}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <div className="topbar-divider" />

        <div className="edit-notes-breadcrumb">
          <span className="crumb">{decodedProject}</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{noteTitleState}</span>
        </div>

        <div className="topbar-spacer" />

        <button
          className={`edit-notes-save-btn ${saved ? "saved" : ""}`}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saved ? (
            <>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Saved
            </>
          ) : (
            <>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {saving ? "Saving…" : "Save"}
            </>
          )}
        </button>
      </div>

      {/* ── Body ── */}
      <form className="edit-notes-body" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="edit-notes-title-wrapper">
          <label className="edit-notes-title-label">Note Title</label>
          <input
            className="edit-notes-title-input"
            type="text"
            value={noteTitleState}
            onChange={(e) => setNoteTitleState(e.target.value)}
            placeholder="Untitled note..."
            required
          />
        </div>

        {/* Editor */}
        <div className="edit-notes-editor-card">
          <MDEditor
            value={editorContent}
            onChange={(v) => setEditorContent(v || "")}
            height={560}
            preview="live"
          />
        </div>

        {/* Footer meta */}
        <div className="edit-notes-meta">
          <span className="meta-chip">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Page {PageNumber}
          </span>
          <span className="meta-chip">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {editorContent.split(/\s+/).filter(Boolean).length} words
          </span>
          <span className="meta-chip">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {Math.max(1, Math.ceil(editorContent.split(/\s+/).filter(Boolean).length / 200))} min read
          </span>
        </div>
      </form>
    </div>
  );
}
