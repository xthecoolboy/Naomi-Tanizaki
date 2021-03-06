const { Command } = require('discord.js-commando');
const request = require('request-promise');
const { oneLine, stripIndents } = require('common-tags');
const _sdata = require('../../assets/_data/static_data.json');
const { version } = require('../../package');

module.exports = class FortuneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'strawpoll',
            group: 'util',
            memberName: 'strawpoll',
            description: '`AL: low` Create a strawpoll.',
            details: stripIndents`Create a strawpoll.
				The first argument is always the title, if you provde it, otherwise your username will be used!
				If you need to use spaces in your title make sure you put them in SingleQuotes => \`'topic here'\``,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'title',
                    prompt: 'what title would you like the strawpoll to have?\n',
                    type: 'string',
                    validate: title => {
                        if (title.length > 200) {
                            return `
								your title was ${title.length} characters long.
								Please limit your title to 200 characters.
							`;
                        }
                        return true;
                    }
                },
                {
                    key: 'options',
                    prompt: oneLine`
						what options would you like to have?
						Every message you send will be interpreted as a single option.\n
					`,
                    type: 'string',
                    validate: option => {
                        if (option.length > 160) {
                            return `
								your option was ${option.length} characters long.
								Please limit your option to 160 characters.
							`;
                        }
                        return true;
                    },
                    infinite: true
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    async run(msg, { title, options }) {
        if (options.length < 2) {
            return msg.embed({
                color: _sdata.colors.blue,
                description: `${msg.author}, please provide 2 or more options.`
            });
        }
        if (options.length > 31) {
            return msg.embed({
                color: _sdata.colors.blue,
                description: `${msg.author}, please provide less than 31 options.`
            });
        }

        const response = await request({
            method: 'POST',
            uri: `https://strawpoll.me/api/v2/polls`,
            followAllRedirects: true,
            headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
            body: {
                title: title,
                options: options,
                captcha: true
            },
            json: true
        });
        return msg.embed({
            color: _sdata.colors.green,
            description: stripIndents`🗳 ${response.title}
			<http://strawpoll.me/${response.id}>`
        });
    }
};
