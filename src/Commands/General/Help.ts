import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('help', {
    description: 'Shows the bot commands list or shows the info of the given command',
    cooldown: 10,
    exp: 15,
    category: 'general',
    aliases: ['h'],
    usage: 'help || help [command name]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) {
            const commands = Array.from(this.handler.commands, ([command, data]) => ({
                command,
                data
            }))
            const sections = []
            const info: any = {}
            let text = `👋🏻 (💙ω💙) Konichiwa! *@${M.sender.jid.split('@')[0]}*, I'm ${
                this.client.config.name.split(' ')[0]
            }\nMy prefix is - "${this.client.config.prefix}"\n\nThe usable commands are listed below.`
            const categories: string[] = []
            const { nsfw } = await this.client.DB.getGroup(M.from)
            for (const command of commands) {
                if (command.data.config.category === 'dev') continue
                if (!nsfw && command.data.config.category === 'nsfw') continue
                if (categories.includes(command.data.config.category)) continue
                categories.push(command.data.config.category)
            }
            for (const category of categories) {
                const arr: string[] = []
                const rows: IRows[] = []
                const filteredCommands = commands.filter((command) => command.data.config.category === category)
                text += `\n\n*━━━❰ ${this.client.utils.capitalize(category)} ❱━━━*\n\n`
                filteredCommands.forEach((command) => {
                    arr.push(command.data.name)
                    rows.push({
                        title: `${this.client.config.prefix}${command.data.name}`,
                        rowId: `${this.client.config.prefix}help ${command.data.name}`
                    })
                })
                sections.push({ title: this.client.utils.capitalize(category), rows })
                info[category] = arr
                text += `\`\`\`${info[category].join(', ')}\`\`\``
            }
            text += `\n\n📕 *Note:* Use ${this.client.config.prefix}help <command_name> for more info of a specific command. Example: *${this.client.config.prefix}help haigusha*`
            return void (await this.client.sendMessage(
                M.from,
                {
                    text,
                    footer: '',
                    buttonText: 'Command List',
                    sections,
                    mentions: [M.sender.jid]
                },
                {
                    quoted: M.message
                }
            ))
        }
        const cmd = context.trim()
        const command = this.handler.commands.get(cmd.toLowerCase()) || this.handler.aliases.get(cmd.toLowerCase())
        if (!command) return void M.reply(`No command or aliases found of "${this.client.utils.capitalize(cmd)}"`)
        if (command.config.category === 'dev' && !this.client.config.mods.includes(M.sender.jid))
            return void M.reply(`No command or aliases found of "${this.client.utils.capitalize(cmd)}"`)
        let text = `*❯ Command:* ${this.client.utils.capitalize(
            command.name
        )}\n*❯ Category:* ${this.client.utils.capitalize(command.config.category)}\n`
        if (command.config.cooldown) text += `*❯ Cooldown:* ${command.config.cooldown}s\n`
        if (command.config.aliases && command.config.aliases.length > 0)
            text += `*❯ Aliases:* ${command.config.aliases.map(this.client.utils.capitalize).join(', ')}\n`
        text += `*❯ Usage:* ${command.config.usage
            .split('||')
            .map((usage) => `${this.client.config.prefix}${usage.trim()}`)
            .join(' | ')}\n*❯ Description:* ${command.config.description}`
        return void M.reply(text)
    }
}

interface IRows {
    title: string
    rowId: string
    description?: string
}
