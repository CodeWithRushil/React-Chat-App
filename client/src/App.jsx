import { useState, useEffect, useRef } from "react";
import "./App.css";
import io from "socket.io-client";

// const socket = io("http://localhost:5000");
const socket = io("https://react-chat-app-two-delta.vercel.app");

function App() {
  const [username, setUsername] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      alert("Message cannot be empty");
      return;
    }
    const messageData = {
      message: newMessage,
      user: username,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.emit("send-message", messageData);
    setNewMessage("");
  };

  useEffect(() => {
    socket.on("received-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("received-message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-purple-500 mb-6">💬 Chat with a Mentor</h1>

      {chatActive ? (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start ${
                  message.user === username ? "justify-end" : "justify-start"
                }`}
              >
                {message.user !== username && (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-400 text-white font-bold mr-2">
                    {message.user.charAt(0).toUpperCase()}
                  </div>
                )}

                <div
                  className={`max-w-xs px-3 py-2 rounded-lg shadow ${
                    message.user === username
                      ? "bg-purple-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <span className="text-xs font-bold">{message.user}</span>
                  <p className="text-sm">{message.message}</p>
                  <span className={`block text-[10px] text-right message.user === username
                      ? "text-gray-200"
                      : "text-gray-500"`}>
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex border-t border-gray-200 p-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Enter Your Name</h2>
          <input
            type="text"
            placeholder="Your name"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => username !== "" && setChatActive(true)}
            type="submit"
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition cursor-pointer"
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
