const axios = require('axios');
const dotenv = require('dotenv').config();

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Tokyo&units=metric&appid=${process.env.API_KEY}`;
const webhookUrl = process.env.SLACK_WEBHOOK_URL;

// OpenWeatherMap APIから天気情報を取得する関数
async function getWeatherData() {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get weather data from OpenWeatherMap API');
    }
}

// Slackにメッセージを送信する関数
async function sendMessage(message) {
    try {
        await axios.post(webhookUrl, { text: message });
        console.log('Message sent successfully!');
    } catch (error) {
        console.error(error);
        throw new Error('Failed to send message to Slack');
    }
}

// メインの処理
async function main() {
    try {
        const weatherData = await getWeatherData();
        const temp = weatherData.main.temp;
        const weather = weatherData.weather[0].main;

        let message;

        if (weather === 'Clear') {
            message = `晴れです！現在の気温は ${temp} ℃ です。`;
        } else if (weather === 'Clouds') {
            message = `曇りです！現在の気温は ${temp} ℃ です。`;
        } else {
            message = `雨です！現在の気温は ${temp} ℃ です。`;
        }

        await sendMessage(message);
    } catch (error) {
        console.error(error);
    }
}

main();
