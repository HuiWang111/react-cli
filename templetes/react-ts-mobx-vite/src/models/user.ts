import { IUser } from 'types'

export class User implements IUser {
    id: number;
    name: string;
    username: string;
    email: string;

    constructor(user: IUser) {
        this.email = user.email
        this.name = user.name
        this.id = user.id
        this.username = user.username
    }
}