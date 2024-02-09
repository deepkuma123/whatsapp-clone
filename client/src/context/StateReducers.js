import { reducercases } from "./constants";

export const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  messages: [],
  socket: undefined,
  messagesSearch: false,
  userContacts: [],
  OnlineUsers: [],
  filteredContacts: [],
  videoCall: undefined,
  voiceCall: undefined,
  incomingVoiceCall: undefined,
  incomingVideoCall: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducercases.SET_USER_INFO: {
      console.log({ userInfo: action.userInfo });
      return {
        ...state,
        userInfo: action.userInfo,
      };
    }
    case reducercases.SET_NEW_USER:
      return {
        ...state,
        newUser: action.newUser,
      };
    case reducercases.SET_ALL_CONTACT_PAGE:
      return {
        ...state,
        contactsPage: !state.contactsPage,
      };

    case reducercases.CHANGE_CURRENT_CHAT_USER:
      return {
        ...state,
        currentChatUser: action.user,
      };
    case reducercases.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case reducercases.SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    case reducercases.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.newMessage],
      };
    case reducercases.SET_MESSAGE_SEARCH:
      return {
        ...state,
        messagesSearch: !state.messagesSearch,
      };
    case reducercases.SET_USER_CONTACTS:
      return {
        ...state,
        userContacts: action.userContacts,
      };
    case reducercases.SET_ONLINE_USERS:
      return {
        ...state,
        OnlineUsers: action.OnlineUsers,
      };
    case reducercases.SET_CONTACT_SEARCH:
      const filteredContacts = state.userContacts.filter((contact) =>
        contact.name.toLowerCase().includes(action.contactSearch.toLowerCase())
      );
      return {
        ...state,
        contactSearch: action.contactSearch,
        filteredContacts,
      }
    case reducercases.SET_VIDEO_CALL:
      return {
        ...state,
        videoCall : action.videoCall
      }
    case reducercases.SET_VOICE_CALL:
      return {
        ...state,
        voiceCall : action.voiceCall
      }

    case reducercases.SET_INCOMING_VIDEO_CALL:
      return {
        ...state,
        incomingVideoCall:action.incomingVideoCall,
      }
    case reducercases.SET_INCOMING_VOICE_CALL:
      return {
        ...state,
        incomingVoiceCall:action.incomingVoiceCall,
      }
    
    case reducercases.END_CALL:
      return {
        ...state,
        voiceCall:undefined,
        videoCall:undefined,
        incomingVideoCall:undefined,
        incomingVoiceCall:undefined,
        
      }
    default:
      return state;
  }
};

export default reducer;
