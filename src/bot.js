const { Telegraf, Markup } = require('telegraf')
const codeWarsClient = require('./codewars')

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
    response = sortedParticipants.map((participant) => {
        username = participant.username.replace(/([^a-zA-Z0-9])/, (c) => `\\${c}`)
        return `👨‍💻 ${username}\n🏆 ${participant.honor}  🥋 ${participant.rank}  ✅ ${participant.completed}\n`
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
    const cw_user = await codeWarsClient.getUserInfo(participant)
    ctx.replyWithMarkdownV2(`🏅 __*${participant}*__ 🏅\n🏆 _*Honor:*_ _${cw_user.honor}_\n🥋 _*Rank:*_ _${cw_user.rank}_\n✅ _*Completed:*_ _${cw_user.completed}_`)
}

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('start', start)
bot.command('dashboard', dashboard)
bot.command('mystatus', mystatus)

module.exports = bot;