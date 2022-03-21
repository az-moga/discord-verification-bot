import { Routes } from 'discord-api-types/v9';
import { REST }  from '@discordjs/rest';
import commands from './custom-commands';

const token = process.env.CLIENT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.AZ_MOGA_SERVER_ID;

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);