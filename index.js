import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import 'dotenv/config';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/add (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    if (!match[1].includes(',')) {
        bot.sendMessage(chatId, 'Vui lòng nhập đúng định dạng.' + '\n\n' + 'Ví dụ:\n```\n/add Danh mục,Số tiền,Note\n```', {
            parse_mode: 'Markdown'
        });
        return;
    }

    bot.sendChatAction(chatId, 'typing');

    const resp = match[1];
    const values = resp.split(',');

    const url = new URL(process.env.WEBHOOK_URL);
    url.searchParams.append('Danh mục', values[0]);
    url.searchParams.append('Số tiền', values[1]);
    url.searchParams.append('Note', values[2]);
    url.searchParams.append('Ngày', (new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })).toLocaleDateString('en-GB')).replace(/\//g, '-'));

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                bot.sendMessage(chatId, '✅ Đã thêm thành công.');
            } else {
                bot.sendMessage(chatId, 'Không thể thêm. Vui lòng thử lại sau!');
            }
        })
        .catch(err => {
            bot.sendMessage(chatId, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!');
        });
});

console.log('Bot is running.....')
