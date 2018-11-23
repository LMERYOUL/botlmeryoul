const Discord = require('discord.js');
const { Client, Util } = require('discord.js');
const client = new Discord.Client();
const { PREFIX, GOOGLE_API_KEY } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

// MUSIC-BOT BY LMERYOUL \\ 


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
client.user.setGame(`!!help | Servers ${client.guilds.size}`,"https://www.twitch.tv/lmeryoul")
  console.log('MUSIC-BOT BY LMERYOUL')
  console.log('')
  console.log('+[-----------------------------------------------------------------]+')
  console.log(`[Start] ${new Date()}`);
  console.log('+[-----------------------------------------------------------------]+')
  console.log('')
  console.log('+[------------------------------------]+');
  console.log(`Logged in as * [ " ${client.user.username} " ]`);
  console.log('')
  console.log('Informations :')
  console.log('')
  console.log(`servers! [ " ${client.guilds.size} " ]`);
  console.log(`Users! [ " ${client.users.size} " ]`);
  console.log(`channels! [ " ${client.channels.size} " ]`);
  console.log('+[------------------------------------]+')
  console.log('')
  console.log('+[------------]+')
  console.log(' Bot Is Online')
  console.log('+[------------]+')
  console.log('')
  console.log('')
});


const developers = ["317418087714390016",""]
const adminprefix = "!";
client.on('message', message => {
    var argresult = message.content.split(` `).slice(1).join(' ');
      if (!developers.includes(message.author.id)) return;
      
  if (message.content.startsWith(adminprefix + 'ply')) {
    client.user.setGame(argresult);
      message.channel.send(`**Changing The Playing To ..${argresult}** `)
  } else 
     if (message.content === (adminprefix + "leave")) {
    message.guild.leave();        
  } else  
  if (message.content.startsWith(adminprefix + 'wt')) {
  client.user.setActivity(argresult, {type:'WATCHING'});
      message.channel.send(`Changing The Watching To ..**${argresult}** `)
  } else 
  if (message.content.startsWith(adminprefix + 'ls')) {
  client.user.setActivity(argresult , {type:'LISTENING'});
      message.channel.send(`**Changing The Listening To ..**${argresult}** `)
  } else 
  if (message.content.startsWith(adminprefix + 'st')) {
    client.user.setGame(argresult, "https://www.twitch.tv/lmeryoul/lmeryoul");
      message.channel.send(`**Changing The Streaming To ..**${argresult}** `)
  }
  if (message.content.startsWith(adminprefix + 'setname')) {
   client.user.setUsername(argresult).then
      message.channel.send(`Changing The Name To ..**${argresult}** `)
} else
if (message.content.startsWith(adminprefix + 'setavatar')) {
  client.user.setAvatar(argresult);
    message.channel.send(`Changing The Avatar To :**${argresult}** `);
}
});



client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('3iiw'));


client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(PREFIX.length)

	if (command === `play`) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('You need to join voice channel first :x:');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I can not connect in this audio channel, make sure I have the roles !');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I can not speak in this audio channel, make sure I have the roles !');
		}
		if (!permissions.has('EMBED_LINKS')) {
			return msg.channel.sendMessage("**I dont have permission `EMBED LINKS`**")
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(` **${playlist.title}** Added to list!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
					const embed1 = new Discord.RichEmbed()
					.setAuthor("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
		            .setColor('RANDOM')
					.setDescription(`**Choose number ** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
					.setFooter('')
					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
					
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send(' The number is not specified to play the song.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send(':X: No result.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === `skip`) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === `stfu`) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === `vol`) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`:loud_sound: Current volume is **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`:speaker: Sound changed to **${args[1]}**`);
	} else if (command === `np`) {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		const embedNP = new Discord.RichEmbed()
		.setAuthor("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
		.setColor('RANDOM')
		.setDescription(`:notes: Now playing: **${serverQueue.songs[0].title}**`)
		return msg.channel.sendEmbed(embedNP);
	} else if (command === `queue`) {
		
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		let index = 0;
		const embedqu = new Discord.RichEmbed()
        .setAuthor("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
		.setColor('RANDOM')	
		.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**Now playing** ${serverQueue.songs[0].title}`)
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send(':pause_button:Music paused!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === "resume") {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send(':arrow_forward:Music resumed !');
		}
		return msg.channel.send('There is nothing playing.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	
//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
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
		else return msg.channel.send(` **${song.title}** Added to list!`);
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
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	const embed = new Discord.RichEmbed()
	       .setColor('RANDOM')
		   .setDescription(`**:headphones: Now playing:** **[${song.title}](https://www.youtube.com)**`)
	serverQueue.textChannel.send(embed);
}



client.on("message", message => {
	if (message.content === "!!help") {
	message.channel.send('')
	 const embed = new Discord.RichEmbed()
		 .setColor('BLACK')
		 .setFooter("Developed By LMERYOUL#7553", 'https://image.ibb.co/iVVW8A/photo.jpg')
		 .setThumbnail(message.author.avatarURL)
		 .setImage('https://media.giphy.com/media/1RjHh3fCmFWc7DBIsR/giphy.gif')
		 .setDescription(` 

┏╋━━━◥◣◆◢◤━━━╋┓
 **[Prefix : !!](https://www.twitch.tv/lmeryoul)** 
┗╋━━━◥◣◆◢◤━━━╋┛

**––––•(-• Music Commands •-)•––––**

**[!!play](https://www.twitch.tv/lmeryoul)**             |Play a song with the given name or url

**[!!stfu](https://www.twitch.tv/lmeryoul)**             |Disconnect the bot from the voice channel if is in

**[!!pause](https://www.twitch.tv/lmeryoul)**            |Pause the currently music playing 

**[!!resume](https://www.twitch.tv/lmeryoul)**           |Resume paused music

**[!!skip](https://www.twitch.tv/lmeryoul)**             |Skip the currently playing song

**[!!vol](https://www.twitch.tv/lmeryoul)**              |Change the current volume

**[!!np](https://www.twitch.tv/lmeryoul)**               |Shows what song the bot is currently playing

**[!!queue](https://www.twitch.tv/lmeryoul)**            |View the queue

**––––•(-• Other Commands •-)•––––**

**[!!avatar](https://www.twitch.tv/lmeryoul)**           |Gets a user's avatar.

**[!!userinfo](https://www.twitch.tv/lmeryoul)**         |Gets a user info.

**[!!serverinfo](https://www.twitch.tv/lmeryoul)**       |Gets a server info/stats

**[!!clear](https://www.twitch.tv/lmeryoul)**            |Clears/deletes all the messages on a particular channel max 3k 

**[!!invite](https://www.twitch.tv/lmeryoul)**           |Generates a link to invite LMEJDOUB-BOT to your server

**[FACEBOOK](https://www.facebook.com/LMERYOUL.29)**
`)
   message.channel.send(embed);
  }  


//____________________________________________________send messages and reply__________________________________________
if (message.content.startsWith("!!stats")) {
    message.channel.send(`
	:regional_indicator_s: **Servers:** ${client.guilds.size}
	:regional_indicator_u: **Users:** ${client.users.size}
	:regional_indicator_c: **Channels:** ${client.channels.size}`);
}







//___________________________________________________________Your Avatar_______________________________________________
    if (message.content.startsWith("!!avatar")) {
		let user = message.mentions.users.first() || message.author;
	    let embed = new Discord.RichEmbed()  
		  .setColor('RANDOM')
		  .addField(`The Avatar Of`, user.username)
		  .setImage(user.displayAvatarURL)
		  .setFooter(`Requested By ${message.author.username}`, message.author.avatarURL)
		  
   message.channel.send(embed);
  }  


//____________________________________________________User INFO _________________________________________________

if (message.content.startsWith("!!userinfo")) {
	let user = message.mentions.users.first() || message.author;
	let embed = new Discord.RichEmbed()
	 .setColor('RANDOM')
	 .setAuthor(`${user.username}'s INFO`, user.displayAvatarURL)
	 .addField("UserName", user.username)
	 .addField(":id:", user.id)
	 .addField("Created On", user.createdAt)
	 .addField("Status", user.presence.status)
     .setFooter(`Requested By ${message.author.username}`, message.author.avatarURL)
	 .setThumbnail(user.displayAvatarURL)
message.channel.send(embed);
}

//___________________________________________________Server Information_________________________________________________________
if (message.content.startsWith("!!serverinfo")) {
	const embed = new Discord.RichEmbed()
	 .setColor('RANDOM')
	 .addField("Server Name", message.guild.name, true)
	 .addField("Owner", `<@${message.guild.ownerID}>`, true)
	 .addField("Members", message.guild.memberCount, true)
	 .addField("Roles", message.guild.roles.size, true)
	 .addField("Channels", message.guild.channels.size, true)
	 .addField("Region", message.guild.region, true)
	 .setThumbnail(message.guild.iconURL)
message.channel.send(embed);
}
//_______________________________________________________________DATE___________________________________________________________
if (message.content.startsWith("!!date")) {
	const embed = new Discord.RichEmbed()  
		 .setColor('RANDOM')
		 .setDescription(`**:date: ${new Date()}**`)
		 .setFooter(`Requested By ${message.author.username}`, message.author.avatarURL)
		 
  message.channel.send(embed);
 }  











//______________________________________________________________________________________________________________________________
if (message.content.startsWith("chkoun")) {
message.channel.send(":regional_indicator_l: :regional_indicator_i:  :regional_indicator_h: :regional_indicator_d: :regional_indicator_a: :regional_indicator_k:");
}

if (message.content.startsWith("Chkoun")) {
message.channel.send(":regional_indicator_l: :regional_indicator_i:  :regional_indicator_h: :regional_indicator_d: :regional_indicator_a: :regional_indicator_k:");
}

//______________________________________________________Invite Bot_______________________________________________________
if (message.content.startsWith("!!invite")) {
	 const embed = new Discord.RichEmbed()  
		  .setColor('RANDOM')
		  .setImage('https://media.giphy.com/media/1RjHh3fCmFWc7DBIsR/giphy.gif')
		  .setDescription(`**You can use this [LINK](https://discordapp.com/oauth2/authorize?client_id=510957093415813120&scope=bot&permissions=2146958846) to invite me to your server! :heart:**`)
		  
   message.channel.send(embed);
  }  





//_________________________________________________________Message For All______________________________________________

// ADMBOT BY LMERYOUL \\

const prefix = "!"



// ADMBOT BY LMERYOUL \\

	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
    if(message.content.startsWith('!bc')) {
    if(!message.channel.guild) return message.channel.send('**This is only for management**').then(m => m.delete(5000));
    if(!message.member.hasPermission('ADMINISTRATOR')) return      message.channel.send('**Unfortunately you do not have permission to use this** `ADMINISTRATOR`' );
    let args = message.content.split(" ").join(" ").slice(2 + prefix.length);
    let copy = "S Bot";
    let request = `Requested By ${message.author.username}`;
    if (!args) return message.reply('**You must write something to send a broadcast**');message.channel.send(`**Are you sure you want to send? \Broadcast content:** \` ${args}\``).then(msg => {
    msg.react('✅')
    .then(() => msg.react('❌'))
    .then(() =>msg.react('✅'))
 
    let reaction1Filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
    let reaction2Filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;
          let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 12000 });
    let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 12000 });
    reaction1.on("collect", r => {
    message.channel.send(`**☑ |   The message has been sent to ${message.guild.members.size} members**`).then(m => m.delete(5000));
    message.guild.members.forEach(m => {
    var bc = new
    Discord.RichEmbed()
        .setAuthor("LMEJDOUB-BOT", "https://image.ibb.co/iVVW8A/photo.jpg")
		.setColor('BLACK')
        .addField('Server', message.guild.name)
		.addField('Sender', message.author.username)
        .addField(':envelope: Message', args)
        .setImage("")
        .setThumbnail(message.author.avatarURL)
        .addBlankField(true)
		m.send({ embed: bc })
		msg.delete();
		})
		})
		reaction2.on("collect", r => {
		message.channel.send(`**Message Canceled.**`).then(m => m.delete(5000));
		msg.delete();
		})
		})
		}
//_________________________________________________________Clear Messages_______________________________________________
client.on('message', message => {
	var prefix = "!!"
		if (message.content.startsWith(prefix + 'clear')) {
		  if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply(`you do not have permission to use this** ADMINISTRATOR`).catch(console.error);
	  message.delete()
	  if(!message.channel.guild) return;
	  let args = message.content.split(" ").slice(1);
	  
	  const messagecount = parseInt(args.join(' '));
	  
	  message.channel.fetchMessages({
	  
	  limit: messagecount
	  
	  }).then(messages => message.channel.bulkDelete(messages));
	  message.channel.sendMessage("", {embed: {
		title: "**JMA3 LKHRA**",
		color: 0x06DF00,
		footer: {
		
		}
		}}).then(msg => {msg.delete(3000)});
	  };
	  
	  });
//_________________________________________________Voice Online____________________________________________________________
client.on('message',async message => {
	if(message.content.startsWith("!!setvoice")) {
	if(!message.guild.member(message.author).hasPermissions('MANAGE_CHANNELS')) return message.reply('❌ **You do not have sufficient permissions**');
	if(!message.guild.member(client.user).hasPermissions(['MANAGE_CHANNELS','MANAGE_ROLES_OR_PERMISSIONS'])) return message.reply('❌ **I do not have enough powers**');
	message.channel.send('✅| **The room was created successfully**');
	message.guild.createChannel(`Voice Online : [ ${message.guild.members.filter(m => m.voiceChannel).size} ]` , 'voice').then(c => {
	  console.log(`Voice online channel setup for guild: \n ${message.guild.name}`);
	  c.overwritePermissions(message.guild.id, {
		CONNECT: false,
		SPEAK: false
	  });
	  setInterval(() => {
		c.setName(`Voice Online : [ ${message.guild.members.filter(m => m.voiceChannel).size} ]`)
	  },1000);
	});
	}
  });

















//______________________________________________________________________________________________________________




























});
client.login("NTEwOTU3MDkzNDE1ODEzMTIw.DskAaQ.VHorh0pF8VODOt5UFK7ItSV3fHA");
