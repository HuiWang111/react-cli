export type StateManagement = 'Mobx' | 'Redux';

export type Platform = 'React-DOM' | 'React-Native';

export interface Creatable {
    create: () => Promise<void>;
}