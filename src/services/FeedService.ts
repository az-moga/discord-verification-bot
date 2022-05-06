import { Client, TextChannel } from "discord.js";

export class FeedService {
    private channel?: TextChannel;
    constructor(
        client: Client
    ) {
        // TODO need to dispose this
        client.on('ready', this.bootstrap.bind(this));
    }

    async bootstrap(client: Client<true>) {
        let channel = client.channels.cache.find(c => c.id === process.env.FEED_CHANNEL_ID);
        if(this.channel?.isText() !== true) {
            throw new Error("Unsupported feed channel");
        }

        this.channel = <TextChannel>channel;
    }

    async message(message: string) {
        try {
            return this.channel?.send(message);
        } catch (error) {
            console.log(`Could not produce feed - ${error}`);
        }
    }
}