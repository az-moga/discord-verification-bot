require('dotenv').config(); //initialize dotenv
const { Client, Intents } = require('discord.js');
const { PING_COMMAND_NAME, VALIDATE_ME_COMMAND_NAME } = require('./custom-commands');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const directMessageHandlers = {};
const registerVerificationHandler = (userId, handler) => {
    directMessageHandlers[userId] = handler;
}
const unregisterVerificationHandler = (userId) => {
    delete directMessageHandlers[userId];
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === PING_COMMAND_NAME) {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === VALIDATE_ME_COMMAND_NAME) {
        try {
            const targetUserId = interaction.member.id;
            const intr = interaction;

            const dmChannel = await intr.member.createDM(true);
            await intr.reply('Процедурата по регистрация стартирана');
            await dmChannel.send({ content: 'Здравейте! Моля въведете телефонния номер и email-a, който използвахте при регистрацията си за събитието в следния формат <телефонен-номер>:<email>.' });


            registerVerificationHandler(targetUserId, async msg => {
                console.log(msg.content);

                // TODO - validate
                if (msg.content.split(':').length === 2) {
                    await dmChannel.send({ content: 'Регистрацията беше успешна.' });
                    await intr.editReply({ content: 'Процедурата по регистрация успешна',  });

                    unregisterVerificationHandler(targetUserId);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author && message.author.bot === false && message.channel.type === 'DM') {
        const handler = directMessageHandlers[message.author.id];

        if (handler) {
            handler(message);
        }
    }
})

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token