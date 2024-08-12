import React from "react";
import Login from "./Login";
import { useAuthState } from "react-firebase-hooks/auth";
import PhotoGallery from "./PhotoGallery";
import { auth } from "./firebase/configuration";

const App = () => {
  const [user] = useAuthState(auth);
  console.log(user);
  return <div>{!user ? <Login /> : <PhotoGallery />}</div>;
};

export default App;
