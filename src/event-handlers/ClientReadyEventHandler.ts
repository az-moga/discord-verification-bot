import { Client } from "discord.js";

export class ClientReadyEventHandler
{
    public process(client: Client<true>) {
        console.log(`Logged in as ${client.user.tag}!`);
    }
}