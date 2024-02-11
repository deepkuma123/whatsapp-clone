import { useStateProvider } from "@/context/StateContext";
import { reducercases } from "@/context/constants";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function logout() {
  const [{userInfo, socket},dispatch] = useStateProvider()
  const router = useRouter();

  useEffect(() => {
    socket.current.emit("signout",userInfo.id)
    dispatch({ type: reducercases.SET_USER_INFO, userInfo: undefined });
    signOut(firebaseAuth);
    router.push('/login')
  },[socket])
  return <div className=" bg-conversation-panel-background">logout</div>;
}

export default logout;
