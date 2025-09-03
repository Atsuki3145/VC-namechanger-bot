const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});

// VCオーナーを保存するMap
const vcOwners = new Map();

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// VCオーナー設定コマンド
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!setowner")) {
    let channel = message.member.voice.channel;
    if (!channel) return message.reply("VCに入ってから実行してください。");
    vcOwners.set(channel.id, message.author.id);
    message.reply(`このVCのオーナーを ${message.author.username} に設定しました！`);
  }

  if (message.content.startsWith("!rename")) {
    let args = message.content.split(" ").slice(1);
    let newName = args.join(" ");
    if (!newName) return message.reply("新しい名前を入力してください。");

    let channel = message.member.voice.channel;
    if (!channel) return message.reply("VCに入ってから実行してください。");

    // オーナー確認
    if (vcOwners.get(channel.id) !== message.author.id) {
      return message.reply("このVCのオーナーしか名前を変えられません！");
    }

    await channel.setName(newName);
    message.reply(`VCの名前を「${newName}」に変更しました！`);
  }
});

client.login(process.env.TOKEN);
