"use client";
import React, { useState, useEffect, useCallback } from "react";
import "../styles/notes.css";
import NotesList from "../components/NotesList";
import Icon, { BookOutlined, UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import openBook from "../assets/open-book.png";
import { Popover, Button, FloatButton, Modal, Input } from "antd";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Tooltip, IconButton } from "@mui/material";
import { setUser } from "../../features/User/user-slice";
import { useDispatch, useSelector } from "react-redux";
import { PlusSquareOutlined } from "@ant-design/icons";
import MindMap from "../components/MindMap"; // Import the MindMap component

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
  const [newProjectTitle, setNewProjectTitle] = useState<string>("");
  const [newNoteTitle, setNewNoteTitle] = useState<string>("");
  const [newNoteContent, setNewNoteContent] = useState<string>("");
  const [nodeDataArray, setNodeDataArray] = useState<MindmapItem[]>([]);
  const [linkDataArray, setLinkDataArray] = useState<LinkData[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ message: string, sender: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleAddNotes = useCallback(async () => {
    if (newNoteTitle) {
      console.log(notes);
      const myHeaders = new Headers({ "Content-Type": "application/json" });
      const raw = JSON.stringify({
        username,
        project_title: selectedProject,
        pages: [
          ...notes,
          {
            note_title: newNoteTitle,
            page_number: notes.length + 1,
            content: "",
          },
        ],
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect,
      };
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_FETCH_API}/notes/save_note`,
          requestOptions
        );
        const data = await response.json();
        console.log(data);
        setNotes([
          ...notes,
          {
            note_title: newNoteTitle,
            page_number: notes.length + 1,
            content: "",
          },
        ]);
      } catch (error) {
        console.log("error", error);
      }
      setNewNoteTitle("");
      setNewNoteContent("");
    }
  }, [newNoteTitle, newNoteContent, username, selectedProject]);

  const handleAddProject = useCallback(async () => {
    if (newProjectTitle) {
      setProjectTitles([...projectTitles, newProjectTitle]);
      const myHeaders = new Headers({ "Content-Type": "application/json" });
      const raw = JSON.stringify({
        username,
        project_title: newProjectTitle,
        pages: [],
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect,
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_FETCH_API}/notes/save_note`,
          requestOptions
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log("error", error);
      }
      setNewProjectTitle("");
    }
  }, [newProjectTitle, projectTitles, username]);

  const popoverContentNote = (
    <div>
      <Input
        value={newNoteTitle}
        onChange={(e) => setNewNoteTitle(e.target.value)}
        placeholder="Enter note title"
      />
      <Button type="primary" onClick={handleAddNotes} style={{ marginTop: 8 }}>
        Add Note
      </Button>
    </div>
  );

  const popoverContent = (
    <div>
      <Input
        value={newProjectTitle}
        onChange={(e) => setNewProjectTitle(e.target.value)}
        placeholder="Enter project title"
      />
      <Button
        type="primary"
        onClick={handleAddProject}
        style={{ marginTop: 8 }}
      >
        Add Project
      </Button>
    </div>
  );

  const fetchNotes = useCallback(async () => {
    const myHeaders = new Headers({ "Content-Type": "application/json" });
    const raw = JSON.stringify({ username, project_title: selectedProject });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_FETCH_API}/get_notes`,
        requestOptions
      );
      const data = await response.json();
      const pagesArray = Object.values(data.pages) as any;
      setNotes(pagesArray);
      console.log(pagesArray);
    } catch (error) {
      console.log("error", error);
    }
  }, [selectedProject, username]);

  const fetchMindMapData = useCallback(async () => {
    const myHeaders = new Headers({ "Content-Type": "application/json" });
    const raw = JSON.stringify({
      username,
      project_title: selectedProject,
      refresh: false,
    });
    console.log(username, selectedProject);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_FETCH_API}/mindmap`,
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      setNodeDataArray(data.data.nodeDataArray);
      setLinkDataArray(data.data.linkDataArray);
    } catch (error) {
      console.log("error", error);
    }
  }, [username, selectedProject]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const myHeaders = new Headers({ "Content-Type": "application/json" });
      const raw = JSON.stringify({ username, project_title: selectedProject, message: newMessage });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect,
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_FETCH_API}/chatbot`,
          requestOptions
        );
        const data = await response.json();
        setChatMessages([...chatMessages, { message: newMessage, sender: "user" }, { message: data.response, sender: "bot" }]);
        setNewMessage("");
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetch(
        `${process.env.NEXT_PUBLIC_API_FETCH_API}/get_user/${username}`
      );
      const data = await userData.json();
      console.log(data);
      dispatch(setUser(data));
    };
    fetchUser();
  }, [dispatch, username]);

  useEffect(() => {
    setProjectTitles(Object.keys(projects));
    if (Object.keys(projects).length > 0) {
      setSelectedProject(Object.keys(projects)[0]);
    }
  }, [projects]);

  useEffect(() => {
    if (selectedProject) {
      fetchNotes();
      fetchMindMapData();
    }
  }, [selectedProject, fetchNotes, fetchMindMapData]);

  useEffect(() => {
    const reloadCSS = () => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          link.setAttribute('href', href.split('?')[0] + '?' + new Date().getTime());
        }
      });
    };
    reloadCSS();
  }, []);

  return (
    <div className="notes-page">
      <div className="notes-panel">
        <div className="notes-panel-logo">
          <Image width={50} height={50} src={openBook} alt="Open Book" />
        </div>
        <div className="notes-panel-content">
          <div className="note-item-container">
            <Popover
              content={popoverContent}
              title="Add New Note"
              trigger="click"
            >
              <PlusCircleOutlined
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  marginRight: "auto",
                  marginLeft: "auto",
                }}
              />
            </Popover>
          </div>
          {projectTitles.map((project, index) => (
            <div key={index} className="note-item-container">
              <div className="note-item">
                <div className="note-title">
                  <Tooltip title={project}>
                    <IconButton onClick={() => setSelectedProject(project)}>
                      <BookOutlined />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="notes-content">
        <div className="notes-top-bar">
          <div className="search-container">
            <Input.Search
              id="search-bar"
              className="custom-search-bar"
              placeholder="Search notes..."
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={(value) => console.log(value)}
            />
          </div>
        </div>
        <div className="notes-main-container">
          <div className="notes-main">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h1>{selectedProject}'s Notes</h1>
              <Popover
                content={popoverContentNote}
                title="Add New Note"
                trigger="click"
              >
                <PlusSquareOutlined
                  style={{
                    fontSize: "20px",
                    cursor: "pointer",
                    marginRight: "30px",
                  }}
                />
              </Popover>
            </div>
            <div className="notes-list">
              {notes.length > 0 ? (
                <NotesList notes={notes} selectedProject={selectedProject || ""} />
              ) : (
                <div>No notes available</div>
              )}
            </div>

          </div>
          <MindMap
            nodeDataArray={nodeDataArray}
            linkDataArray={linkDataArray}
          />
          <FloatButton
            icon={<PlusCircleOutlined />}
            type="primary"
            style={{ right: 24, bottom: 24 }}
            onClick={() => setIsChatOpen(true)}
          />
          <Modal
            title="Chat with Chatbot"
            visible={isChatOpen}
            onCancel={() => setIsChatOpen(false)}
            footer={null}
            width={600}
          >
            <div className="chat-container">
              <div className="chat-messages" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender}`} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    {msg.sender === "bot" ? (
                      <>
                        <Image width={30} height={30} src={openBook} alt="AI Response" />
                        <span style={{ marginLeft: 8 }}>{msg.message}</span>
                      </>
                    ) : (
                      <>
                        <UserOutlined style={{ fontSize: '24px' }} />
                        <span style={{ marginLeft: 8 }}>{msg.message}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onPressEnter={handleSendMessage}
                placeholder="Type your message..."
              />
              <Button type="primary" onClick={handleSendMessage} style={{ marginTop: 8 }}>
                Send
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default NotesPage;
