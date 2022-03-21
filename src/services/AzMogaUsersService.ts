import { IUser } from "../models/user";
import userData from "../.data/sample-response.json";
import { Job, scheduleJob } from 'node-schedule';

export class AzMogaUsersService {
    private _userCache: IUser[];
    private _job: Job;

    constructor() {
        this._userCache = [];

        this._job = scheduleJob("sync-users", "*/1 * * * *", function(this: AzMogaUsersService) {
            this.populateCache();
        }.bind(this))
    }

    // TODO sync job
    async fetch(): Promise<IUser[]> {
        return this._userCache;
    }

    private async populateCache() {
        //do a call to the service
        this._userCache = userData.data;
    }

    dispose() {
        this._job.cancel(false);
    }
}

