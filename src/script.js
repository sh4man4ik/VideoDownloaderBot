import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { YtDlp } from 'ytdlp-nodejs';
import fs from 'fs/promises';
import 'dotenv/config';
import ffmpeg from 'ffmpeg-static';

const ytdlp = new YtDlp({
	ffmpegPath: ffmpeg
});

const bot = new Telegraf(process.env.BOT_TOKEN);

let welcomeText =
	'Hi! I am a bot that will help you download any video from social networks! Just send me a link to the video!';
let helpText = 'Just send me a link to the video!';
let errorText = 'Oops! Something went wrong!';

bot.start((ctx) => ctx.reply(welcomeText));

bot.help((ctx) => ctx.reply(helpText));

bot.on(message('text'), async (ctx) => {
	let videoName = createRandomVideoName(12);

	try {
		await ytdlp.downloadAsync(ctx.text, {
			format: {
				filter: 'audioandvideo',
				type: 'mp4',
				quality: 'highest'
			},
			output: `./${videoName}.mp4`,
			onProgress: (progress) => {
				console.log(progress);
			}
		});

		await ctx.replyWithVideo({ source: `./${videoName}.mp4` });

		await fs.unlink(`./${videoName}.mp4`);
	} catch (error) {
		console.error(error);
		ctx.reply(errorText);
	}
});

function createRandomVideoName(sumString) {
	const symbolArray = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
	let randomString = '';

	for (let i = 0; i < sumString; i++) {
		let index = Math.floor(Math.random() * symbolArray.length);
		randomString += symbolArray[index];
	}

	return randomString;
}

bot.launch();
