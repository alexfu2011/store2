import React, { createContext, useContext, useReducer } from "react";

const initialState = {
    token: ""
};
const store = createContext(initialState);
const { Provider } = store;

const tokenReducer = (state, action) => {
    const currentState = { ...state };
    switch (action.type) {
        case "SET_TOKEN":
            currentState.token = action.payload;
            localStorage.setItem("token", action.payload);
            return currentState;
        case "LOGOUT":
            currentState.token = null;
            localStorage.setItem("token", "");
            return currentState;
        default:
            throw new Error();
    }
};

export const TokenProivder = ({ children }) => {
    const [state, dispatch] = useReducer(tokenReducer, initialState);
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export const useToken = () => {
    const context = useContext(store);
    if (context === undefined) {
        throw new Error("useToken must be used within a TokenProvider");
    }
    return context;
};