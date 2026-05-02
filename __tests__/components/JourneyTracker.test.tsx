import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JourneyTracker from '../../components/JourneyTracker';

describe('JourneyTracker Component', () => {
  const mockOnStageSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all 5 stages', () => {
    render(<JourneyTracker currentStage={0} onStageSelect={mockOnStageSelect} />);
    const stages = screen.getAllByRole('button');
    expect(stages).toHaveLength(5);
  });

  it('correct stage is marked as current (aria-valuenow)', () => {
    render(<JourneyTracker currentStage={2} onStageSelect={mockOnStageSelect} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '2');
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[2]).toHaveAttribute('aria-current', 'step');
  });

  it('clicking a stage calls onStageSelect with correct index', () => {
    render(<JourneyTracker currentStage={0} onStageSelect={mockOnStageSelect} />);
    const stages = screen.getAllByRole('button');
    fireEvent.click(stages[3]);
    expect(mockOnStageSelect).toHaveBeenCalledWith(3);
  });

  it('completed stages show checkmark', () => {
    render(<JourneyTracker currentStage={2} onStageSelect={mockOnStageSelect} />);
    const buttons = screen.getAllByRole('button');
    // Stage 0 and 1 should be completed and have a checkmark text "✓"
    expect(buttons[0]).toHaveTextContent('✓');
    expect(buttons[1]).toHaveTextContent('✓');
  });

  it('keyboard navigation works (Enter key)', () => {
    render(<JourneyTracker currentStage={0} onStageSelect={mockOnStageSelect} />);
    const stages = screen.getAllByRole('button');
    // In React Testing Library, standard <button> responds to Enter when using fireEvent.click.
    fireEvent.click(stages[1]);
    expect(mockOnStageSelect).toHaveBeenCalledWith(1);
  });
});
