// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export const ContactContext = createContext();

// const ContactContextProvider = ({ children }) => {

//   const [contactMessages, setContactMessages] = useState([]);

//   const fetchMessages = async () => {
//     try {
//       const { data } = await axios.get('http://localhost:3000/ContactUs');
//       setContactMessages(data || []);
//     } catch (err) {
//       console.error('Error fetching contact messages:', err);
//     }
//   };

//   const addContactMessage = async (newMessage) => {
//     try {
//       const { data } = await axios.post('http://localhost:3000/ContactUs', newMessage);
//       setContactMessages(prev => [...prev, data]);
//       toast.success("Message added successfully!");
//     } catch (error) {
//       toast.error("Failed to add message to server");
//       console.error("Error posting to json-server:", error);
//     }
//   };

//   const removeContactMessage = async (newMessage) => {
//     console.log(newMessage)
//     try {
//       const updated = contactMessages.filter((message) => message.id !== newMessage.id);
//       setContactMessages(updated);

//       await axios.delete(`http://localhost:3000/ContactUs/${newMessage.id}`);
//       toast.success("Removed from Contact List");

//     } catch (error) {
//       console.error("Failed to remove from Contact List", error);
//       toast.error("Error removing message from Contact List");
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   return (
//     <ContactContext.Provider value={{ contactMessages, addContactMessage, removeContactMessage, fetchMessages }}>
//       {children}
//     </ContactContext.Provider>
//   );
// };

// export default ContactContextProvider;

import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ContactContext = createContext();
const CONTACTS_KEY = "contactMessages";

const ContactContextProvider = ({ children }) => {
  const [contactMessages, setContactMessages] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(CONTACTS_KEY);
    setContactMessages(stored ? JSON.parse(stored) : []);
  }, []);

  const saveMessages = (messages) => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(messages));
    setContactMessages(messages);
  };

  const addContactMessage = (newMessage) => {
    const updated = [
      ...contactMessages,
      { ...newMessage, id: Date.now().toString() },
    ];
    saveMessages(updated);
    toast.success("Message added successfully!");
  };

  const removeContactMessage = (messageToRemove) => {
    const updated = contactMessages.filter(
      (msg) => msg.id !== messageToRemove.id
    );
    saveMessages(updated);
    toast.success("Removed from Contact List");
  };

  return (
    <ContactContext.Provider
      value={{ contactMessages, addContactMessage, removeContactMessage }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export default ContactContextProvider;
