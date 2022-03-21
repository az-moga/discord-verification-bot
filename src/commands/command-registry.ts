import { CacheType, CommandInteraction } from "discord.js";

export interface ICommandRegistry {
    register(commandName: string, command: ICommand): void;
    match(commandName: string): ICommand | undefined;
}

export interface ICommand {
    execute(interaction: CommandInteraction<CacheType>): Promise<void>;
}