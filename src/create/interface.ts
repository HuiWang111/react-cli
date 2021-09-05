export type StateManagement = 'Mobx' | 'Redux';

export type Platform = 'React-DOM' | 'React-Native';

export interface Project {
    create: () => Promise<void>;
}