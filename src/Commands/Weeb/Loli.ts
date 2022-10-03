import { BaseCommand, Command, Message } from '../../Structures'

@Command('loli', {
    description: 'Sends a random neko image',
    category: 'weeb',
    usage: 'loli',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://nekos.life/api/v2/img/loli')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}
