export const Host = "http://localhost:3005";

const Auth_Route = `${Host}/api/auth`
const Message_Route = `${Host}/api/message`
export const check_user_route = `${Auth_Route}/check-user`
export const OnBOARD_USER_ROUTE = `${Auth_Route}/onboard-user`
export const GET_ALL_CONTACTS = `${Auth_Route}/get-contacts`
export const GET_CALL_TOKEN = `${Auth_Route}/generate-token`;

export const ADD_MESSAGE_ROUTE = `${Message_Route}/add-message`
export const GET_MESSAGES_ROUTE = `${Message_Route}/get-messages`
export const ADD_IMAGE_MESSAGE_ROUTE = `${Message_Route}/add-image-message`
export const ADD_AUDIO_MESSAGE_ROUTE = `${Message_Route}/add-audio-message`
export const GET_INITIAL_CONTACTS_ROUTE = `${Message_Route}/get-initial-contacts`;

