import React, { useState } from "react";
import { auth } from "./firebase/configuration";
import { useAuthState } from "react-firebase-hooks/auth";
// import { GoogleAuthProvider } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [user] = useAuthState(auth);
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  const signOut = () => {
    auth.signOut();
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] bg-[#000]">
      <p className="text-[55px] font-semibold text-center text-[#21d11b]">
        Photo Gallery
      </p>
      <div className="flex justify-center mt-10">
        {user ? (
          <button
            className="bg-[#21d11b] p-3 px-8 cursor-pointer text-white rounded-full"
            onClick={signOut}
          >
            Sign Out
          </button>
        ) : (
          <button
            className="bg-[#2a890d] p-3 px-8 cursor-pointer text-white rounded-full"
            onClick={googleSignIn}
          >
            Google Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
