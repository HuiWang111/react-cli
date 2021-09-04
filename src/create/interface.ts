export type StateManagement = 'Mobx' | 'Redux';

export type DevEnv = 'React-DOM' | 'React-Native';

export interface Project {
    create: () => Promise<void>;
}