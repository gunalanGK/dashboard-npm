export interface ConnectionPayload {
    host: string;
    user: string;
    password: string;
    database?: string;
    port: string;
}
export declare const connectToDatabase: (payload: ConnectionPayload) => Promise<any>;
export declare const disconnectToDatabase: () => Promise<any>;
