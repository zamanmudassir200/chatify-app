export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
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
export interface AuthState {
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    token?: string;
  };
}
