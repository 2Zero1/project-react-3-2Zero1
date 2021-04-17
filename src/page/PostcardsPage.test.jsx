import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import postcards from '../fixtures/postcards';

import PostcardsPage from './PostcardsPage';

const mockGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory() {
    return { goBack: mockGoBack };
  },
}));

describe('PostcardsPage', () => {
  const dispatch = jest.fn();
  useDispatch.mockImplementation(() => dispatch);

  useSelector.mockImplementation((selector) => selector({
    postcards,
  }));
  function renderPostcardsPage() {
    return render((
      <MemoryRouter>
        <PostcardsPage />
      </MemoryRouter>
    ));
  }

  it('shows postcards', () => {
    const { getByText } = renderPostcardsPage();

    expect(getByText('엽서 모음')).not.toBeNull();

    expect(getByText('이전')).not.toBeNull();

    fireEvent.click(getByText('이전'));

    expect(mockGoBack).toBeCalled();

    postcards.forEach((postcard) => {
      expect(getByText(`${postcard.receiver}님이 받은 엽서`)).not.toBeNull();
      expect(getByText(postcard.photoMessage)).not.toBeNull();
    });
  });
});
