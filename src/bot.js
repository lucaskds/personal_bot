const { Telegraf, Markup } = require('telegraf')
const codeWarsClient = require('./codewars')
const ParticipantRepository = require('./repositories/participant');
const ModelParticipant = require('./models/participants');

const start = (ctx) => {
    const from = ctx.update.message.from
    ctx.reply(`Olá ${from.first_name}, o que você deseja fazer?`, Markup
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
    const sortedParticipants = participants.sort((a, b) => {
        if (a.honor < b.honor) return 1
        if (a.honor > b.honor) return -1
        return 0
    })

    const allMongoParticipants = await listAllParticipants(); 

    response = sortedParticipants.map((participant) => {
        const mongoParticipant = allMongoParticipants.filter(user => user.userName == participant.username);
        username = participant.username.replace(/([^a-zA-Z0-9])/, (c) => `\\${c}`)
        return `👨‍💻 ${username}\n🏆 ${participant.honor-mongoParticipant[0].startScore}  🥋 ${participant.rank}  ✅ ${participant.completed-mongoParticipant[0].completed}\n`
    })
    ctx.replyWithMarkdownV2(`📊 __*DASHBOARD*__ 📊\n\n${response.join("\n")}`)
}

const mystatus = async(ctx) => {
    const from = ctx.update.message.from
    const mapping = JSON.parse(process.env.PARTICIPANTS_MAPPING)
    participant = mapping[from.username]
    if (!participant) {
        ctx.replyWithMarkdownV2(`Opa ${from.first_name}, parece que você não está participando do desafio\\.\\.\\. 😢\n[Lucas](tg://user?id=${process.env.MY_USER_ID}) corre aqui\\! 🏃‍♂️`)
        return
    }

    const allMongoParticipants = await listAllParticipants(); 
    
    const cw_user = await codeWarsClient.getUserInfo(participant);

    const userThatCall = await allMongoParticipants.filter(user => user.userName == cw_user.username);

    ctx.replyWithMarkdownV2(`🏅 __*${participant}*__ 🏅\n🏆 _*Score:*_ _${cw_user.honor - userThatCall[0].startScore}_\n🥋 _*Rank:*_ _${cw_user.rank}_\n✅ _*Completed:*_ _${cw_user.completed - userThatCall[0].completed}_`)
}

const listAllParticipants = async () => {
    const participantRepo = new ParticipantRepository(ModelParticipant);
    const listOfParticipants = await participantRepo.list();
    return listOfParticipants;
}

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('start', start)
bot.command('dashboard', dashboard)
bot.command('mystatus', mystatus)

module.exports = bot;