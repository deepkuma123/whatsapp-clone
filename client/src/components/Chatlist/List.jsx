  import { useStateProvider } from "@/context/StateContext";
  import { reducercases } from "@/context/constants";
  import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import ChatLIstItem from "./ChatLIstItem";

  function List() {
    const [{ userInfo, socket ,filteredContacts,userContacts , message}, dispatch] = useStateProvider();
    useEffect(() => {
      // console.log(socket);
    }, [userInfo, socket,message]);
    const getContacts = async () => {
      try {
        const response = await axios.get(
          `${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`
        );
        const { users, OnlineUsers } = response.data;

        console.log(response.data);
        if (response.status === 201) {
          // assuming 200 is the correct success status code
          socket.current.emit("contact-msg", {
            to: userInfo?.id,
            // from: userInfo?.id,
            users: users,
            OnlineUsers: OnlineUsers,
          });

          dispatch({
            type: reducercases.SET_ONLINE_USERS,
            OnlineUsers: OnlineUsers,
          });
          dispatch({
            type: reducercases.SET_USER_CONTACTS,
            userContacts: users,
          });
        }
      } catch (error) {
        console.error("Error fetching initial contacts:", error);
      }
    };
    if (userInfo?.id) getContacts();
    return (
      <div className=" bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar ">
        {filteredContacts && filteredContacts.length > 0
          ? filteredContacts.map((contact) => (
              <ChatLIstItem data={contact} key={contact.id} />
            ))
          : userContacts.map((contact) => (
              <ChatLIstItem
                data={contact}
              key={contact.id}
              />
            ))}
      </div>
    );
  }

  export default List;
