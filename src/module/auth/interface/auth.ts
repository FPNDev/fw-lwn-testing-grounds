import { UserData } from './user';

interface Credentials {
    [_key: string]: any;
}

export interface AuthServiceInterface {
    authenticate(credentials: Credentials): Promise<UserData>;
}