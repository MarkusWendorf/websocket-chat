import React from "react";
import "./chat-sidebar.scss";
import MenuIcon from "../../icons/MenuIcon";
import {GlobalState, StateContext} from "../../context/StateContext";
import Flyout from "./Flyout";
import {RouteComponentProps, withRouter} from "react-router";

interface OwnProps {

}

type Props = OwnProps & RouteComponentProps;

interface State {
    sidebarOpen: boolean;
}

class ChatSidebar extends React.Component<Props, State> {

    public static contextType = StateContext;

    // @ts-ignore
    public context: GlobalState;
    private sidebarRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            sidebarOpen: false,
        };
    }

    public componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);

        this.historyUnsubscribe = this.props.history.listen((location) => {
            this.setState({sidebarOpen: false});
        });
    }

    public componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
        this.historyUnsubscribe();
    }

    public render() {

        const open = this.state.sidebarOpen ? "open" : "";

        return (
            <aside className={"chat-sidebar " + open} ref={this.sidebarRef}>
                <div className="chat-sidebar__menu-button" onClick={this.toggleSidebar}>
                    <MenuIcon/>

                </div>
                <div className="chat-sidebar__current-room">
                    <span>{getChatroom(this.props.location.pathname)}</span>
                </div>
                <Flyout onToggleSidebar={this.toggleSidebar}/>

            </aside>
        );
    }

    private toggleSidebar = () => {
        this.setState({sidebarOpen: !this.state.sidebarOpen});
    };

    private handleClickOutside = (event: any) => {
        const sidebar = this.sidebarRef.current;
        if (sidebar && !sidebar.contains(event.target)) {
            this.setState({sidebarOpen: false});
        }
    };

    private updateUsername = (e: any) => {
        this.context.setUsername(e.target.value);
    };

    private historyUnsubscribe = () => { /* */ };
}

const getChatroom = (path: string): string => {
    const regEx = new RegExp("^/chatrooms/(.*?)$");
    const match = regEx.exec(path);
    return match ? match[1] : "";
};

export default withRouter(ChatSidebar as React.ComponentType<Props>);
