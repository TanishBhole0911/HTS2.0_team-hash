import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import NotesReducer from "./Notes/Notes-slice";
import UserReducer from "./User/user-slice";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    notes: NotesReducer,
    user: UserReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST"],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

