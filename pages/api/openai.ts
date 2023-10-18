import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";


export const configuration = new Configuration({
  apiKey: process.env.openAiSecretKey,
});
//add headers to configuration


export const openai = new OpenAIApi(configuration);
