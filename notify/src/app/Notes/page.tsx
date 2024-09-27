"use client";

import React, { useState, useEffect } from "react";
import "../styles/notes.css"; // Import the general CSS file for NotesPage
import NotesList from "../components/NotesList"; // Import the NotesList component
import Icon, { BookOutlined } from "@ant-design/icons";
import Image from 'next/image';
import openBook from "../assets/open-book.png";
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Tooltip, IconButton } from "@mui/material";
function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectTitles, setProjectTitles] = useState<string[]>([]); // Update the type of projectTitles
  const projects = useSelector((state: any) => state.user.user.projects); // Use useSelector to get projects from Redux store
  const username = useSelector((state: any) => state.user.user.username); // Use useSelector to get projects from Redux store
  const fetchNotes = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "username": username,
      "project_title": selectedProject
    });
    console.log(username);
    console.log(selectedProject);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/get_notes`, requestOptions);
      const data = await response.json().then((data) => {
        const pagesArray = Object.values(data.pages) as any; // Convert object to array and cast to NoteType[]
        setNotes(pagesArray);
        console.log(pagesArray);
      });
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    setProjectTitles(Object.keys(projects));
    if (Object.keys(projects).length > 0) {
      setSelectedProject(Object.keys(projects)[0]); // Set the first project as default selected project
    }
  }, []);
  useEffect(() => {
    fetchNotes();
  }, [selectedProject]);
  return (
    <div className="notes-page">
      <div className="notes-panel">
        <div className="notes-panel-logo">
          <Image width={50} height={50} src={openBook} alt="Open Book" />
        </div>
        <div className="notes-panel-content">
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
              className="custom-search-bar" // Add this line
              placeholder="Search notes..."
              enterButton={<SearchOutlined />} // Use Find icon
              size="large"
              onSearch={value => console.log(value)}
            />
          </div>
        </div>
        <div className="notes-main">
          <h1>Notes</h1>
          <div className="notes-list">
            {notes.length > 0 ? (
              <NotesList notes={notes} />
            ) : (
              <div>No notes available</div> // Show this content if notes is empty
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotesPage;
