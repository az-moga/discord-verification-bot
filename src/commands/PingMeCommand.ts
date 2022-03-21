import { CommandInteraction, CacheType } from "discord.js";
import { ICommand } from "./command-registry";

export class PingMeCommand implements ICommand
{
    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        await interaction.reply('Здрасти!');
    }
}