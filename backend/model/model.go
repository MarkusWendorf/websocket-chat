package model

import (
	"encoding/json"
	"fmt"
	"time"
)

type Registration struct {
	Username string `json:"username"`
	Chatroom string `json:"chatroom"`
}

type Message struct {
	Author string `json:"author"`
	Text string `json:"text"`
	Room string `json:"room"`
	Time time.Time `json:"time"`
	Id string `json:"id"`
}

type MessagePackage struct {
	Chatroom string `json:"chatroom"`
	Messages []Message `json:"messages"`
}

type ChatRoom struct {
	Name     string
	Users    map[string]struct{}
	Messages []Message
}

func (m *Message) String() string {
	return fmt.Sprintf("%s, %s, %s", m.Author, m.Text, m.Room)
}

// return js compatible time
func (m *Message) MarshalJSON() ([]byte, error) {
	jsISOString := "2006-01-02T15:04:05.999Z07:00"
	jsTime := time.Now().UTC().Format(jsISOString)

	type modified Message
	return json.Marshal(&struct {
		*modified
		Time string
	}{
		modified: (*modified)(m),
		Time: jsTime,
	})
}
