import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const initialState = {
    notes: [],
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        resetNotes: (state) => {
            state.notes = [];
        },
    },
});


export const { setNotes, resetNotes } = notesSlice.actions;
export default notesSlice.reducer;