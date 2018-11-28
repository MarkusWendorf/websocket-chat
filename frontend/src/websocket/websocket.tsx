import {Observable, Observer} from "rxjs";
import {IMessage} from "../model/model";

const url = "ws://localhost:3000/chat";
const ws = new WebSocket(url);

export function observeChatroom(username: string, chatroom: string): Observable<any> {

    sendMessage({type: 0, chatroom, username});

    return Observable.create((observer: Observer<IMessage>) => {

        const onNext = (pkg: any) => {
            if (pkg.chatroom === chatroom) {
                observer.next(pkg);
            }
        };

        ws.onmessage = (event: MessageEvent) => onNext(JSON.parse(event.data));

        return () => {
            // clean up?
        };
    });
}

export async function sendMessage(message: any) {
    await waitForConnection();

    ws.send(JSON.stringify(message));
}

function waitForConnection() {
    return new Promise((resolve, reject) => {
        if (ws.readyState === 1) resolve();
        ws.onopen = () => resolve();
    });
}
