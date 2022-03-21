import { config } from 'dotenv'; 
import { Client, Intents } from 'discord.js';
import { ClientReadyEventHandler } from './event-handlers/ClientReadyEventHandler';
import { InteractionCreateEventHandler } from './event-handlers/InteractionCreateEventHandler';
import { PingMeCommand } from './commands/PingMeCommand';
import { MessageCreateEventHandler } from './event-handlers/MessageCreateEventHandler';
import { PING_COMMAND_NAME, VALIDATE_ME_COMMAND_NAME }  from './commands/custom-commands';
import appCache from './app-cache';
import { ValidateMeCommand } from './commands/ValidateMeCommand';

config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES] });

const clientReadyHandler = new ClientReadyEventHandler();
const interactionCreateHandler = new InteractionCreateEventHandler();
const messageCreateHandler = new MessageCreateEventHandler(appCache);

interactionCreateHandler.register(PING_COMMAND_NAME, new PingMeCommand());
interactionCreateHandler.register(VALIDATE_ME_COMMAND_NAME, new ValidateMeCommand(messageCreateHandler));

client.on('ready', clientReadyHandler.process.bind(clientReadyHandler));
client.on('interactionCreate', interactionCreateHandler.process);
client.on('messageCreate', messageCreateHandler.process)

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token