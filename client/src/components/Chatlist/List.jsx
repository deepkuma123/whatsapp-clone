import { useStateProvider } from "@/context/StateContext";
import { reducercases } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] =
    useStateProvider();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users, OnlineUsers },
        } = await axios(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
        dispatch({ type: reducercases.SET_ONLINE_USERS, OnlineUsers });
        dispatch({ type: reducercases.SET_USER_CONTACTS, userContacts: users });
        console.log({ data: { users, OnlineUsers } });
      } catch (err) {
        console.log(err);
      }
    };
    if (userInfo?.id) getContacts();
  }, [userInfo]);
  return (
    <div className=" bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar ">
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))
        : userContacts.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))}
    </div>
  );
}

export default List;
