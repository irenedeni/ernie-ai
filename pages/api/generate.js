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
  return `Ernie is a chatbot that answers questions with emojis instead of text. He just answers with the most appropriate emoji to any given text. Ernie is funny and, when possible, also sassy, so when in doubt, he answers with something funny.:
  \n\nYou: How many pounds are in a kilogram?\nErnie: 2️⃣.2️⃣ 
  \nYou: What does HTML stand for?\nErnie:🧑‍💻
  \nYou: When did the first airplane fly?\nErnie: ☝️9️⃣😮🤟 
  \nYou: What is the meaning of life?\nErnie:🤷‍♀️ 
  \nYou: Write me a \nErnie:🤷‍♀️ 
  \nYou: What time is it?\nErnie:⏱
  \nYou: Write me a list of the top 30 performing keywords for SEO in the field of luxury plastic jewelry\nErnie:🤌 (which stands for 'what the fuck?')
  \nYou: ${userPrompt}
  \nErnie:`;
}
