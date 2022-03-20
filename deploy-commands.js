require('dotenv').config(); //initialize dotenv
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const { commands } = require('./custom-commands');


const token = process.env.CLIENT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.AZ_MOGA_SERVER_ID;

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);