import React from "react";
import MenuIcon from "../../icons/MenuIcon";
import UserIcon from "../../icons/UserIcon";
import {SwitchContent} from "../SwitchContent/SwitchContent";
import "./FlyoutPages/FlyoutUserpage/flyout-userpage.scss";
import FlyoutDefault from "./FlyoutPages/FlyoutDefault/FlyoutDefault";
import FlyoutUserpage from "./FlyoutPages/FlyoutUserpage/FlyoutUserpage";

interface Props {
    onToggleSidebar: () => void;
}

interface State {
    currentPage: number;
}

export default class Flyout extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            currentPage: 0,
        };
    }

    public render() {

        const currentPage = this.state.currentPage;

        return (
            <div className="chat-sidebar__flyout">
                <div className="chat-sidebar__flyout-head">
                    <div className="chat-sidebar__menu-button" onClick={this.props.onToggleSidebar}>
                        <MenuIcon/>
                    </div>

                    <div className="chat-sidebar__logo" onClick={() => this.setState({currentPage: 0})}>
                        Chat<span>ney</span>
                    </div>

                    <div className="chat-sidebar__user-button" onClick={() => this.setState({currentPage: 1})}>
                        <UserIcon/>
                    </div>
                </div>

                <div className="chat-sidebar__content">
                    <SwitchContent current={currentPage}>
                        <FlyoutDefault/>
                        <FlyoutUserpage/>
                    </SwitchContent>
                </div>
            </div>
        );
    }

}
