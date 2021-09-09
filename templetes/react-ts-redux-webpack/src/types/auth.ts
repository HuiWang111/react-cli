export interface IAuthError {
    message: string;
}

export interface ICurrentUser {
    id: number;
    name: string;
}

export interface IAuthState {
    isAuth: boolean;
    loading: boolean;
    currentUser?: ICurrentUser;
    error?: IAuthError;
}