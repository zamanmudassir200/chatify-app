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
export interface AuthState {
  message: string;
  user?: User;
  chat: Chat;
}
export interface Chat {
  _id: string;
  chatName: string;
  users: User;
  isGroupChat: boolean;
  latestMessage: string;
  groupAdmin: string;
}
