import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch messages from Firebase in real-time
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Listen for real-time messages & typing status from Socket.io
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("userTyping", (userId) => {
      if (userId !== auth.currentUser?.uid) setTyping(true);
      setTimeout(() => setTyping(false), 2000);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      unsubscribe();
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("onlineUsers");
    };
  }, []);

  // Send message to Firebase & broadcast via Socket.io
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const messageData = {
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName || "Unknown User", // Fix name issue
      senderPhoto: user.photoURL || "https://via.placeholder.com/40",
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "messages"), messageData);
    socket.emit("sendMessage", { id: docRef.id, ...messageData });

    setNewMessage("");
  };

  // Notify others when typing
  const handleTyping = () => {
    socket.emit("userTyping", auth.currentUser?.uid);
  };

  return (
    <div className="p-4 bg-gray-100 h-screen flex flex-col">
      {/* Online Users */}
      <div className="p-2 bg-white shadow-md rounded-lg mb-2">
        <strong>Online Users:</strong> {onlineUsers.length > 0 ? onlineUsers.join(", ") : "No users online"}
      </div>

      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-center my-2 ${msg.senderId === auth.currentUser?.uid ? "justify-end" : "justify-start"}`}>
            <img src={msg.senderPhoto} alt="User" className="w-8 h-8 rounded-full mr-2" />
            <div className={`p-2 rounded-lg max-w-xs ${msg.senderId === auth.currentUser?.uid ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
              <strong>{msg.senderName}</strong>: {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Typing Indicator */}
      {typing && <p className="text-sm text-gray-500">Someone is typing...</p>}

      {/* Send Message Form */}
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
