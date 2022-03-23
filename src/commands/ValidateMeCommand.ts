import { CommandInteraction, CacheType, GuildMember } from "discord.js";
import { IMessageHandlerRegistry } from "../messages/message-handler-registry";
import { IDiscordUser } from "../models/discord-user";
import { AzMogaUsersService } from "../services/AzMogaUsersService";
import { DiscordMetadataSynchronizationService } from "../services/DiscordMetadataSynchronizationService";
import { UserStoreService } from "../services/UserStoreService";
import { ICommand } from "./command-registry";

const verificationMessage = 'Здравейте! Моля въведете телефонния номер и email-a, който използвахте при регистрацията си за събитието в следния формат <телефонен-номер>:<email>. Пример: 0888123123:az-moga@tuk.sega';

export class ValidateMeCommand implements ICommand {
    constructor(
        private messageHandlerRegistry: IMessageHandlerRegistry, 
        private userService: AzMogaUsersService,
        private userStoreService: UserStoreService,
        private metadataService: DiscordMetadataSynchronizationService
    ) { }

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        try {
            await interaction.deferReply();
            if (interaction.member instanceof GuildMember) {
                const targetUserId = interaction.member.id;
                const dmChannel = await interaction.member.createDM(true);

                const discordUser = await this.userStoreService.readForDiscordId(targetUserId);

                if(discordUser) {
                    await this.metadataService.synchronizeUserMetadata(discordUser);
                    await interaction.editReply('Няма нужда от верификация.');
                    return;
                }

                this.messageHandlerRegistry.register(targetUserId, {
                    process: async message => {
                        debugger;
                        const [phone, email] = message.content.split(':');
                        const user = await this.userService.find(phone, email);

                        if (user) {
                            const discordUser: IDiscordUser = { ...user, discordId: targetUserId };
                            await this.userStoreService.write(discordUser);
                            await this.metadataService.synchronizeUserMetadata(discordUser);

                            await dmChannel.send({ content: 'Верификация успешна.' });
                            await interaction.followUp({ content: 'Верификация успешна.' });

                            this.messageHandlerRegistry.unregister(targetUserId);
                        } else {
                            await dmChannel.send({ content: 'Моля опитайте отново, като спазвате формата.' });
                        }
                    }
                })

                // console.log(interaction.guild?.roles.cache);
                await interaction.editReply('Верификация започната...');
                await dmChannel.send({ content: verificationMessage });
            }
        } catch (error) {
            console.log(error);
        }
    }

}