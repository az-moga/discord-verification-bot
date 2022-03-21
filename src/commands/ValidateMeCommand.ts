import { CommandInteraction, CacheType, GuildMember } from "discord.js";
import { IMessageHandlerRegistry } from "../messages/message-handler-registry";
import { ICommand } from "./command-registry";

const verificationMessage = 'Здравейте! Моля въведете телефонния номер и email-a, който използвахте при регистрацията си за събитието в следния формат <телефонен-номер>:<email>. Пример: 0888123123:az-moga@tuk.sega';

export class ValidateMeCommand implements ICommand {
    constructor(private messageHandlerRegistry: IMessageHandlerRegistry) { }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        try {
            if (interaction.member instanceof GuildMember) {
                const targetUserId = interaction.member.id;
                const dmChannel = await interaction.member.createDM(true);

                this.messageHandlerRegistry.register(targetUserId, {
                    process: async message => {
                        if (message.content.split(':').length === 2) {
                            await dmChannel.send({ content: 'Верификация успешна.' });
                            await interaction.editReply({ content: 'Верификация успешна.', });

                            this.messageHandlerRegistry.unregister(targetUserId);
                        } else {
                            await dmChannel.send({ content: 'Моля опитайте отново, като спазвате формата.' });
                        }
                    }
                })

                console.log(interaction.guild?.roles.cache);
                await interaction.reply('Верификация започната...');
                await dmChannel.send({ content: verificationMessage });
            }
        } catch (error) {
            console.log(error);
        }
    }

}