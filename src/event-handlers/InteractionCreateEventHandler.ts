import { CacheType, Interaction } from "discord.js";
import { ICommand, ICommandRegistry } from "../commands/command-registry";

export class InteractionCreateEventHandler implements ICommandRegistry {
    private _registry: Record<string, ICommand> = {};

    register(commandName: string, command: ICommand): void {
        this._registry[commandName] = command;
    }
    match(commandName: string): ICommand | undefined {
        return this._registry[commandName];
    }

    public process(interaction: Interaction<CacheType>) {
        if (!interaction.isCommand()) return;

        const command = this.match(interaction.commandName);

        if(command) {
            command.execute(interaction);
        }
    }
}