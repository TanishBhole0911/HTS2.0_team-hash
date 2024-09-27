import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: {
        username: "",
        projects: {}
    },
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = {
                username: action.payload.username,
                projects: action.payload.projects
            };
        },
        resetUser: (state) => {
            state.user = {
                username: "",
                projects: {}
            };
            console.log(state.user);
        },
    },
});


export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
