import { DiscordUser, IDiscordUser } from "../models/discord-user";
import { IUser } from "../models/user";
import fs from 'fs/promises';
import path from 'path';


export class UserStoreService {
    private userFileDirectory = "user-data";

    constructor() {
        fs.mkdir(this.userFileDirectory).then(
            () => {
            fs.mkdir(path.join(this.userFileDirectory, 'byPhone'), { recursive: true });
            fs.mkdir(path.join(this.userFileDirectory, 'byDiscordId'), { recursive: true });
        }, (e) => console.warn(e));
    }

    async readForUser(user: IUser): Promise<IDiscordUser | null> {
        try {
            const discordUser = await fs.readFile(path.join(this.userFileDirectory, 'byPhone', user.phone));
            return DiscordUser.deserialize(discordUser.toString());
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async readForDiscordId(discordId: string): Promise<IDiscordUser | null> {
        try {
            const discordUser = await fs.readFile(path.join(this.userFileDirectory, 'byDiscordId', discordId));
            return DiscordUser.deserialize(discordUser.toString());
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async write(user: IDiscordUser) {
        const serializedUser = DiscordUser.serialize(user);
        await fs.writeFile(path.join(this.userFileDirectory, 'byPhone', user.phone), serializedUser);
        await fs.writeFile(path.join(this.userFileDirectory, 'byDiscordId', user.discordId), serializedUser);
    }

    private async readDirectory() {
        try {
            return await fs.readdir(path.join(this.userFileDirectory, 'byDiscordId'));
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async readAllUsers() {
        const files = await this.readDirectory();

        const fileContentPromises = files.map(dId => this.readForDiscordId(dId));

        return await Promise.all(fileContentPromises);
    }
}