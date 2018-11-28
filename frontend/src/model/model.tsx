
export interface IMessage {
    text: string;
    author: string;
    time: string;
    id: string;
}

export interface MessagePackage {
    chatroom: string;
    messages: IMessage[];
}
