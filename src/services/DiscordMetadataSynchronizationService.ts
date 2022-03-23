import { Client } from "discord.js";
import { scheduleJob, Job } from "node-schedule";
import { IDiscordUser } from "../models/discord-user";
import { RoleMap } from "../models/roles";
import { AzMogaUsersService } from "./AzMogaUsersService";
import { UserStoreService } from "./UserStoreService";

export class DiscordMetadataSynchronizationService {
    private _job: Job;

    constructor(
        private userStoreService: UserStoreService,
        private userService: AzMogaUsersService,
        private client: Client
    ) {
        this._job = scheduleJob("sync-users", "*/10 * * * *", function (this: DiscordMetadataSynchronizationService) {
            this.synchronizeAllMetadata();
        }.bind(this))
    }

    async synchronizeAllMetadata() {
        const users = await this.userStoreService.readAllUsers();

        for (const user of users) {
            if (!user) {
                continue;
            }

            await this.synchronizeUserMetadata(user);
        }
    }

    async synchronizeUserMetadata(user: IDiscordUser) {
        const target = await this.userService.find(user.phone, user.email);
        if (!target) {
            return;
        }
        const guild = this.client.guilds.cache.find(g => g.id === process.env.AZ_MOGA_SERVER_ID);
        if (!guild) {
            console.warn('[WARN] Could not resolve Az-Moga guild')
            return;
        }
        const targetDiscordUser = await this.userStoreService.readForUser(target);
        if (!targetDiscordUser) {
            return;
        }
        const guildMember = guild.members.cache.find(u => u.id === targetDiscordUser.discordId);
        if (!guildMember) {
            return;
        }

        const targetRoleNames = RoleMap.exec(target);
        // these are the roles we shouldnt modify
        const allMemberRoles = guildMember.roles.valueOf();
        const restrictedRoles = allMemberRoles.filter(role => RoleMap.allowedRoles.indexOf(role.name) === -1);
        // there are the roles we need to add
        const targetRoles = guild.roles.cache.filter(role => targetRoleNames.has(role.name));

        const roleUpdateMap: Record<string, boolean> = targetRoles.reduce((aggr, current) => {
            aggr[current.id] = true;
            return aggr;
        }, {} as Record<string, boolean>);

        allMemberRoles.forEach(role => {
            roleUpdateMap[role.id] =
                Boolean(restrictedRoles.find(r => r.id === role.id)) ||
                Boolean(targetRoles.find(r => r.id === role.id)) ||
                false;
        })

        // tired
        const keys = Object.keys(roleUpdateMap);
        for (const roleId of keys) {
            const role = guildMember.roles.cache.find(r => r.id === roleId);
            try {
                if (roleUpdateMap[roleId] && role) {
                    continue;
                }
                if (roleUpdateMap[roleId] && !role) {
                    const targetRole = targetRoles.get(roleId);

                    if (targetRole) {
                        await guildMember.roles.add(targetRole);
                    }

                    continue;
                }

                if (role) {
                    await guildMember.roles.remove(role);
                }
            } catch (e) {
                console.error(e);
            }
        }

        try {
            await guildMember.setNickname(target.fullName);
        } catch (e) {
            console.error(e);
        }
    }
}