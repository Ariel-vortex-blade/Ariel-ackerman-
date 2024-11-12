const axios = require("axios")
module.exports = {
	config: {
		name: 'lina',
        aliases: ["loft"],
		version: '1.2',
		author: 'Luxion/fixed by Riley',
		countDown: 0,
		role: 0,
		shortDescription: 'AI CHAT',
		longDescription: {
			en: 'Chat with Xae'
		},
		category: 'Ai chat',
		guide: {
			en: '   {pn} <word>: chat with lina'
				+ '\Example:{pn} hi'
		}
	},

	langs: {
		en: {
			turnedOn: '𝐣𝐞 𝐯𝐚𝐢𝐬 𝐭𝐨𝐮𝐬 𝐯𝐨𝐮𝐬 𝐜𝐥𝐚𝐬𝐡𝐞𝐫 𝐝𝐚𝐧𝐬 𝐜𝐞 𝐠𝐫𝐨𝐮𝐩𝐞 𝐞𝐭 𝐯𝐨𝐮𝐬 𝐚𝐥𝐥𝐞𝐳 𝐩𝐥𝐞𝐮𝐫𝐞𝐫💁‍♂️',
			turnedOff: '𝐭𝐮 𝐦𝐞 𝐦𝐞𝐭 𝐨𝐟𝐟 🚫 \n 𝐭𝐮 𝐚𝐬 𝐭𝐫𝐨𝐩 𝐩𝐞𝐮𝐫 𝐝𝐞 𝐦𝐨𝐢 𝐟𝐢𝐥𝐬 𝐝𝐞 𝐩𝐮𝐭𝐞 🖕🥱!',
			chatting: 'Already Chatting with 𝗟𝗢𝗙𝗧...',
			error: '𝐠𝐫𝐨𝐬... 𝐜𝐨𝐧...🙃'
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
        console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({
        'text': yourMessage,
        'lc': 'fr'
    })
);

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.message;
      }
