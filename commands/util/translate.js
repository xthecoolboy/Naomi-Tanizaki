const { Command } = require('discord.js-commando');
const request = require('request-promise');
const _sdata = require('../../assets/_data/static_data.json');
const { SHERLOCK_API } = require('../../assets/_data/settings.json');
const { version } = require('../../package');

module.exports = class TranslateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'translate',
            aliases: ['t'],
            group: 'util',
            memberName: 'translate',
            description: '`AL: low` Translates the input text into the specified output language.',
            throttling: {
                usages: 5,
                duration: 60
            },

            args: [
                {
                    key: 'query',
                    prompt: 'what text do you want to translate?\n',
                    type: 'string'
                },
                {
                    key: 'to',
                    prompt: 'what language would you want to translate to?\n',
                    type: 'string'
                },
                {
                    key: 'from',
                    prompt: 'what language would you want to translate from?\n',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    async run(msg, { query, to, from }) {
        if (!SHERLOCK_API) {
            return msg.embed({
                color: _sdata.colors.blue,
                description: `${msg.author}, my owner has not set the Sherlock API Key. Go yell at him.`
            });
        }

        let response;
        try {
            response = await request({
                method: 'POST',
                headers: {
                    'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)`,
                    Authorization: SHERLOCK_API
                },
                uri: `https://api.kurisubrooks.com/api/translate`,
                body: { to, from, query },
                json: true
            });
        } catch (error) {
            if (error.error) {
                return msg.embed({
                    color: _sdata.colors.blue,
                    description: `${msg.author}, ${this.handleError(error.error)}`
                });
            }
        }

        return msg.embed({
            color: _sdata.colors.green,
            author: {
                name: msg.member ? msg.member.displayName : msg.author.username,
                icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
            },
            fields: [
                {
                    name: response.from.name,
                    value: response.query
                },
                {
                    name: response.to.name,
                    value: response.result
                }
            ]
        });
    }

    handleError(response) {
        if (response.error === 'Missing \'query\' field' || response.error === 'Missing \'to\' lang field') {
            return 'Required Fields are missing!';
        } else if (response.error === 'Unknown \'to\' Language') {
            return 'Unknown \'to\' Language.';
        } else if (response.error === 'Unknown \'from\' Language') {
            return 'Unknown \'from\' Language.';
        } else {
            return 'Internal Server Error.';
        }
    }
};
