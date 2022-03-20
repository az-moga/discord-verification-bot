const { SlashCommandBuilder } = require('@discordjs/builders');

const VALIDATE_ME_COMMAND_NAME = 'валидирай-ме';
const PING_COMMAND_NAME = 'ping';

const commands = [
    new SlashCommandBuilder().setName(PING_COMMAND_NAME).setDescription('Check if the server is online!'),
    new SlashCommandBuilder().setName(VALIDATE_ME_COMMAND_NAME).setDescription('Стартира процеса по валидация'),
]
    .map(command => command.toJSON());

module.exports = {
    VALIDATE_ME_COMMAND_NAME,
    PING_COMMAND_NAME,
    commands
}