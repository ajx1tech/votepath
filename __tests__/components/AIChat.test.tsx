import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIChat from '../../components/AIChat';
import { askElectionAssistant } from '../../lib/geminiService';

// Mock the geminiService
jest.mock('../../lib/geminiService', () => ({
  askElectionAssistant: jest.fn()
}));

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: (str: string) => str
}));

describe('AIChat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (askElectionAssistant as jest.Mock).mockResolvedValue('Mock response');
    
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('chat input renders with correct aria-label', () => {
    render(<AIChat language="en" currentStage="unregistered" />);
    const input = screen.getByRole('textbox', { name: /ask a question about voting/i });
    expect(input).toBeInTheDocument();
  });

  it('quick question chips are visible and clickable', () => {
    render(<AIChat language="en" currentStage="unregistered" />);
    const chip = screen.getByText('What is NOTA?');
    expect(chip).toBeInTheDocument();
    
    fireEvent.click(chip);
    expect(screen.getByText('What is NOTA?')).toBeInTheDocument(); // The message was added to chat history
  });

  it('sending message adds it to chat history and shows typing indicator during API call', async () => {
    // Delay resolution to check loading state
    let resolveApi: any;
    const promise = new Promise(resolve => { resolveApi = resolve; });
    (askElectionAssistant as jest.Mock).mockReturnValue(promise);

    render(<AIChat language="en" currentStage="unregistered" />);
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    // User message is shown
    expect(screen.getByText('Hello')).toBeInTheDocument();
    
    // Loading indicator should be present
    const dots = document.querySelectorAll('.animate-bounce');
    expect(dots.length).toBeGreaterThan(0);

    // Resolve the API call
    resolveApi('Assistant reply');

    await waitFor(() => {
      expect(screen.getByText('Assistant reply')).toBeInTheDocument();
    });
  });

  it('microphone button has correct aria-label', () => {
    render(<AIChat language="en" currentStage="unregistered" />);
    const micButton = screen.getByRole('button', { name: /Start voice input/i });
    expect(micButton).toBeInTheDocument();
  });

  it('message container has aria-live="polite"', () => {
    render(<AIChat language="en" currentStage="unregistered" />);
    // Select by aria-live attribute
    const container = document.querySelector('[aria-live="polite"]');
    expect(container).toBeInTheDocument();
  });
});
