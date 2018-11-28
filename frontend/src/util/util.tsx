
export function getChatroom(path: string): string {
    const regEx = new RegExp("^/chatrooms/(.*?)$");
    const match = regEx.exec(path);
    return match ? match[1] : "";
}
