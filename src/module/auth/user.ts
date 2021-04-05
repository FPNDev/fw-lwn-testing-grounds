import { EventPipe } from "fe-lwn";
import { util } from "../util";
import { UserData } from "./interface/user";

interface UserConstructor {
    uuidField?: string;
}

export class User {
    private _authenticated: boolean = false;
    private _userData: UserData;

    private _userDataChanges = new Map();

    private _uuidField: string;

    readonly $dataChange = new EventPipe();
    readonly $auth = new EventPipe();
    readonly $deauth = new EventPipe();
    readonly $revert = new EventPipe();

    constructor({ 
        uuidField = 'id' 
    }: UserConstructor = { uuidField: 'id' }) {
        this._uuidField = uuidField;
    }

    get uuid(): number {
        return this.authenticated && this._userData[this._uuidField];
    }
    get authenticated(): boolean {
        return this._authenticated;
    }

    get data(): UserData {
        return this._authenticated && !!this._userData && new Proxy(this._userData, {
            set: (target: any, propertyKey: string, value: any) => {
                const oldValue = target[propertyKey];
                if (oldValue !== value) {
                    target[propertyKey] = value;
                    if (target === this._userData) {
                        if (!this._userDataChanges.has(propertyKey)) {
                            this._userDataChanges.set(propertyKey, oldValue);
                        } else if (this._userDataChanges.get(propertyKey) === value) {
                            this._userDataChanges.delete(propertyKey);
                        }

                        this.$dataChange({propertyKey, value, data: this.data});
                    }
                }

                return true;
            }
        });
    }

    get changes() {
        return [...this._userDataChanges.entries()].reduce((a, b) => ({ ...a, [b[0]]: b[1] }), {});
    }

    auth(userData: UserData): Promise<User> {
        if (this.authenticated) {
            this.deauth();
        }

        let identity = util.smart(userData);

        if (!(this._uuidField in userData)) {
            return Promise.reject(
                `Invalid identity: field ${this._uuidField} does not exist on type { ${identity.entries().map(e => `${e[0]}: ${typeof e[1]}`)} }`
            );
        }

        this._userData = userData;
        this._authenticated = true;

        this.$auth({ uuid: this.uuid, data: this.data });

        return Promise.resolve(this);
    }

    deauth() {
        this._userData = null;
        this._authenticated = false;

        this.$deauth({ uuid: this.uuid, data: this.data });
    }

    revert() {
        if (!this.authenticated) {
            return;
        }

        const lastState = util.keys(this.changes).reduce((a, b) => ({ ...a, [b]: this.data[b] }), {});
        for (const change of this._userDataChanges.entries()) {
            this.data[change[0]] = change[1];
        }

        this.$revert({ uuid: this.uuid, data: this.data, lastState });
    }
}