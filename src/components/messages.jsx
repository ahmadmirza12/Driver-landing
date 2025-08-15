"use client";
import React, { useState } from "react";
import { MdSearch, MdPhone, MdSend, MdAttachFile, MdMoreVert } from "react-icons/md";

// Chat List Item Component
const ChatListItem = ({ chat, isSelected, onSelect, setIsMobile }) => {
  return (
    <div
      onClick={() => {
        onSelect(chat.id);
        setIsMobile(true);
      }}
      className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
        isSelected ? 'bg-gray-50' : ''
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
          {chat.avatar}
        </div>
        {chat.unread && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#1F5546] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">1</span>
          </div>
        )}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900">{chat.name}</h3>
          <span className="text-xs text-gray-500">{chat.time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
      </div>
    </div>
  );
};

// Message Item Component
const MessageItem = ({ message }) => {
  return (
    <div
      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.sender === 'me' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {message.sender === 'other' && (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm flex-shrink-0">
            {message.avatar}
          </div>
        )}
        <div className="flex flex-col">
          <div
            className={`px-4 py-2 rounded-lg ${
              message.sender === 'me'
                ? 'bg-[#1F5546] text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1 px-2">
            {message.time}
          </span>
        </div>
      </div>
    </div>
  );
};

// Chat Header Component
const ChatHeader = ({ setIsMobile }) => {
  return (
    <div className="bg-[#1F5546] text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          className="lg:hidden mr-3 text-white"
          onClick={() => setIsMobile(false)}
        >
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg mr-3">
          👩‍💼
        </div>
        <div>
          <h3 className="font-medium">EMILIA</h3>
          <p className="text-sm text-white/80">Online</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="text-white hover:text-white/80">
          <MdPhone size={20} />
        </button>
        <button className="text-white hover:text-white/80">
          <MdMoreVert size={20} />
        </button>
      </div>
    </div>
  );
};

// Message Input Component
const MessageInput = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center space-x-2">
        <button className="text-gray-500 hover:text-gray-700">
          <MdAttachFile size={20} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
        </div>
        <button
          onClick={handleSendMessage}
          className="bg-[#1F5546] text-white p-2 rounded-lg hover:bg-[#164139] transition-colors"
        >
          <MdSend size={20} />
        </button>
      </div>
    </div>
  );
};

// Main Messages Component
const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Sample chat data
  const chats = [
    {
      id: 0,
      name: "Emilia",
      lastMessage: "I'm not yet come",
      time: "Today",
      unread: true,
      avatar: "👩‍💼"
    },
    {
      id: 1,
      name: "Emilia",
      lastMessage: "",
      time: "",
      unread: true,
      avatar: "👩‍💼"
    },
    {
      id: 2,
      name: "Emilia",
      lastMessage: "I'm not yet come",
      time: "23 min",
      unread: false,
      avatar: "👩‍💼"
    },
    {
      id: 3,
      name: "Emilia",
      lastMessage: "You that Where do long time",
      time: "23 min",
      unread: false,
      avatar: "👩‍💼"
    },
    {
      id: 4,
      name: "Emilia",
      lastMessage: "Do you you are",
      time: "23 min",
      unread: false,
      avatar: "👩‍💼"
    }
  ];

  const messages = [
    {
      id: 1,
      text: "Hello Adam, Good Morning",
      sender: "other",
      time: "Just now",
      avatar: "👩‍💼"
    },
    {
      id: 2,
      text: "I ask about my ride",
      sender: "other",
      time: "Just now",
      avatar: "👩‍💼"
    },
    {
      id: 3,
      text: "Yes Please",
      sender: "me",
      time: "Just now"
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 p-4 sm:p-6">
      <div className="w-full mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Messages
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]">
            {/* Chat List Sidebar */}
            <div className={`w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col ${selectedChat !== null && isMobile ? 'hidden lg:flex' : 'flex'}`}>
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5546] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isSelected={selectedChat === chat.id}
                    onSelect={setSelectedChat}
                    setIsMobile={setIsMobile}
                  />
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col ${selectedChat === null && isMobile ? 'hidden lg:flex' : 'flex'}`}>
              <ChatHeader setIsMobile={setIsMobile} />
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <MessageItem key={message.id} message={message} />
                ))}
              </div>
              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;