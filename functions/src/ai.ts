import { VertexAI } from '@google-cloud/vertexai';
import * as functions from 'firebase-functions';

import { logger } from 'firebase-functions/v1';
import { MentalWorkloadRequestType } from '.';

export type AIMwlReturnType = {
  userId: string;
  date: string; // DD-MM-YYYY
  mwl: number;
  feedback: string;
};

export const vertex_ai = new VertexAI({
  project: 'mental-workload-app',
  location: 'asia-southeast1',
});

const model = 'gemini-1.5-pro-preview-0409';

// Instantiate the models
export const ai = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.4,
    topP: 1,
    topK: 32,
  },
  systemInstruction: {
    parts: [
      { text: 'You evaluate Mental Workload.' },
      {
        text: ' You will be given details about the user and their tasks in a day. Mental workload refers to the cognitive demands placed on an individual while performing tasks or activities. Each level of MWL has positive aspects, but maintaining any single level for extended periods can have negative consequences. A cycle of different levels, is likely the best outcome when viewed across an entire day. A score of 3 is considered optimal mental workload.',
      },
      {
        text: 'You must only return an object, do not use backticks, do not format into markdown.',
      },
    ],
    role: 'system',
  },
});

const removeJsonCodeBlockTags = (inputString: string) => {
  const jsonCodeBlockPattern = /^```json\s+([\s\S]*?)\s+```$/;

  const match = inputString.match(jsonCodeBlockPattern);
  if (match) {
    return match[1].trim();
  }
  return inputString;
};

export const getAIMwlRating = async ({
  raw_data,
  isTemporaryFeedback = false,
}: {
  raw_data: MentalWorkloadRequestType;
  isTemporaryFeedback: boolean;
}): Promise<AIMwlReturnType | undefined | null> => {
  try {
    functions.logger.info('Generating AI response for:', raw_data);
    const input = JSON.stringify(raw_data);
    functions.logger.info('Input data:', input);
    // prompt for generating temprorary feedback on the day's planning
    const feedbackPrompt = `This object contains all the tasks that I have to do today: ${input}. But the day is not fully planned.
    Assign a mental workload score between 1 and 5 after assessing all the details and also give feedback on how the day is being structured under 60 words. 
    Return an object of type {userId: string, date: Timestamp (DD-MM-YYYY), 
    mwl: number, feedback: string}. where mwl is the mental workload. Do not use backticks or format into markdown.`;

    // prompt for generating total mwl score
    const totalMwlPrompt = `This object contains all the tasks that I have to do today: ${input}. 
    Assign a mental workload score between 1 and 5 after assessing all the details available. 
    Return an object of type {userId: string, date: Timestamp (DD-MM-YYYY), 
    mwl: number, feedback: string}. where mwl is the mental 
    workload score and the feedback is on the day's planning under 60 words. Do not use backticks or format into markdown.`;

    // construct the textPart
    const textPart = {
      text: isTemporaryFeedback ? feedbackPrompt : totalMwlPrompt,
    };

    const request = {
      contents: [{ role: 'user', parts: [textPart] }],
    };

    const responseStream = await ai.generateContent(request);

    const aggregatedResponse = responseStream.response;

    const fullTextResponse =
      aggregatedResponse.candidates?.[0].content.parts[0].text;

    let correctedString = fullTextResponse
      ?.replace(/(\w+):/g, '"$1":')
      .replace(/\'/g, '"');

    correctedString = removeJsonCodeBlockTags(correctedString || '');

    let returnResponse: AIMwlReturnType = JSON.parse(correctedString);

    return returnResponse;
  } catch (error) {
    logger.error('Error generating AI response:', error);
    return null;
  }
};
