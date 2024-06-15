import { VertexAI } from '@google-cloud/vertexai';
/**
 * TODO(developer): Update these variables before running the sample.
 */
async function set_system_instruction(projectId = 'PROJECT_ID') {
  const vertexAI = new VertexAI({
    project: projectId,
    location: 'us-central1',
  });

  const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-pro-preview-0409',
    systemInstruction: {
      parts: [
        { text: 'You are a mental workload detector' },
        {
          text: 'Your mission is to evaluate mental workload from the data given to you.',
        },
      ],
      role: 'system',
    },
  });

  const textPart = {
    text: `
    User input: I like bagels.
    Answer:`,
  };

  const request = {
    contents: [{ role: 'user', parts: [textPart] }],
  };

  const resp = await generativeModel.generateContent(request);
  const contentResponse = await resp.response;
  console.log(JSON.stringify(contentResponse));
}
