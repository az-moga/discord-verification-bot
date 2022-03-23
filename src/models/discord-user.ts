import { IUser } from "./user";

export interface IDiscordUser extends Pick<IUser, "phone" | "email"> {
    discordId: string;
}

export class DiscordUser {
    static serialize(user: IDiscordUser) {
        return `${user.discordId}|${user.phone}|${user.email}`;
    }
    static deserialize(serializedUser: string): IDiscordUser {
        const [discordId, phone, email] = serializedUser.split("|");

        return {
            discordId,
            phone,
            email
        };
    }
}