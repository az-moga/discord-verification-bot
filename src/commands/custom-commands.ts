import { SlashCommandBuilder }  from '@discordjs/builders';

export const VALIDATE_ME_COMMAND_NAME = 'валидирай-ме';
export const PING_COMMAND_NAME = 'ping';

const commands = [
    new SlashCommandBuilder().setName(PING_COMMAND_NAME).setDescription('Проверка дали сървъра е онлайн.'),
    new SlashCommandBuilder().setName(VALIDATE_ME_COMMAND_NAME).setDescription('Стартира процеса по валидация.'),
]
    .map(command => command.toJSON());

export default commands;