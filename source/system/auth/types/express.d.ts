declare namespace Express {
    export interface Request {
        decoded: any;
        token: string;
    }
}