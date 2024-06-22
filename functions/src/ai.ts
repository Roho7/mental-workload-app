import { VertexAI } from '@google-cloud/vertexai';

const vertex_ai = new VertexAI({
  project: 'mental-workload-app',
  location: 'asia-southeast1',
});

const model = 'gemini-1.0-pro-vision-001';

// Instantiate the models
export const ai = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.4,
    topP: 1,
    topK: 32,
  },
});
