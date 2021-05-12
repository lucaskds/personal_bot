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
    response = participants.map((participant) => {
        return `${participant.username} | Honor: ${participant.honor} | Rank: ${participant.rank} | Completed: ${participant.completed}`
    })
    ctx.reply(`DASHBOARD\n${response.join("\n")}`)
}

const mystatus = async(ctx) => {
    const from = ctx.update.message.from
    const mapping = JSON.parse(process.env.PARTICIPANTS_MAPPING)
    participant = mapping[from.username]
    const cw_user = await codeWarsClient.getUserInfo(participant)
    ctx.reply(`${participant}\nHonor: ${cw_user.honor}\nRank: ${cw_user.rank}\nCompleted: ${cw_user.completed}`)
}

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('start', start)
bot.command('dashboard', dashboard)
bot.command('mystatus', mystatus)

module.exports = bot;