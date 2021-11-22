export interface Creatable {
    create: () => Promise<void>;
}