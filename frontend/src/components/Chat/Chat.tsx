import Message from "./Message/Message";
import {IMessage, MessagePackage} from "../../model/model";
import React from "react";
import "./chat.scss";
import MessageIcon from "../../icons/MessageIcon";
import {GlobalState, StateContext} from "../../context/StateContext";
import {Subscription} from "rxjs";
import {observeChatroom, sendMessage} from "../../websocket/websocket";

interface Props {
    chatroom: string;
}

interface State {
    messages: IMessage[];
}

class Chat extends React.Component<Props, State> {
    public static contextType = StateContext;

    // @ts-ignore
    public context: GlobalState;
    private chatRef = React.createRef<HTMLDivElement>();
    private subscription?: Subscription;

    constructor(props: Props) {
        super(props);

        this.state = {
            messages: [],
        };
    }

    public componentDidUpdate(prev: Props) {
        if (prev.chatroom !== this.props.chatroom) {
            // chatroom changed
            this.subscribeToWebsocket(this.context.username, this.props.chatroom);
        }
    }

    public componentDidMount() {
        this.subscribeToWebsocket(this.context.username, this.props.chatroom);
    }

    public componentWillUnmount() {
        const subscription = this.subscription;
        if (subscription) subscription.unsubscribe();
    }

    public render() {

        const currentUser = this.context.username;
        const messages = this.state.messages;

        return (
            <div className="chat">

                <div className="chat__messages" ref={this.chatRef}>
                    {messages.map((m) => (
                        <Message key={m.id} message={m} own={m.author === currentUser}/>
                    ))}
                </div>

                <form className="chat__input-form" onSubmit={this.handleSend}>
                    <input className="chat__text-input" name="message" autoComplete="off" type="text"/>
                    <button className="chat__send-button">
                        <MessageIcon/>
                    </button>
                </form>

            </div>
        );
    }

    private handleSend = (event: any) => {
        event.preventDefault();

        const messageInput = event.target.message;
        const text = messageInput.value;

        const message = {
            type: 1,
            author: this.context.username,
            room: this.props.chatroom,
            text,
        };

        console.log(message);
        sendMessage(message);

        // clear
        messageInput.value = "";
    };

    private subscribeToWebsocket = (username: string, room: string) => {
        if (this.subscription) this.subscription.unsubscribe();

        this.subscription = observeChatroom(username, room).subscribe((pkg: MessagePackage) => {
            const {messages} = pkg;
            this.setState({messages});

            setTimeout(() => {
                const ref = this.chatRef.current;
                if (ref) ref.scrollIntoView(false);
            }, 0);
        });
    };
}

function toColor(num: number) {
    return "#" + num.toString(16).padStart(6, "0");
}

export default Chat;
