import { createSlice } from '@reduxjs/toolkit';

import { saveItem } from '../services/storage';

import {
  fetchEntrance,
  postPhoto,
  postPostcard,
  postCheckValidPostcard,
  fetchPostcard,
} from '../services/api';

// import { saveItem } from './services/storage';

// import { equal } from './utils';

const initialInputFields = {
  entrance: {
    secretMessage: {
      value: '',
      error: false,
    },
  },
  write: {
    isPrivate: true,
    secretMessage: {
      value: '',
      error: false,
    },
    sender: {
      value: '',
      error: false,
    },
    receiver: {
      value: '',
      error: false,
    },
    contents: {
      value: '',
      error: '',
    },
    photo: {
      value: '',
      error: false,
    },
    photoMessage: {
      value: '',
      error: false,
    },
    preview: {
      isFrontPage: true,
    },
    complete: {
      key: '',
      secretMessage: '',
    },
  },
};

const { actions, reducer } = createSlice({
  name: 'application',
  initialState: {
    writePageIndex: 0,
    inputFields: initialInputFields,
    entrance: {
      sender: '테스트',
      isPrivate: false,
      postcardCount: 5,
      writtenCount: 0,
      movePage: false,
    },
    postcard: {
      isFrontPage: true,
      sender: '',
      receiver: '',
      contents: '',
      photoUrl: '',
      photoMessage: '',
    },
    movingPage: '',
  },
  reducers: {
    changeRadioChecked(state, { payload: value }) {
      return {
        ...state,
        inputFields: {
          ...state.inputFields,
          write: {
            ...state.inputFields.write,
            isPrivate: value,
          },
        },
      };
    },
    changeInputFieldValue(state, { payload: { page, type, value } }) {
      return {
        ...state,
        inputFields: {
          ...state.inputFields,
          [page]: {
            ...state.inputFields[page],
            [type]: {
              ...state.inputFields[page][type],
              value,
            },
          },
        },
      };
    },
    setInputFieldsError(state, { payload: { page, type, error } }) {
      return {
        ...state,
        inputFields: {
          ...state.inputFields,
          [page]: {
            ...state.inputFields[page],
            [type]: {
              ...state.inputFields[page][type],
              error,
            },
          },
        },
      };
    },
    increaseWritePageIndex(state) {
      return {
        ...state,
        writePageIndex: (+state.writePageIndex) + 1,
      };
    },
    decreaseWritePageIndex(state) {
      return {
        ...state,
        writePageIndex: (+state.writePageIndex) - 1,
      };
    },
    flipPreviewPostcard(state) {
      return {
        ...state,
        inputFields: {
          ...state.inputFields,
          write: {
            ...state.inputFields.write,
            preview: {
              ...state.inputFields.write.preview,
              isFrontPage: !state.inputFields.write.preview.isFrontPage,
            },
          },
        },
      };
    },
    flipPostcard(state) {
      const { postcard } = state;
      const { isFrontPage } = postcard;
      return {
        ...state,
        postcard: {
          ...postcard,
          isFrontPage: !isFrontPage,
        },
      };
    },
    setPostcardFront(state) {
      return {
        ...state,
        postcard: {
          ...state.postcard,
          isFrontPage: true,
        },
      };
    },
    setEntrance(state, { payload: value }) {
      return {
        ...state,
        entrance: {
          ...value,
        },
      };
    },
    setWriteCompleteValues(state, { payload: { url, secretMessage } }) {
      return {
        ...state,
        inputFields: {
          ...state.inputFields,
          write: {
            ...state.inputFields.write,
            complete: {
              url,
              secretMessage,
            },
          },
        },
      };
    },
    resetPostcardInputFields(state) {
      return {
        ...state,
        inputFields: {
          entrance: {
            secretMessage: {
              value: '',
              error: false,
            },
          },
          write: {
            isPrivate: true,
            secretMessage: {
              value: '',
              error: false,
            },
            sender: {
              value: '',
              error: false,
            },
            receiver: {
              value: '',
              error: false,
            },
            contents: {
              value: '',
              error: '',
            },
            photo: {
              value: '',
              error: false,
            },
            photoMessage: {
              value: '',
              error: false,
            },
            preview: {
              isFrontPage: true,
            },
            complete: {
              key: '',
              secretMessage: '',
            },
          },
        },
      };
    },
    setPostcard(state, { payload: value }) {
      return {
        ...state,
        postcard: {
          ...state.postcard,
          ...value,
        },
      };
    },
    admitPostcardAccess(state) {
      return {
        ...state,
        entrance: {
          ...state.entrance,
          movePage: true,
        },
      };
    },
    setMovingPage(state, { payload: value }) {
      return {
        ...state,
        movingPage: value,
      };
    },
  },
});

export const {
  changeInputFieldValue,
  setInputFieldsError,
  changeRadioChecked,
  increaseWritePageIndex,
  decreaseWritePageIndex,
  flipPostcard,
  flipPreviewPostcard,
  setPostcardFront,
  setEntrance,
  setWriteCompleteValues,
  resetPostcardInputFields,
  setPostcard,
  admitPostcardAccess,
  setMovingPage,
} = actions;

export function loadEntrance({ key }) {
  return async (dispatch) => {
    const response = await fetchEntrance({ key });

    if (response.error) {
      const { move } = response.error;
      dispatch(setMovingPage(move));
      return;
    }

    // 성공할 경우
    saveItem('postcardKey', key);

    dispatch(setEntrance(response.data));
  };
}

export function sendPhoto({ file }) {
  return async (dispatch) => {
    const photo = await postPhoto({ file });
    dispatch(changeInputFieldValue({
      page: 'write',
      type: 'photo',
      value: photo,
    }));
  };
}

export function sendPostcard({ postcardValues, onClickNext }) {
  return async (dispatch) => {
    const response = await postPostcard(postcardValues);

    if (response.error) {
      const { move } = response.error;
      dispatch(setMovingPage(move));
      return;
    }

    const { url, secretMessage } = response.data;
    dispatch(setWriteCompleteValues({
      url,
      secretMessage,
    }));
    onClickNext();
  };
}

export function checkValidPostcard({ key, secretMessage }) {
  return async (dispatch) => {
    const response = await postCheckValidPostcard({ key, secretMessage });

    if (response.error) {
      const { move } = response.error;
      dispatch(setMovingPage(move));
      return;
    }

    const { success } = response.data;

    if (success) {
      saveItem('secretMessage', secretMessage);

      dispatch(admitPostcardAccess());
    } else {
      dispatch(setInputFieldsError({
        page: 'entrance',
        type: 'secretMessage',
        error: true,
      }));
    }
  };
}

export function loadPostcard({ key, secretMessage }) {
  return async (dispatch) => {
    const response = await fetchPostcard({ key, secretMessage });

    if (response.error) {
      const { move } = response.error;
      dispatch(setMovingPage(move));
      return;
    }

    const {
      sender,
      receiver,
      photo,
      contents,
      photoMessage,
    } = response.data;

    dispatch(setPostcard({
      sender,
      receiver,
      photoUrl: photo,
      contents,
      photoMessage,
    }));
  };
}

export default reducer;
