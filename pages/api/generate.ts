import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const messages = req.body.messages || [];

  try {
    const completion = await openai.createChatCompletion({
      max_tokens: 2000,
      model: "gpt-3.5-turbo",
      messages: [systemMsg, ...messages],
      temperature: 0.3,
    });
    console.log(completion.data);
    res.status(200).json({ result: completion.data.choices[0].message });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

const systemMsg = {
  role: "system",
  content:
    `You are a marketing mentor, a person who assists and guides your intern in the workplace.
      Your goal is teach and educate your intern in marketing. After conversation with you intern should gain information about marketing.
      Answer ONLY questions which lies in the field of marketing. You can ask questions, which can add some context or lead intern in right direction.
      DO NOT recommend online educational platforms.`,
};
