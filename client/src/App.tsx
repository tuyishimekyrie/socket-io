import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import "./App.css";

interface Message {
  content: string;
  sender: "me" | "other";
}

export const App = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");

    newSocket.on("connect", () => {
      console.log("you connected with " + newSocket.id);
    });

    newSocket.on("message", (message: { content: string; sender: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message.content, sender: "other" },
      ]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit("message", { content: message, sender: "me" });
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, sender: "me" },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};
