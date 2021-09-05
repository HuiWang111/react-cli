export interface IAuthError {
    message: string;
}

export interface ICurrentUser {
    id: number;
    name: string;
}

export interface IAuth {
    authed: boolean;
    loading: boolean;
    user?: ICurrentUser;
    error?: IAuthError;
}

export interface ILoginData {
    username: string;
    password: string;
}