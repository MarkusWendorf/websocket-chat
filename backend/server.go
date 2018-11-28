package main

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"websocket/chat"
	"websocket/model"
)

const (
	TypeRegister = iota
	TypeMessage
)

func main() {

	upgrader := websocket.Upgrader{}
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	chatrooms := chat.New()
	mux := chi.NewMux()

	mux.HandleFunc("/chat", func(w http.ResponseWriter, r *http.Request) {

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal(err)
		}

		var currentUsername string
		var registration model.Registration
		var message model.Message

		for {

			_, payload, err := conn.ReadMessage()
			if err != nil {
				log.Println("Unregister User:", currentUsername)
				chatrooms.Unregister(currentUsername)
				return
			}

			switch getMessageType(payload) {
			case TypeRegister:
				log.Println("Type Register:", string(payload))
				err = json.Unmarshal(payload, &registration)
				if err != nil {
					return
				}

				chatrooms.Register(&registration, conn)
				currentUsername = registration.Username
			case TypeMessage:
				log.Println("Type Message:", string(payload))
				err = json.Unmarshal(payload, &message)
				if err != nil {
					return
				}

				chatrooms.SendMessage(message)
			default:
				log.Println("Type Unknown: ", string(payload))
			}

		}
	})

	log.Fatal(http.ListenAndServe(":3000", mux))
}

func getMessageType(data []byte) int {

	var message struct {
		Type int `json:"type"`
	}

	err := json.Unmarshal(data, &message)
	if err != nil {
		log.Println(err)
		return -1
	}

	return message.Type
}
