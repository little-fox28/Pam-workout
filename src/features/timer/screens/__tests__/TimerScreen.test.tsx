import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { TimerScreen, REST_PRESET_VALUES } from '../TimerScreen';

describe('TimerScreen (Phase 4 UI)', () => {
  describe('Segmented Card Switching', () => {
    it('switches the active mode and central display context when bottom cards are pressed', async () => {
      const { getByTestId } = await render(<TimerScreen />);

      // Switch to WORK mode
      const workCard = getByTestId('mode-card-work');
      await fireEvent.press(workCard);
      expect(getByTestId('timer-mode-header')).toHaveTextContent('WORK');

      // Switch to REST mode
      const restCard = getByTestId('mode-card-rest');
      await fireEvent.press(restCard);
      expect(getByTestId('timer-mode-header')).toHaveTextContent('REST');

      // Switch back to SETS mode
      const setsCard = getByTestId('mode-card-sets');
      await fireEvent.press(setsCard);
      expect(getByTestId('timer-mode-header')).toHaveTextContent('SETS');
    });
  });

  describe('Massive Hitbox Interaction (Sets mode)', () => {
    it('increments the displayed rep count on single tap (0 -> 1 -> 2)', async () => {
      const { getByTestId } = await render(<TimerScreen />);

      const circle = getByTestId('massive-hitbox-circle');
      const valueDisplay = getByTestId('massive-circle-value');

      expect(valueDisplay).toHaveTextContent('0');

      await fireEvent.press(circle);
      expect(valueDisplay).toHaveTextContent('1');

      await fireEvent.press(circle);
      expect(valueDisplay).toHaveTextContent('2');
    });

    it('resets the rep counter to 0 on long press', async () => {
      const { getByTestId } = await render(<TimerScreen />);

      const circle = getByTestId('massive-hitbox-circle');
      const valueDisplay = getByTestId('massive-circle-value');

      // Tap to increment first
      await fireEvent.press(circle);
      expect(valueDisplay).toHaveTextContent('1');

      // Long press to reset
      await fireEvent(circle, 'onLongPress');
      expect(valueDisplay).toHaveTextContent('0');
    });

    it('pressing "Complete Set" button resets reps and switches screen to Rest mode', async () => {
      const { getByTestId } = await render(<TimerScreen />);

      const circle = getByTestId('massive-hitbox-circle');
      const completeSetBtn = getByTestId('complete-set-button');
      const header = getByTestId('timer-mode-header');

      // Tap reps
      await fireEvent.press(circle);

      // Press Complete Set
      await fireEvent.press(completeSetBtn);

      // Must transition mode to REST and reset reps
      expect(header).toHaveTextContent('REST');
      expect(getByTestId('massive-circle-value')).toHaveTextContent('0');
    });
  });

  describe('Buffer & Countdown Display (Work mode)', () => {
    it('displays "Get Ready: 3" during the buffer phase, then displays formatted countdown time (01:00) during work phase', async () => {
      const { getByTestId, queryByText } = await render(<TimerScreen />);

      // Switch to Work mode
      await fireEvent.press(getByTestId('mode-card-work'));

      // Check buffer display text
      expect(queryByText('Get Ready: 3')).toBeTruthy();

      // Check formatted time countdown display in work phase
      expect(queryByText('01:00')).toBeTruthy();
    });
  });

  describe('Quick-Config Chips (Rest mode)', () => {
    it('renders all preset chips (30s, 60s, 90s, 120s, 180s) and updates active config when pressed', async () => {
      const { getByTestId } = await render(<TimerScreen />);

      // Switch to Rest mode
      await fireEvent.press(getByTestId('mode-card-rest'));

      // Verify all preset chips are rendered
      REST_PRESET_VALUES.forEach((preset) => {
        expect(getByTestId(`rest-chip-${preset}`)).toBeTruthy();
      });

      // Press 120s preset chip
      const chip120 = getByTestId('rest-chip-120');
      await fireEvent.press(chip120);

      // 120s chip should update active rest configuration
      expect(chip120.props.accessibilityLabel).toContain('120 seconds');
      expect(getByTestId('massive-circle-value')).toHaveTextContent('120');
    });
  });
});
