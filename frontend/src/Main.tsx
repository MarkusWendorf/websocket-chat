import * as React from "react";
import Chat from "./components/Chat/Chat";
import ChatSidebar from "./components/ChatSidebar/ChatSidebar";
import {GlobalState, StateContext} from "./context/StateContext";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import "./main.scss";
import "./normalize.scss";
import {names} from "./context/randomNames";

class Main extends React.Component<{}, GlobalState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            username: names[Math.floor(Math.random() * names.length)],
            setUsername: (username: string) => this.setState({username}),
        };
    }

    public render() {

        return (
            <StateContext.Provider value={this.state}>

                <BrowserRouter>

                    <div className="main-panel">

                        <Switch>
                            <Route path={"/"} exact>
                                <Redirect to={"/chatrooms/Smalltalk"}/>
                            </Route>

                            <Route path={"/chatrooms/Hardware"} exact>
                                <Chat chatroom={"Hardware"}/>
                            </Route>

                            <Route path={"/chatrooms/Gaming"} exact>
                                <Chat chatroom={"Gaming"}/>
                            </Route>

                            <Route path={"/chatrooms/Smalltalk"} exact>
                                <Chat chatroom={"Smalltalk"}/>
                            </Route>

                            <Route path={"/chatrooms/Sports"} exact>
                                <Chat chatroom={"Sports"}/>
                            </Route>

                            <Route path={"/chatrooms/Cooking"} exact>
                                <Chat chatroom={"Cooking"}/>
                            </Route>
                        </Switch>

                        <ChatSidebar/>
                    </div>

                </BrowserRouter>

            </StateContext.Provider>
        );
    }
}

export default Main;
