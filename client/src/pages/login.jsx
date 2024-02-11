import { useStateProvider } from "@/context/StateContext";
import { reducercases } from "@/context/constants";
import { check_user_route } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
function login() {
  const router = useRouter();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  useEffect(() => {
    if (userInfo?.id && !newUser) router.push("/");
  }, [userInfo,newUser]);

  const handleLogin = async () => {
    
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email, photoURL: ProfileImage },
    } = await signInWithPopup(firebaseAuth, provider);
    try {
      if (email) {
        const { data } = await axios.post(check_user_route, { email });
        // console.log({data})
        if (!data.status) {
          dispatch({
            type: reducercases.SET_NEW_USER,
            newUser: true,
          });
          dispatch({
            type: reducercases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              ProfileImage,
              status: "",
            },
          });
          router.push("/onboarding");
        } else {
          const {
            id,
            name,
            email,
            ProfilePicture: profileImage,
            status,
          } = data.data;
          dispatch({
            type: reducercases.SET_USER_INFO,
            userInfo: {
              id,
              name,
              email,
              profileImage,
              status,
            },
          });
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
        <span className="text-7xl">whatsapp</span>
      </div>
      <button
        className=" flex items-center justify-center gap-4 bg-search-input-container-background p-5 rounded-lg"
        onClick={handleLogin}
      >
        <FcGoogle className=" text-4xl" />
        <span className="text-white text-2xl">Login with Google</span>
      </button>
    </div>
  );
}

export default login;
