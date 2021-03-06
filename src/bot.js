const { Telegraf, Markup } = require('telegraf')
const codeWarsClient = require('./codewars')
const ParticipantRepository = require('./repositories/participant');
const ModelParticipant = require('./models/participants');

const start = (ctx) => {
    const from = ctx.update.message.from
    ctx.reply(`Olรก ${from.first_name}, o que vocรช deseja fazer?`, Markup
        .keyboard(['/dashboard', '/mystatus'])
        .oneTime()
        .resize()
    )
}

const dashboard = async(ctx) => {
    const mapping = JSON.parse(process.env.PARTICIPANTS_MAPPING)
    const participants = []
    for (participant of Object.values(mapping)) {
        participants.push(await codeWarsClient.getUserInfo(participant))
    }

    const allMongoParticipants = await listAllParticipants(); 

    const actualParticipantsScore = participants.map(participant => {
        const mongoParticipant = allMongoParticipants.find(user => user.userName == participant.username);
        const honor = participant.honor - mongoParticipant.startScore
        const completed = participant.completed - mongoParticipant.completed;
        return {
            username: participant.username,
            honor: honor,
            rank: participant.rank,
            completed: completed
        }
    });


    const sortedParticipants = actualParticipantsScore.sort((a, b) => {
        if (a.honor < b.honor) return 1
        if (a.honor > b.honor) return -1
        if (a.honor == b.honor) return a.completed - b.completed
        return 0
    })


    response = sortedParticipants.map((participant) => {
        username = participant.username.replace(/([^a-zA-Z0-9])/, (c) => `\\${c}`)
        return `๐จโ๐ป ${username}\n๐ ${participant.honor}  ๐ฅ ${participant.rank}  โ ${participant.completed}\n`
    })
    ctx.replyWithMarkdownV2(`๐ __*DASHBOARD*__ ๐\n\n${response.join("\n")}`)
}

const mystatus = async(ctx) => {
    const from = ctx.update.message.from
    const mapping = JSON.parse(process.env.PARTICIPANTS_MAPPING)
    participant = mapping[from.username]
    if (!participant) {
        ctx.replyWithMarkdownV2(`Opa ${from.first_name}, parece que vocรช nรฃo estรก participando do desafio\\.\\.\\. ๐ข\n[Lucas](tg://user?id=${process.env.MY_USER_ID}) corre aqui\\! ๐โโ๏ธ`)
        return
    }

    const cw_user = await codeWarsClient.getUserInfo(participant);

    const participantMongo = await getUser(cw_user.username); 

    ctx.replyWithMarkdownV2(`๐ __*${participant}*__ ๐\n๐ _*Score:*_ _${cw_user.honor - participantMongo.startScore}_\n๐ฅ _*Rank:*_ _${cw_user.rank}_\nโ _*Completed:*_ _${cw_user.completed - participantMongo.completed}_`)
}

const listAllParticipants = async () => {
    const participantRepo = new ParticipantRepository(ModelParticipant);
    return participantRepo.list();
}

const getUser = async (userName) => {
    const participantRepo = new ParticipantRepository(ModelParticipant);
    return participantRepo.findUser(userName);
}

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('start', start)
bot.command('dashboard', dashboard)
bot.command('mystatus', mystatus)

module.exports = bot;