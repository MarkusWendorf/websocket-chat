package chat

import (
	"github.com/gorilla/websocket"
	"log"
	"strconv"
	"sync"
	"time"
	"websocket/model"
)

type Chat struct {
	lock        sync.RWMutex
	idCounter   int64
	Connections map[string]*websocket.Conn // key == username
	Chatrooms   map[string]*model.ChatRoom // key == room name
}

func New() *Chat {
	
	pool := &Chat{
		Connections: map[string]*websocket.Conn{},
		Chatrooms:   map[string]*model.ChatRoom{},
	}

	pool._debug()
	
	return pool
}

func (c *Chat) SendMessage(message model.Message) {
	c.lock.Lock()
	defer c.lock.Unlock()

	c.idCounter++
	message.Id = strconv.FormatInt(c.idCounter, 10)
	message.Time = time.Now()

	room := c.getChatroom(message.Room)
	room.Messages = append(room.Messages, message)


	c.notifyUsers(room)
}

func (c *Chat) Register(registration *model.Registration, conn *websocket.Conn) {
	c.lock.Lock()
	defer c.lock.Unlock()

	username := registration.Username
	chatroom := registration.Chatroom
	c.Connections[username] = conn

	// remove user from all other chatrooms
	for _, room := range c.Chatrooms {
		delete(room.Users, username)
	}

	room := c.getChatroom(chatroom)

	// subscribe user to chat
	room.Users[username] = struct{}{}
	c.notifyUser(username, room)
}

func (c *Chat) Unregister(username string) {
	c.lock.Lock()
	defer c.lock.Unlock()

	delete(c.Connections, username)

	for _, chatroom := range c.Chatrooms {
		delete(chatroom.Users, username)
	}
}

// DO NOT USE the following internal functions WITHOUT acquiring a lock at the call site

// if there's no chat with this name yet, it will be created
func (c *Chat) getChatroom(chatroom string) *model.ChatRoom {

	room := c.Chatrooms[chatroom]
	if room == nil {
		// initialize new room
		newRoom := &model.ChatRoom{Name: chatroom, Users: map[string]struct{}{}, Messages: make([]model.Message, 0)}
		c.Chatrooms[chatroom] = newRoom
		return newRoom
	}

	return room
}

// read only, to do: check error
func (c *Chat) notifyUsers(chatroom *model.ChatRoom) {

	for user, _ := range chatroom.Users {
		c.Connections[user].WriteJSON(model.MessagePackage{
			Chatroom: chatroom.Name,
			Messages: chatroom.Messages,
		})
	}
}

// read only, to do: check error
func (c *Chat) notifyUser(username string, chatroom *model.ChatRoom) {

	c.Connections[username].WriteJSON(model.MessagePackage{
		Chatroom: chatroom.Name,
		Messages: chatroom.Messages,
	})
}

func (c *Chat) _debug() {

	go func() {

		for {
			time.Sleep(3 * time.Minute)
			c.lock.Lock()

			log.Println("Connections =", len(c.Connections))

			rooms := "Rooms = \n"
			for name, users := range c.Chatrooms {
				room := name + " = ["

				for user, _ := range users.Users {
					room += user + ","
				}

				room += "]"
				rooms += room + "\n"
			}

			log.Println(rooms)

			c.lock.Unlock()
		}
	}()

}
