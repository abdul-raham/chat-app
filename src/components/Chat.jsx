import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages in real-time
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Send message to Firestore
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      senderId: auth.currentUser?.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage(""); // Clear input field
  };

  return (
    <div className="p-4 bg-gray-100 h-screen flex flex-col">
      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-2 my-2 rounded-lg ${msg.senderId === auth.currentUser?.uid ? "bg-blue-500 text-white self-end" : "bg-gray-300"}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Send Message Form */}
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
