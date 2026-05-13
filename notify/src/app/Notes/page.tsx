"use client";
import React, { useState, useEffect, useCallback } from "react";
import "../styles/notes.css";
import NotesList from "../components/NotesList";
import Image from "next/image";
import openBook from "../assets/open-book.png";
import { Modal, Input, Popover } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExpandAltOutlined,
  MessageOutlined,
  ThunderboltOutlined,
  UserOutlined,
  SendOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import { setUser } from "../../features/User/user-slice";
import { useDispatch, useSelector } from "react-redux";
import MindMap from "../components/MindMap";
import FlashCard from "../components/flashCard";

type Note = {
  note_title: string;
  page_number: number;
  content: string;
};

type MindmapItem = {
  key: string;
  category: string;
  text: string;
};

type LinkData = {
  from: string;
  to: string;
  text: string;
};

function NotesPage() {
  const dispatch = useDispatch();
  const { projects, username } = useSelector((state: any) => state.user.user);

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectTitles, setProjectTitles] = useState<string[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [nodeDataArray, setNodeDataArray] = useState<MindmapItem[]>([]);
  const [linkDataArray, setLinkDataArray] = useState<LinkData[]>([]);

  // Modal states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isMindmapExpanded, setIsMindmapExpanded] = useState(false);
  const [mindmapLoading, setMindmapLoading] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ message: string; sender: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Popover states
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);

  const handleAddNotes = useCallback(async () => {
    if (!newNoteTitle) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/notes/save_note`, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          username,
          project_title: selectedProject,
          pages: [...notes, { note_title: newNoteTitle, page_number: notes.length + 1, content: "" }],
        }),
        redirect: "follow",
      });
      setNotes([...notes, { note_title: newNoteTitle, page_number: notes.length + 1, content: "" }]);
    } catch (e) { console.error(e); }
    setNewNoteTitle("");
    setAddNoteOpen(false);
  }, [newNoteTitle, notes, username, selectedProject]);

  const handleAddProject = useCallback(async () => {
    if (!newProjectTitle) return;
    setProjectTitles([...projectTitles, newProjectTitle]);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/notes/save_note`, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ username, project_title: newProjectTitle, pages: [] }),
        redirect: "follow",
      });
    } catch (e) { console.error(e); }
    setNewProjectTitle("");
    setAddProjectOpen(false);
  }, [newProjectTitle, projectTitles, username]);

  const fetchNotes = useCallback(async () => {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/get_notes`, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ username, project_title: selectedProject }),
        redirect: "follow",
      });
      const data = await r.json();
      setNotes(Object.values(data.pages) as any);
    } catch (e) { console.error(e); }
  }, [selectedProject, username]);

  const fetchMindMapData = useCallback(async (refresh = false) => {
    setMindmapLoading(true);
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/mindmap`, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ username, project_title: selectedProject, refresh }),
        redirect: "follow",
      });
      if (!r.ok) throw new Error();
      const data = await r.json();
      setNodeDataArray(data.data.nodeDataArray);
      setLinkDataArray(data.data.linkDataArray);
    } catch {
      setNodeDataArray([]);
      setLinkDataArray([]);
    } finally {
      setMindmapLoading(false);
    }
  }, [username, selectedProject]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || chatLoading) return;
    const msg = newMessage;
    setNewMessage("");
    setChatMessages((prev) => [...prev, { message: msg, sender: "user" }]);
    setChatLoading(true);
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/chatbot`, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ username, project_title: selectedProject, message: msg }),
        redirect: "follow",
      });
      const data = await r.json();
      setChatMessages((prev) => [...prev, { message: data.response, sender: "bot" }]);
    } catch (e) { console.error(e); }
    finally { setChatLoading(false); }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/get_user/${username}`);
      const data = await res.json();
      dispatch(setUser(data));
    };
    fetchUser();
  }, [dispatch, username]);

  useEffect(() => {
    setProjectTitles(Object.keys(projects));
    if (Object.keys(projects).length > 0) setSelectedProject(Object.keys(projects)[0]);
  }, [projects]);

  useEffect(() => {
    if (selectedProject) {
      fetchNotes();
      fetchMindMapData(false);
    }
  }, [selectedProject, fetchNotes, fetchMindMapData]);

  const addProjectPopover = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 220 }}>
      <Input autoFocus value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)}
        onPressEnter={handleAddProject} placeholder="Project name..." />
      <button className="btn-primary" onClick={handleAddProject}>Create Project</button>
    </div>
  );

  const addNotePopover = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 220 }}>
      <Input autoFocus value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)}
        onPressEnter={handleAddNotes} placeholder="Note title..." />
      <button className="btn-primary" onClick={handleAddNotes}>Create Note</button>
    </div>
  );

  const hasMindmap = nodeDataArray.length > 0 && linkDataArray.length > 0;

  return (
    <div className="notes-page">
      {/* ── Sidebar ── */}
      <div className="notes-panel">
        <div className="notes-panel-logo">
          <Image width={32} height={32} src={openBook} alt="Notify" />
          <span>Notify</span>
        </div>
        <div className="notes-panel-content">
          <div className="sidebar-section-label">Projects</div>
          <Popover content={addProjectPopover} title="New Project" trigger="click"
            open={addProjectOpen} onOpenChange={setAddProjectOpen}>
            <button className="sidebar-new-project-btn">
              <PlusOutlined style={{ fontSize: 12 }} /> New Project
            </button>
          </Popover>
          {projectTitles.length === 0 ? (
            <div className="sidebar-empty">No projects yet</div>
          ) : (
            projectTitles.map((project, i) => (
              <div key={i} className="note-item-container">
                <div className={`note-item ${selectedProject === project ? "active" : ""}`}
                  onClick={() => setSelectedProject(project)}>
                  <span className="project-dot" />
                  <span className="project-name">{project}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Main ── */}
      <div className="notes-content">
        {/* Top bar */}
        <div className="notes-top-bar">
          <div className="search-container">
            <Input.Search placeholder="Search notes..." size="middle"
              onSearch={(v) => console.log(v)}
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />} />
          </div>
          <div className="top-bar-actions">
            {selectedProject && (
              <Popover content={addNotePopover} title="New Note" trigger="click"
                open={addNoteOpen} onOpenChange={setAddNoteOpen}>
                <button className="btn-primary">
                  <PlusOutlined /> New Note
                </button>
              </Popover>
            )}
          </div>
        </div>

        {/* Notes + Mindmap */}
        <div className="notes-main-container">
          {/* Notes area */}
          <div className="notes-main">
            <div className="notes-main-header">
              {selectedProject ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <h1>{selectedProject}</h1>
                  <span className="note-count">{notes.length} note{notes.length !== 1 ? "s" : ""}</span>
                </div>
              ) : (
                <h1>Select a project</h1>
              )}
            </div>
            {notes.length > 0 ? (
              <div className="notes-grid">
                <NotesList notes={notes} selectedProject={selectedProject || ""} />
              </div>
            ) : (
              <div className="notes-empty">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>{selectedProject ? "No notes yet — create your first one" : "No projects, create one"}</p>
              </div>
            )}
          </div>

          {/* Mindmap panel */}
          <div className="mindmap-panel">
            <div className="mindmap-panel-header">
              <h3>Mind Map</h3>
              <div className="mindmap-panel-actions">
                {/* Flashcards */}
                <button
                  className="mm-action-btn"
                  title="Flashcards"
                  onClick={() => setIsFlashcardsOpen(true)}
                  disabled={!selectedProject}
                >
                  <ThunderboltOutlined />
                  <span>Cards</span>
                </button>

                {/* Chat */}
                <button
                  className="mm-action-btn"
                  title="Ask AI"
                  onClick={() => setIsChatOpen(true)}
                  disabled={!selectedProject}
                >
                  <MessageOutlined />
                  <span>Chat</span>
                </button>

                {/* Refresh */}
                <button className="mm-icon-btn" title="Regenerate mind map"
                  onClick={() => fetchMindMapData(true)} disabled={!selectedProject}>
                  <ReloadOutlined />
                </button>

                {/* Expand */}
                <button className="mm-icon-btn" title="Expand mind map"
                  onClick={() => setIsMindmapExpanded(true)} disabled={!hasMindmap}>
                  <ExpandAltOutlined />
                </button>
              </div>
            </div>

            <div className="mindmap-panel-body">
              {mindmapLoading ? (
                <div className="mindmap-loading">
                  <div className="mindmap-loading-graph">
                    <div className="mm-node mm-node-1" />
                    <div className="mm-node mm-node-2" />
                    <div className="mm-node mm-node-3" />
                    <div className="mm-node mm-node-4" />
                    <svg className="mm-edges" viewBox="0 0 160 120">
                      <line x1="80" y1="20" x2="30"  y2="80" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="4 3" />
                      <line x1="80" y1="20" x2="80"  y2="80" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="4 3" />
                      <line x1="80" y1="20" x2="130" y2="80" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="4 3" />
                    </svg>
                  </div>
                  <p className="mindmap-loading-text">Generating mind map…</p>
                  <span className="mindmap-loading-sub">This may take a few seconds</span>
                </div>
              ) : hasMindmap ? (
                <MindMap nodeDataArray={nodeDataArray} linkDataArray={linkDataArray} height={420} />
              ) : (
                <div className="mindmap-empty">
                  <NodeIndexOutlined style={{ fontSize: 36, color: "#d1d5db" }} />
                  <p>No mind map yet.<br />Click refresh to generate one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Expanded Mindmap Modal ── */}
      <Modal
        title={<span style={{ fontSize: 15, fontWeight: 700 }}>Mind Map — {selectedProject}</span>}
        open={isMindmapExpanded}
        onCancel={() => setIsMindmapExpanded(false)}
        footer={null}
        width="90vw"
        centered
        styles={{ body: { padding: 0, borderRadius: "0 0 12px 12px", overflow: "hidden" } }}
      >
        {hasMindmap && (
          <MindMap nodeDataArray={nodeDataArray} linkDataArray={linkDataArray} height={620} />
        )}
      </Modal>

      {/* ── Flashcards Modal ── */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThunderboltOutlined style={{ color: "#6366f1" }} />
            <span style={{ fontSize: 15, fontWeight: 700 }}>Flashcards — {selectedProject}</span>
          </div>
        }
        open={isFlashcardsOpen}
        onCancel={() => setIsFlashcardsOpen(false)}
        footer={null}
        width={820}
        centered
      >
        <FlashCard projectTitle={selectedProject || ""} />
      </Modal>

      {/* ── Chat Modal ── */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MessageOutlined style={{ color: "#6366f1" }} />
            <span style={{ fontSize: 15, fontWeight: 700 }}>Ask AI about your notes</span>
          </div>
        }
        open={isChatOpen}
        onCancel={() => setIsChatOpen(false)}
        footer={null}
        width={560}
        centered
      >
        <div className="chat-container">
          <div className="chat-messages">
            {chatMessages.length === 0 && (
              <div style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: "24px 0" }}>
                Ask anything about <strong>{selectedProject}</strong>…
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                {msg.sender === "bot" ? (
                  <Image width={24} height={24} src={openBook} alt="AI" style={{ flexShrink: 0 }} />
                ) : (
                  <UserOutlined style={{ fontSize: 18, flexShrink: 0 }} />
                )}
                <span>{msg.message}</span>
              </div>
            ))}
            {chatLoading && (
              <div className="chat-message bot">
                <Image width={24} height={24} src={openBook} alt="AI" />
                <span className="chat-typing">
                  <span /><span /><span />
                </span>
              </div>
            )}
          </div>
          <div className="chat-input-row">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={handleSendMessage}
              placeholder="Ask about your notes…"
              disabled={chatLoading}
            />
            <button className="btn-primary chat-send-btn" onClick={handleSendMessage} disabled={chatLoading || !newMessage.trim()}>
              <SendOutlined />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NotesPage;
