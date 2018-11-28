import * as React from "react";
import {IMessage} from "../../../model/model";
import "./message.scss";

interface Props {
    message: IMessage;
    own: boolean;
}

const Message = ({message, own}: Props) => (
    <div className={`message ${own ? "own" : ""}`}>
        <div className="message__body">
            <div className="message__meta">
                <span className="message__from">{message.author}</span>
                <span className="message__time">{formatDate(message.time)}</span>
            </div>

            <div className="message__text">
                 {message.text}
            </div>
    </div>
</div>
)
;

const formatDate = (date: string): string => {
    return new Date(date).toLocaleTimeString();
};

export default Message;
