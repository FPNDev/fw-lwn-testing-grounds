import { UserData } from "./interface/user";

interface UserDataWithAuth {
    auth: Credentials;
    user: UserData;
}

interface Credentials {
    login: string;
    password: string;
}

const Users: UserDataWithAuth[] = [
    {
        auth: {
            login: 'admin',
            password: '123456'
        },
        user: {
            name: "Petro",
            surname: "Fesiuk"
        }
    }
]

export class AuthStorage {
    getByCredentials(credentials: Credentials) {
        return Users.find(u => JSON.stringify(u.auth) === JSON.stringify(credentials))?.user;
    }
}