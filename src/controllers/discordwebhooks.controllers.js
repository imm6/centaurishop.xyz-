const { Webhook, MessageBuilder } = require('discord-webhook-node');

async function webhooksend(user, robuxretirados){
	const hook = new Webhook('https://discordapp.com/api/webhooks/978755610457817088/gJVZksyJ2TAK6JyKQ6H1AO_ZgF9VTacJtslTLix7ky1kYedmP8f9wQsw7OZk8JnPMjvy')

    const exampleEmbed = new MessageBuilder()
	.setColor('#0099ff')
	.setTitle('Centauri - Cheap Robux Shop')
	.setThumbnail('https://cdn.discordapp.com/attachments/964205719547179078/978019089769447484/transparentplanet.png')
	.addField(`Username: ${user}`, true)
	.addField(`Centauris Retirados: ${robuxretirados}`,true)
	.setTimestamp()

hook.send(exampleEmbed);

}


async function WPagoRealziado(user, robuxcomprados,dinero){
	const hook = new Webhook('https://discordapp.com/api/webhooks/993134173369942107/LlOlixtA9cWZm-zvVkpxLPQRHjEuBHyULuwA4QuUu4iX-frT7ciPfnoO-i7zvbryRkOJ')

    const exampleEmbed = new MessageBuilder()
	.setColor('#0099ff')
	.setTitle('Centauri - Cheap Robux Shop')
	.setThumbnail('https://cdn.discordapp.com/attachments/964205719547179078/978019089769447484/transparentplanet.png')
	.addField(`Username: ${user}`, true)
	.addField(`Centauris comprados: _${robuxcomprados}_`,true)
	.addField("Dinero Pagado: ``"+dinero.toFixed(2)+"$``", true)
	.setTimestamp()

hook.send(exampleEmbed);

}


async function genesishood(user, reason){
	const hook = new Webhook('https://discord.com/api/webhooks/976364936798289920/w4HlEKjYZ6O_qcQqUvAIyRCzhDZQSnklRC2OAe6pXmIUFwFgBVhpzCT15F9cSVuGVhit')

    const exampleEmbed = new MessageBuilder()
	.setColor('#0099ff')
	.setTitle('Hood Genesis (Reportes)')
	.setThumbnail('https://cdn.discordapp.com/attachments/885910055759802378/979128105287430164/unknown.png')
	.addField(`Username`,`${user} `,true)
	.addField(`Reason`,`${reason}`,true)
	.setTimestamp()

hook.send(exampleEmbed);

}
module.exports = { webhooksend, genesishood, WPagoRealziado};
	
