import React from 'react';

import { render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';

import EntrancePage from './EntrancePage';

import inputFields from '../fixtures/inputFields';
import entrance from '../fixtures/entrance';

test('EntrancePage', () => {
  const SENDER = entrance.sender;
  const dispatch = jest.fn();
  useDispatch.mockImplementation(() => dispatch);
  useSelector.mockImplementation((selector) => selector({
    entrance,
    inputFields,
  }));

  const { getByText } = render((
    <EntrancePage />
  ));
  expect(getByText(`${SENDER}님으로 부터 엽서가 도착했어요.`)).not.toBeNull();
});
