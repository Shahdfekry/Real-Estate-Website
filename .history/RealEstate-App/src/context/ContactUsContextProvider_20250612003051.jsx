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
