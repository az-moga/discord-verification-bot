import { REST } from '@discordjs/rest';
import { RESTGetAPIApplicationGuildCommandsResult, Routes } from 'discord-api-types/v9';
import commands, { INFO_COMMAND_NAME, NOTIFY_USERS_COMMAND_NAME } from './custom-commands';

const token = process.env.CLIENT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.AZ_MOGA_SERVER_ID;
const adminRoleIds = process.env.AZ_MOGA_ADMIN_ROLE_IDS.split(',');

const adminOnlyCommands = [INFO_COMMAND_NAME]
const rest = new REST({ version: '9' }).setToken(token);

const deployCommands = async () => {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}

export const adjustCommandRoles = async () => {
    const commands = await rest.get(Routes.applicationGuildCommands(clientId, guildId)) as RESTGetAPIApplicationGuildCommandsResult;

    for (var command of commands) {
        if (adminOnlyCommands.indexOf(command.name) != - 1) {
            await rest.put(Routes.applicationGuildCommand(clientId, guildId, command.id), {
                body: {
                    "permissions": adminRoleIds.map(roleId => (
                        {
                            "id": roleId,
                            "type": 1,
                            "permission": true
                        }
                    ))
                }
            })
        }
    }
}

export default deployCommands;