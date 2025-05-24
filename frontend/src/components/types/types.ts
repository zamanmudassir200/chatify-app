export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  consent: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: {
    isoCode: string;
    countryCode: string;
    internationalNumber: string;
  };
  profilePic?: string;
  role: string;
  consent: boolean;
}
export interface LoginForm {
  email: string;
  password: string;
}
export interface AddIntoChat {
  userId: string;
}
export interface SearchUser {
  email: string;
  name: string;
}
export interface Message {
  sender: string;
  content: string;
  chat: string;
}
export interface Messages {
  sender: User;
  content: string;
  createdAt: Date;
  chat: Chat;
  _id: string;
  isEdited: boolean;
}
export interface MessagesProps {
  sender: string;
  content: string;
  chatId: string;
}
export interface AuthState {
  message: string;
  user?: User;
  chat: Chat;
}
export interface UserChats {
  chats: string[];
}
export interface Chat {
  _id: string;
  chatName: string;
  users: User[];
  isGroupChat: boolean;
  latestMessage: string;
  groupAdmin: User;
}
export interface AddIntoGroupChat {
  userIds: string[];
  chatId: string;
}
export interface RemoveFromGroupChat {
  userId: string;
  chatId: string;
}
export interface RenameGroupChat {
  chatName: string;
  chatId: string;
}
export interface GroupChat {
  chatName: string;
  users: string[];
}

export interface RenameChat {
  chatId: string;
  chatName: string;
}

export interface EditMessage {
  messageId: string;
  content: string;
}
