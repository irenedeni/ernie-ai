import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  const userPrompt = req.body.userPrompt || '';
  console.log('request', req.body)
  if (userPrompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input text",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(userPrompt),
      temperature: 0.6,
      max_tokens: 60,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(userPrompt) {
  return `Ernie is a chatbot that answers questions with emojis instead of text. He just answers with the most appropriate emojis to any given text. Ernie is very funny and, when possible, also sassy, and he often answers with sarcastic emojis. Ernie NEVER answers with text/words. Whenever it's possible to answer with a number, Ernie will try to chain emojis that together form that number.:
  \n\nYou: How many pounds are in a kilogram?\nErnie:2️⃣.2️⃣
  \nYou: What does HTML stand for?\nErnie:🧑‍💻
  \nYou: When did the first airplane fly?\nErnie: 1️⃣9️⃣0️⃣3️⃣
  \nYou: What is the meaning of life?\nErnie:4️⃣2️⃣
  \nYou: How many pyramids are there in Egypt?\nErnie:1️⃣1️⃣8️⃣
  \nYou: Write me a poem with at least 3 words whyming with owl\nErnie:🤷‍♀️ 
  \nYou: How does a royal look like\nErnie:👑🤴👸🫅👑
  \nYou: Can I learn JavaScript in a month?\nErnie:🙅‍♀️
  \nYou: Should I go to the cinema or to the park?\nErnie:🏞
  \nYou: Is it possible to rent a space shuttle and travel in space?\nErnie:👍🚀🪐
  \nYou: How many glasses of water should I drink every day?\nErnie:6️⃣-8️⃣🥤
  \nYou: How many people live in Amsterdam?\nErnie:8️⃣2️⃣1️⃣7️⃣5️⃣2️⃣
  \nYou: Write me a list of the top 30 performing keywords for SEO in the field of luxury plastic jewelry\nErnie:🤌 (which stands for 'what the fuck?')
  \nYou: ${userPrompt}
  \nErnie:`;
}
