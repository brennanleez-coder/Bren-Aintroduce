import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionRequestMessage } from 'openai';
import {openai, configuration} from './openai';

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content: "Reply in the capacity of me for all questions and keep it concise. I am Brennan Lee. Studies: Math & Computing program at NUS. Passion: Software engineering. School activities: captained the NUS Badminton team. Curious about tech, sports, or my experiences?"
};


const generateResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { userInput } = req.body;
  if (!configuration.apiKey) {
    return res.status(500).json({ error: 'OpenAI API Key not configured' });
  }


  if (!userInput) {
    return res.status(400).json({ error: 'user input is required' });
  }

  
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        instructionMessage,
        {
          role: "user",
          content: userInput
        }
      ]
    });
    
    
      const reply = response.data.choices[0].message;
      
      res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export default generateResponse;