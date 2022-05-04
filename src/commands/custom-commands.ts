import { SlashCommandBuilder } from '@discordjs/builders';

export const VALIDATE_ME_COMMAND_NAME = 'валидирай-ме';
export const PING_COMMAND_NAME = 'ping';
export const INFO_COMMAND_NAME = 'info';
export const VERIFICATION_INFO_COMMAND_NAME = 'verification';
export const NOTIFY_USERS_COMMAND_NAME = 'notify';
export const EVERYONE_NOTIFY_USERS_COMMAND_NAME = 'everyone';
export const ONLY_NOTIFY_USERS_COMMAND_NAME = 'only';

const pingCommand = new SlashCommandBuilder().setName(PING_COMMAND_NAME).setDescription('Проверка дали сървъра е онлайн.');
const validateMeCommand = new SlashCommandBuilder().setName(VALIDATE_ME_COMMAND_NAME).setDescription('Стартира процеса по валидация.');
const infoCommand = new SlashCommandBuilder()
    .setName(INFO_COMMAND_NAME)
    .setDescription('Информация относно сървъра.')
    .setDefaultPermission(false);

infoCommand.addSubcommand(command =>
    command
        .setName(VERIFICATION_INFO_COMMAND_NAME)
        .setDescription('Статус на верифицираните потребители в сървъра.')
);

// const notifyUsers = new SlashCommandBuilder()
//     .setName(NOTIFY_USERS_COMMAND_NAME)
//     .setDescription('Изпрати съобщение до потребители.')
//     .setDefaultPermission(false);

// notifyUsers.addSubcommand(command => 
//     command
//         .setName(EVERYONE_NOTIFY_USERS_COMMAND_NAME)
//         .setDescription('Съобщение до всички'));
// notifyUsers.addSubcommand(command => 
//     command
//         .setName(ONLY_NOTIFY_USERS_COMMAND_NAME)
//         .setDescription('Съобщение до определени потребители'));
        

const commands = [
    pingCommand,
    validateMeCommand,
    infoCommand,
    // notifyUsers
]
    .map(command => command.toJSON());

export default commands;