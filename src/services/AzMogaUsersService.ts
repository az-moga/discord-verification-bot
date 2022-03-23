import { IUser } from "../models/user";
import { Job, scheduleJob } from 'node-schedule';
import fetch from 'node-fetch';

export class AzMogaUsersService {
    private _userCache: IUser[];
    private _job: Job;

    constructor() {
        this._userCache = [];

        this.populateCache();
        this._job = scheduleJob("sync-users", "* * * * *", function (this: AzMogaUsersService) {
            this.populateCache();
        }.bind(this))
    }

    // TODO sync job
    async fetch(): Promise<IUser[]> {
        return this._userCache;
    }

    find(phone: string, email: string) {
        return this._userCache.find(u => u.phone === phone && u.email === email);
    }

    private async populateCache() {
        //do a call to the service
        try {
            const response = await fetch(process.env.AZ_MOGA_ROLES_ENDPOINT, {
                headers: { 'Content-Type': 'application/json' }
            });
            // hacky stuff to make it the desired format
            const text = (await response.text())
                .replaceAll(`\n`, '')
                .replaceAll(`\r`, '')
                .replace(']},]}', ']} ]}');
            const result = JSON.parse(text);

            this._userCache = result.data;
        } catch (e) {
            console.error(e)
        }
    }

    dispose() {
        this._job.cancel(false);
    }
}

