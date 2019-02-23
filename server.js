const http = require('http');
const express = require('express');
const app = express();


app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const { Client, RichEmbed, Attachment, Collection } = require("discord.js");
const Enmap = require('enmap');
const edb = new Enmap({
name: "edb",
ensureProps: true
})
const client = new Client({disableEveryone: true});
const superagent = require('superagent'); 
const { Util } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube("AIzaSyCIYu3vyF5zynqcsHjOg_iAIB2mwoRI0yk");
const queue = new Collection();
const ms = require('ms');
const prefixdb = new Enmap({ name: "prefixdb"})
const { post } = require('node-superfetch');
const { owners_id } = require("./config.json");
const Discord = require('discord.js');
const { inspect } = require("util");



client.on("ready", () => {

  console.log(`Logged in as ${client.user.username}!`);
  
  const statuses = [
    { type: 'PLAYING', name: `d!help | ${client.guilds.size} servers` }
];
  

setInterval(() => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    if (status.type === 'STREAMING') {
        client.user.setActivity(status.name, { type: status.type, url: status.url });
    } else {
        client.user.setActivity(status.name, { type: status.type });
    }
}, 10000);
  
  
  
});







client.on("message", async message => { 
  
  let prefix = "d!";
  
console.log(prefix)
if(!message.content.startsWith(prefix)) return;

const args = message.content.slice(prefix.length).trim().split(/\s+/g);

const command = args.shift().toLowerCase();

let sender = message.author;
	
if(message.author.bot) return;
  
  
  
  if (client.user.id === message.author.id) { return }
  
  
  
  
    
  
  if(command === 'reboot') {
    
    owners_id.forEach(async function(owners_id) {
    if (message.author.id !== owners_id) return;
   
    message.channel.send(":gear: Rebooted").then(() => {

        console.log('Rebooted');

        client.destroy();

        process.exit(1)
	    
    })
  });
}
  
  
  
  
  if(['h', 'hlp', 'help'].includes(command)) {   
    
    
  let embed = new RichEmbed()
    .setTitle("My Commands")
    .setDescription("Need help with my commands? No problem here they are:")
    .addField("Music Commands", `**${prefix}play** - Plays the video that you want. You can also put URL or a playlist URL or put the title of the video.\n**${prefix}stop** - Stops the video.\n**${prefix}np** - Shows what is currently pkaying.\n**${prefix}volume** - Sets the volume of the video default is 5. If you do this command without a number then it shows what's the current video volume.\n**${prefix}skip** - Skips to the next video if you have multiple videos.\n**${prefix}queue** - Shows the queue and what's playing currently.\n**${prefix}pause** - Pauses the video.\n**${prefix}resume** - Resumes the video.`)
  .addField("Settings", `**${prefix}**`)
    .setColor("RANDOM")
    
    message.channel.send("Please check your DM.")
    await message.author.send(embed);
    
  }
  
  
  if(command === 'ping') {

message.channel.send(`Hoold on!`).then(m => {

    m.edit(`🏓  ::  **Pong!** (Roundtrip took: **` + (m.createdTimestamp - message.createdTimestamp) + `ms.** Heartbeat: **` + Math.round(client.ping) + `ms.**)`);

    });

 }
  
  if(command === 'invite'){
  
  let embed = new RichEmbed()
    .addField('Invite me to your server!', `Hey want me in your server? No problem invite me from the link below.\n\nInvite: https://discordapp.com/api/oauth2/authorize?client_id=548349901105397800&permissions=8&scope=bot`)
    .setColor("RANDOM")
    
    message.channel.send("Please check your DM.")
    await message.author.send(embed);
  
  }
  
  if(['e', 'ev', 'eval'].includes(command)) {
  
    
  owners_id.forEach(async function(owners_id) {
    if (message.author.id !== owners_id) return;
  
      try {
        let codein = args.join(" ");
        let code = eval(codein);
        
        if (typeof code !== 'string')
            code = require('util').inspect(code, { depth: 0 });
        
        let embed = new Discord.RichEmbed()
        .setAuthor('Evaluate')
        .setColor('RANDOM')
        .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
        .addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
        
        message.channel.send(embed)
    } catch(e) {
        let eer = new Discord.RichEmbed()
        .setTitle(`Eval Error :x:`)
        .setColor("#F20909")
        .addField(`Error`,`\`\`\`js\n${e}\n\`\`\``)
        message.channel.send(eer);
    }
  });
    
        function clean(text) {
      if (typeof(text) === "string")
        return text.replace(/'/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
          return text;
    }
    
    let code;
}
  
   
});



client.on('message', async msg => {
 
  let prefix = "d!"
  
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(prefix)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(prefix.length)

	if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					
					const rEmbed = new RichEmbed()

    .setTitle(`Search Results:`)

	.setColor('RANDOM')

    .setDescription(`Please provide a value to select one of the search results ranging from 1-10.`)
   
	.addField(`Song Selection:`, `${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`)
	.setFooter(`It will be cancelled in 10 seconds or if no or invalid value entered.`)
					
					msg.channel.send(rEmbed);
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
    msg.channel.send(`Okay I skipped it for you.`)
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
    msg.channel.send(`Okay all songs removed and stopped. I left.`)
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === 'volume') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`I set the volume to: **${args[1]}**`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');

		const rEmbed = new RichEmbed()
	
		.setColor('RANDOM')
	   
		.addField(`Queue:`, `${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}`)
		.addField(`Now Playing:`, `${serverQueue.songs[0].title}`)
						
						msg.channel.send(rEmbed);

	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	
		

	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!');
		}
		return msg.channel.send('There is nothing paused or not playing.');
	}

	return undefined; 
  
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') serverQueue.textChannel.send('Song Ended');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Started playing: **${song.title}**`);
}






client.login(process.env.token);