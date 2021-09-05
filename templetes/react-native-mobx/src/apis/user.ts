import { HttpError } from '../utils'
import { AxiosInstance } from 'axios'
import { AppStore } from '../stores'

export class UserApi {
    constructor(
        private httpClient: AxiosInstance,
        private store: AppStore
    ) {}
}