import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {BsFillChatLeftTextFill, BsThreeDotsVertical} from 'react-icons/bs'
import { reducercases } from "@/context/constants";
import {  useRouter } from "next/router";
import ContextMenu from "../common/ContextMenu";


function ChatListHeader() {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinate, setContextMenuCordinate] = useState({
    x: 0,
    y: 0,
  });

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinate({ x: e.pageX, y: e.pageY });
    setIsContextMenuVisible(true);
  };

  const contextMenuOptions = [
    {
      name: "Logout",
      callback: async () => {
        setIsContextMenuVisible(false);
        router.push('/logout')
      },
    },
  ];

  const handleAllContactPage = () =>{
    dispatch({type:reducercases.SET_ALL_CONTACT_PAGE  })
  }
  return (
    <div className=" h-16 py-4 justify-between flex items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className=" text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactPage}
        />
        <>
          <BsThreeDotsVertical
            className=" text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
            id="context-operner"
            onClick={(e) => showContextMenu(e)}
          />
          {isContextMenuVisible && (
            <ContextMenu
              options={contextMenuOptions}
              cordinates={contextMenuCordinate}
              contextMenu={isContextMenuVisible}
              setContextMenu={setIsContextMenuVisible}
            />
          )}
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;
