import React from "react";

export interface GlobalState {
    username: string;
    setUsername: (username: string) => void;
}

export const StateContext = React.createContext<GlobalState>({
    username: "",
    setUsername: (s: string) => {
    },
});
