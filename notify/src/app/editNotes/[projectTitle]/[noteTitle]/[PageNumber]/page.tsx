'use client'
import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import TurndownService from "turndown";
import { useSelector } from "react-redux";
import { useParams } from 'next/navigation'; // Import useParams
import { useRef } from "react";
import "../../../../styles/editNotes.css"
import { Button } from 'antd'; // Import Button from antd
import { message } from 'antd'; // Import message from antd
export default function EditNotes() {
	const { projectTitle, noteTitle, PageNumber } = useParams(); // Get projectTitle and noteTitle from params
	// Use useSelector to get values from Redux store
	const cachedUsername = useSelector((state: any) => state.user.user.username);
	const editorRef = useRef<any>(null);

	// Initialize state without default values
	const [editorContent, setEditorContent] = useState<string>("");
	const [noteTitleState, setNoteTitleState] = useState<string>(Array.isArray(decodeURIComponent(noteTitle as string)) ? decodeURIComponent(noteTitle as string)[0] : decodeURIComponent(noteTitle as string));
	useEffect(() => {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const decodedProjectTitle = decodeURIComponent(projectTitle as string);
		const decodedNoteTitle = decodeURIComponent(noteTitle as string);
		const raw = JSON.stringify({
			"username": cachedUsername,
			"project_title": decodedProjectTitle
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow" as RequestRedirect
		};

		fetch(`${process.env.NEXT_PUBLIC_API_FETCH_API}/get_notes`, requestOptions)
			.then((response) => response.text())
			.then((result) => {
				const parsedResult = JSON.parse(result);
				const correctNote = parsedResult.pages.find((page: any) => page.note_title === decodedNoteTitle && page.page_number === parseInt(PageNumber as string));
				if (correctNote) {
					setEditorContent(correctNote.content);
					console.log(correctNote.content)
				} else {
					console.error("Note not found");
				}
			})
			.catch((error) => console.error(error));
	}, [])
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
		const turndownService = new TurndownService();
		const markdownContent = turndownService.turndown(editorRef.current.getContent());
		console.log(markdownContent)

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
						content: markdownContent,
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
				}
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
		<div className="edit-notes-container">


			<form onSubmit={handleSubmit}>
				<div className="edit-notes-title">
					<label className="edit-notes-title-label">
						Note Title:
						<input
							className="edit-notes-title-input"
							type="text"
							value={noteTitleState}
							required
						/>
					</label>
				</div>
				<Editor
					apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
					key={editorContent} // Add key prop to force re-render
					onInit={(_evt, editor) => editorRef.current = editor}
					init={{
						plugins: [
							// Core editing features
							'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
							// Your account includes a free trial of TinyMCE premium features
							// Try the most popular premium features until Oct 8, 2024:
							'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
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
					initialValue={editorContent} // Set initialValue to editorContent
				/>
				<Button type="primary" htmlType="submit">Save Content</Button>
			</form>
		</div>
	);
}
