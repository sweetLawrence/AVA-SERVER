const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
//   "rewrites": [{ "source": "/(.*)", "destination": "/api" }]
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

app.use(bodyParser.json());

const pocketbaseAPI = axios.create({
    baseURL: 'https://offering.pockethost.io/api/collections/Messages',
});
app.get('/',(req,res)=>{
    res.json("Hellow");
})
app.get('/cleardb',(req,res)=>{
    res.json("Hellow");
})
app.post('/messages', async (req, res) => {
    try {

        const { message } = req.body;
        const pb_response = await pocketbaseAPI.post('/records', {
            message: message,
            sender: "YOU"
        });

        // I know!!!, the API KEY IS EXPOSED 😂, change it to yours jameni 
        const genAI = new GoogleGenerativeAI("AIzaSyCGWaqaMOBG8FAW69uhbhCyxGBx7Svc3d8");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        async function run() {
            const prompt = message

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            // text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            console.log(text);

            function isNameQuestion(message) {
                return message.toLowerCase().includes("your name")
            }

            if (isNameQuestion(prompt)) {
                text = "My Name is Ava. I was developed and am presently managed by Lawrence Tsungu, who serves as the CEO and Co-Founder of Pawtech Labs.";
            }

            await pocketbaseAPI.post('/records', {
                message: text,
                sender: "AVA"
            });
            res.json({ msg: text })
            // return text;

        }

        run();
        //    res.json(result)
        // console.log(result)

    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// AIzaSyCGWaqaMOBG8FAW69uhbhCyxGBx7Svc3d8
// const openai = new OpenAI({apiKey:"sk-proj-2vKhfsLuZFb55Pt56PNyT3BlbkFJCXXNADhOB5Yh7peq9Z7U"});
