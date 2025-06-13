// import React, { createContext, useEffect, useState } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// const AuthContextProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setCurrentUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     if (currentUser) {
//       localStorage.setItem("user", JSON.stringify(currentUser));
//     } else {
//       localStorage.removeItem("user");
//     }
//   }, [currentUser]);

//   const register = async ({ name, email, password, role = "user" }) => {
//     const { data: existingUsers } = await axios.get(
//       `http://localhost:3000/users?email=${email}`
//     );
//     if (existingUsers.length > 0) throw new Error("Email already registered");

//     const { data } = await axios.post("http://localhost:3000/users", {
//       name,
//       email,
//       password,
//       role,
//     });

//     setCurrentUser(data);
//     return data;
//   };

//   const login = async (email, password) => {
//     const { data } = await axios.get(
//       `http://localhost:3000/users?email=${email}&password=${password}`
//     );
//     if (data.length === 0) throw new Error("Invalid credentials");

//     setCurrentUser(data[0]);
//     return data[0];
//   };

//   const logout = () => {
//     setCurrentUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ currentUser, register, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();
const USER_KEY = "user";
const USERS_KEY = "users";

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultUsers = useMemo(
    () => [
      {
        id: "1",
        name: "Mohamd Bauomyi",
        email: "mohamedbayomya@gmail.com",
        password: "mohamedbauomyi",
        role: "admin",
        image: "",
      },
      {
        id: "2",
        name: "Baher Osama",
        email: "baherosama@gmail.com",
        password: "baherosama",
        role: "admin",
        image: "/assets/BaherOsama.JPG",
      },
      {
        id: "3",
        name: "Marina Magdy",
        email: "marinamagdy@gmail.com",
        password: "marinamagdy",
        role: "admin",
        image: "",
      },
      {
        id: "4",
        name: "Shahd Fekry",
        email: "shahdfekry@gmail.com",
        password: "shahdfekry",
        role: "admin",
        image: "",
      },
    ],
    []
  );
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY));
    if (!storedUsers || storedUsers.length === 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }

    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, [defaultUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [currentUser]);

  const register = async ({ name, email, password, role = "user" }) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    if (users.some((u) => u.email === email)) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
    };

    const updated = [...users, newUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    setCurrentUser(newUser);
    return newUser;
  };

  const login = async (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error("Invalid credentials");

    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, register, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
