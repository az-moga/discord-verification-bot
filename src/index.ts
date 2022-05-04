import { config } from 'dotenv';
import { Client, Intents } from 'discord.js';
import { ClientReadyEventHandler } from './event-handlers/ClientReadyEventHandler';
import { InteractionCreateEventHandler } from './event-handlers/InteractionCreateEventHandler';
import deployCommands, { adjustCommandRoles } from './commands/deploy-commands';
import { PingMeCommand } from './commands/PingMeCommand';
import { MessageCreateEventHandler } from './event-handlers/MessageCreateEventHandler';
import { PING_COMMAND_NAME, VALIDATE_ME_COMMAND_NAME } from './commands/custom-commands';
import appCache from './app-cache';
import { ValidateMeCommand } from './commands/ValidateMeCommand';
import { AzMogaUsersService } from './services/AzMogaUsersService';
import { UserStoreService } from './services/UserStoreService';
import { DiscordMetadataSynchronizationService } from './services/DiscordMetadataSynchronizationService';
import path from 'path';

const dotnenvConfigPath = path.join(__dirname, ".env");
console.log('dotnenvConfigPath', dotnenvConfigPath);
config({path: dotnenvConfigPath});

const bootstrap = async () => {
    // await deployCommands();
    // await adjustCommandRoles();
}

bootstrap().then(() => {
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES] });
    const userService = new AzMogaUsersService();
    const userStoreService = new UserStoreService();
    const metadataSyncService = new DiscordMetadataSynchronizationService(userStoreService, userService, client);

    const clientReadyHandler = new ClientReadyEventHandler();
    const interactionCreateHandler = new InteractionCreateEventHandler();
    const messageCreateHandler = new MessageCreateEventHandler(appCache);

    interactionCreateHandler.register(PING_COMMAND_NAME, new PingMeCommand());
    interactionCreateHandler.register(VALIDATE_ME_COMMAND_NAME, new ValidateMeCommand(
        messageCreateHandler,
        userService,
        userStoreService,
        metadataSyncService
    )
    );

    client.on('ready', clientReadyHandler.process.bind(clientReadyHandler));
    client.on('interactionCreate', interactionCreateHandler.process.bind(interactionCreateHandler));
    client.on('messageCreate', messageCreateHandler.process.bind(messageCreateHandler))

    //make sure this line is the last line
    client.login(process.env.CLIENT_TOKEN); //login bot using token}
})