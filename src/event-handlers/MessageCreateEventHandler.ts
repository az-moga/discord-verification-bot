import { Message } from "discord.js";
import { IMessageHandler, IMessageHandlerRegistry } from "../messages/message-handler-registry";
import { ApplicationCache } from "../app-cache";

export class MessageCreateEventHandler implements IMessageHandlerRegistry
{
    constructor(private expirationRegistry: ApplicationCache) { }

    register(key: string, messageHandler: IMessageHandler): void {
        this.expirationRegistry.add(key, messageHandler);
    }
    unregister(messageKey: string): void {
        this.expirationRegistry.expire(messageKey);
    }
    match(key: string): IMessageHandler | undefined {
        return this.expirationRegistry.get<IMessageHandler>(key);
    }

    public process(message: Message<boolean>) {
        if(!message.author) {
            return;
        }

        if(!message.author.bot) {
            return;
        }

        if(message.channel.type !== 'DM') {
            return;
        }

        const handler = this.match(message.author.id);

        if(handler) {
            handler.process(message);
        }
    }
}