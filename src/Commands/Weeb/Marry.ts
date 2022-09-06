import { BaseCommand, Command, Message } from '../../Structures'
import { Ship } from '@shineiichijo/canvas-chan'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('marry', {
    description: 'Marries the summoned haigusha',
    usage: 'marry',
    cooldown: 45,
    category: 'weeb',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, reply, message }: Message): Promise<void> => {
        if (!this.handler.haigushaResponse.has(from)) return void reply(`no haigusha`)
        const { haigusha } = await this.client.DB.getUser(sender.jid)
        if (haigusha.married) {
            const buttons = [
                {
                    buttonId: 'id1',
                    buttonText: { displayText: `${this.client.config.prefix}divorce` },
                    type: 1
                }
            ]
            const buttonMessage = {
                text: `u r already married`,
                footer: '',
                headerType: 1,
                buttons: buttons
            }
            return void (await this.client.sendMessage(from, buttonMessage, {
                quoted: message
            }))
        }
        const res = this.handler.haigushaResponse.get(from)
        if (!res) return void null
        await this.client.DB.user.updateOne(
            { jid: sender.jid },
            { $set: { 'haigusha.married': true, 'haigusha.data': res } }
        )
        this.handler.haigushaResponse.delete(from)
        const buttonMessage = {
            text: `married with ${res.name}`,
            footer: '',
            headerType: 1
        }
        return void (await this.client.sendMessage(from, buttonMessage as AnyMessageContent, {
            quoted: message
        }))
    }
}
