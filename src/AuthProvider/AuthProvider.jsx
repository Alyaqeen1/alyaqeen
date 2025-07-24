import React, { createContext, useEffect, useState } from "react";
export const authContext = createContext();
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail, // ✅ Add this
} from "firebase/auth";
import auth from "../firebase/firebase.config";
import axios from "axios";
// import axios from "axios";

// const googleProvider = new GoogleAuthProvider();
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const updateUser = (profileData) => {
    setLoading(true);
    return updateProfile(auth.currentUser, profileData);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        const { data } = await axios.post(
          `${import.meta.env.VITE_WebApi_URL}/jwt`,
          { email: currentUser?.email },
          { withCredentials: true }
        );

        setLoading(false);
      } else {
        const { data } = await axios.get(
          `${import.meta.env.VITE_WebApi_URL}/logout`,
          {
            withCredentials: true,
          }
        );

        setLoading(false);
      }
      return () => unsubscribe();
    });
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signInUser,
    signOutUser,
    updateUser,
    resetPassword, // ✅ Include this here
  };
  return (
    <authContext.Provider value={authInfo}>{children}</authContext.Provider>
  );
}
