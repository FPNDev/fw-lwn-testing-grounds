import { util } from "../util";

import { AuthStorage } from "./storage";
import { AuthServiceInterface } from "./interface/auth";

interface Credentials {
    login: string;
    password: string;
}

export class AuthService implements AuthServiceInterface {
    storage = util.singleton(AuthStorage);

    async authenticate(credentials: Credentials) {
        return this.storage.getByCredentials(credentials) ?? Promise.reject();
    }
}
