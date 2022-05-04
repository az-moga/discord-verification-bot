import { REST } from '@discordjs/rest';
import { RESTGetAPIApplicationGuildCommandsResult, Routes } from 'discord-api-types/v9';
import commands, { INFO_COMMAND_NAME, NOTIFY_USERS_COMMAND_NAME } from './custom-commands';
import { Client } from "discord.js";

const adminOnlyCommands = [INFO_COMMAND_NAME]

const deployCommands = async () => {
    const token = process.env.CLIENT_TOKEN;
    console.log('CLIENT_TOKEN', token);
    const clientId = process.env.CLIENT_ID;
    console.log('CLIENT_ID', clientId);
    const guildId = process.env.AZ_MOGA_SERVER_ID;
    console.log('AZ_MOGA_SERVER_ID', guildId);
    const rest = new REST({ version: '9' }).setToken(token);

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}

export const adjustCommandRoles = async (client: Client) => {
    const token = process.env.CLIENT_TOKEN;
    console.log('CLIENT_TOKEN', token);
    const clientId = process.env.CLIENT_ID;
    console.log('CLIENT_ID', clientId);
    const guildId = process.env.AZ_MOGA_SERVER_ID;
    console.log('AZ_MOGA_SERVER_ID', guildId);
    const adminRoleIds = process.env.AZ_MOGA_ADMIN_ROLE_IDS.split(',');
    console.log('AZ_MOGA_ADMIN_ROLE_IDS', process.env.AZ_MOGA_ADMIN_ROLE_IDS);
    const rest = new REST({ version: '9' }).setToken(token);

    try {
        const commands = await rest.get(Routes.applicationGuildCommands(clientId, guildId)) as RESTGetAPIApplicationGuildCommandsResult;
        const fullPermissions = commands
            .filter(c => adminOnlyCommands.indexOf(c.name) != - 1)
            .map(c => {
                return {
                    id: c.id,
                    permissions: adminRoleIds.map(roleId => (
                        {
                            "id": roleId,
                            "type": 1,
                            "permission": true
                        }
                    ))
                };
            });

        await client.guilds.cache.get(guildId)?.commands?.permissions.set({ fullPermissions });
    } catch (error) {
        console.error(error);
    }
}

export default deployCommands;