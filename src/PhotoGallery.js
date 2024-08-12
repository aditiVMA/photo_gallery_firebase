import React, { useState, useEffect } from "react";
import { auth, storage, firestore } from "./firebase/configuration";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const PhotoGallery = () => {
  const auth = getAuth();
  const { photoURL } = auth.currentUser; // auth user's pic
  const [imgUrls, setImgUrls] = useState([]);
  const [progresspercent, setProgresspercent] = useState({});

  const urlsCollectionRef = collection(firestore, "imageUrls");

  const signOut = () => {
    auth.signOut();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target[0]?.files);

    if (files.length === 0) return;

    files.forEach((file) => {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgresspercent((prevProgress) => ({
            ...prevProgress,
            [file.name]: progress,
          }));
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // Save URL to Firestore and update state with ID
            const docRef = await addDoc(urlsCollectionRef, {
              url: downloadURL,
            });
            setImgUrls((prevUrls) => [
              ...prevUrls,
              { id: docRef.id, url: downloadURL },
            ]);
          });
        }
      );
    });
  };

  const deleteImage = async (id) => {
    try {
      const imageDoc = doc(firestore, "imageUrls", id);
      await deleteDoc(imageDoc);
      setImgUrls((prevUrls) => prevUrls.filter((urlObj) => urlObj.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    const fetchUrls = async () => {
      const querySnapshot = await getDocs(urlsCollectionRef);
      const urls = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        url: doc.data().url,
      }));
      setImgUrls(urls);
    };

    fetchUrls();
  }, []);

  return (
    <div className="w-[100%] min-h-[100vh] ">
      <div className="flex justify-end pt-10 pr-5 ">
        <div className="bg-[green] p-3 px-8 cursor-pointer rounded-full flex items-center gap-2">
          <button className=" " onClick={signOut}>
            Sign Out
          </button>
          <img src={photoURL} className="w-[30px] rounded-full" />
        </div>
      </div>
      <div>
        <p className="text-[55px] font-semibold text-center text-[#1d8441]">
          Photo Gallery
        </p>
        <div className="flex justify-center mt-5">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3">
              <div className="bg-[black] rounded-full text-white h-10 w-[200px] relative cursor-pointer">
                <div className="text-[23px] font-semibold text-center text-[#f6f7f6]">
                  Choose file
                </div>
                <input
                  type="file"
                  multiple
                  className="bg-blue-700 text-white cursor-pointer absolute"
                />
              </div>
              <div>
                <button
                  className="bg-[green] p-2 rounded-full text-white"
                  type="submit"
                >
                  Upload
                </button>
              </div>
            </div>
          </form>
        </div>
        {imgUrls.length > 0 && (
          <div className="w-[90%] mx-auto mt-10">
            {Object.keys(progresspercent).map((fileName) =>
              progresspercent[fileName] < 100 ? (
                <div key={fileName} className="outerbar mb-2">
                  <div
                    className="innerbar bg-green-500 h-6 rounded-full"
                    style={{ width: `${progresspercent[fileName]}%` }}
                  >
                    {progresspercent[fileName]}%
                  </div>
                </div>
              ) : null
            )}
            <div className="border-[4px] border-green-300 rounded-3xl p-3">
              <div className="grid grid-cols-5 gap-5 max-h-[80vh] overflow-y-scroll">
                {imgUrls.map((urlObj, index) => {
                  return (
                    <div key={index} className="flex gap-2 w-[200px] relative">
                      <img src={urlObj.url} alt="uploaded file" height={200} />
                      <button
                        onClick={() => deleteImage(urlObj.id)}
                        className="font-bold absolute right-14 text-[red] border border-[red] rounded-full w-[25px] h-[25px]"
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
