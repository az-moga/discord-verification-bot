import { Message } from "discord.js";

export interface IMessageHandler {
    process(message: Message<boolean>): Promise<void>;
}

export interface IMessageHandlerRegistry {
    register(messageKey: string, command: IMessageHandler, options?: { expire: boolean }): void;
    unregister(messageKey: string): void;
    match(message: string): IMessageHandler | undefined;
}