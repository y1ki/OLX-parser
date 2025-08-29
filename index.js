const { Telegraf } = require('telegraf');
const bot = require('./src/bot');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN || 'your_bot_token_here';

if (!BOT_TOKEN || BOT_TOKEN === 'your_bot_token_here') {
    console.error('❌ Bot token not provided! Please set BOT_TOKEN in .env file');
    process.exit(1);
}

// Initialize Telegram bot
const telegrafBot = new Telegraf(BOT_TOKEN);

// Initialize bot handlers
bot.initBot(telegrafBot);

// Start bot
telegrafBot.launch()
    .then(() => {
        console.log('🚀 OLX.pl Parser Bot started successfully!');
        console.log('📡 Bot is listening for messages...');
    })
    .catch(error => {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    });

// Graceful shutdown
process.once('SIGINT', () => telegrafBot.stop('SIGINT'));
process.once('SIGTERM', () => telegrafBot.stop('SIGTERM'));
