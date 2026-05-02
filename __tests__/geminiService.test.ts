import { askElectionAssistant, translateText } from '../lib/geminiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the GoogleGenerativeAI module
jest.mock('@google/generative-ai');

describe('geminiService', () => {
  let mockSendMessage: jest.Mock;
  let mockGenerateContent: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMessage = jest.fn().mockResolvedValue({ response: { text: () => 'Mocked response' } });
    mockGenerateContent = jest.fn().mockResolvedValue({ response: { text: () => 'Mocked translation' } });

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        startChat: jest.fn().mockReturnValue({
          sendMessage: mockSendMessage
        }),
        generateContent: mockGenerateContent
      })
    }));
  });

  describe('askElectionAssistant', () => {
    it('returns string response', async () => {
      const response = await askElectionAssistant('How to vote?', [], 'en');
      expect(response).toBe('Mocked response');
    });

    it('input sanitization strips HTML tags before sending', async () => {
      await askElectionAssistant('<script>alert("XSS")</script>How to vote?', [], 'en');
      // The sendMessage should be called with sanitized input
      expect(mockSendMessage).toHaveBeenCalledWith('alert("XSS")How to vote?');
    });

    it('empty input returns appropriate message', async () => {
      const response = await askElectionAssistant('   ', [], 'en');
      expect(typeof response).toBe('string');
    });

    it('rate limiting — rapid successive calls handled gracefully', async () => {
      const start = Date.now();
      await askElectionAssistant('Call 1', [], 'en');
      await askElectionAssistant('Call 2', [], 'en');
      const end = Date.now();
      // Should have taken at least 1000ms due to rate limiting (approx)
      expect(end - start).toBeGreaterThanOrEqual(900); // 900 to account for JS timing fuzziness
    });
  });

  describe('translateText', () => {
    it('returns original text on API error (graceful degradation)', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API Down'));
      const text = await translateText('Hello new string', 'hi'); // Ensure cache miss
      expect(text).toBe('Hello new string');
    });
  });
});
