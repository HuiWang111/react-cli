import { HttpError } from '@/utils/index'
import { AxiosInstance } from 'axios'
import { AppStore } from '@/stores/index'

export class UserApi {
    constructor(
        private httpClient: AxiosInstance,
        private store: AppStore
    ) {}
}