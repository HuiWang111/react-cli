import { IUser } from '../types'
import { User } from '../models'
import { AppStore } from './index'
import { action, computed, observable } from 'mobx'

export class UserStore {
    
    byId = observable.map<number, User>()

    constructor(private store: AppStore) {}

    @action
    load = (users: IUser[]): void => {
        this.byId.replace(users.map(user => [user.id, new User(user)]))
    }

    @computed
    get list(): User[] {
        return Array.from(this.byId.values())
    }
}