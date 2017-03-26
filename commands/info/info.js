const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { version } = require('../../package.json');

module.exports = class AboutCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'about',
			group: 'info',
			memberName: 'about',
			description: 'Displays info about the bot.',
			throttling: {
				usages: 1,
				duration: 60
			}
		});
	}

	async run(msg) {
		return msg.embed({
			color: 3447003,
			description: stripIndents`
				**Naomi Tanizaki**
				**❯ CREATOR:** <@${this.client.options.owner}> (ID: ${this.client.options.owner})
				**❯ BASED ON:** [Commando](https://github.com/WeebDev/Commando)
				**❯ VERSION:** v${version}
				**Naomi Tanizaki is a multipurpose bot.**
				**If you have any suggestions or feedback head over to her server.**
				**You can see her commands by via ${this.client.user} help**
				**❯ WEBSITE:** [WIP](https://naom.me/)
				**❯ [SERVER](https://s.xaff.ru/dis)**
			`,
			thumbnail: { url: this.client.user.avatarURL }
		});
	}
}