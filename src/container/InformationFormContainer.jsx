import React from 'react'

import InformationForm from '../presentational/InformationForm';

import placeholders from '../text/placeholders';
import errorMessages from '../text/errorMessages';
import { useDispatch, useSelector } from 'react-redux';
import validator from '../utils/validate';
import { getField } from '../utils/utils'

import {
  changeInputFieldValue,
  changeRadioChecked,
  setInputFieldsError,
} from '../state/slice';

export default function InformationFormContainer({
  onClickNext,
  onClickPrevious,
  getChangeHandler,
  checkValidAccess,
}) {

  const dispatch = useDispatch();

  const {
    writePageIndex,
    inputFields: {
      write: {
        sender,
        receiver,
        secretMessage,
        isPrivate,
      },
    }
  } = useSelector((state) => ({
      writePageIndex: state.writePageIndex,
      inputFields: state.inputFields,
  }));

  checkValidAccess(writePageIndex);

  const fields = {
    sender: getField({
      field: sender,
      id: 'sender',
      name: '보내는 사람',
      onChange: getChangeHandler('sender'),
    }),
    receiver: getField({
      field: receiver,
      id: 'receiver',
      name: '받는 사람',
      onChange: getChangeHandler('receiver'),
    }),
    secretMessage: getField({
      field: secretMessage,
      id: 'secretMessage',
      name: '비밀 메시지',
      onChange: getChangeHandler('secretMessage'),
    }),
  };

  function handleRadioChange(event) {
    const { target: { value } } = event;
    dispatch(changeRadioChecked(value));
  }

  function handleClick() {
    const checks = validator(fields);

    checks.forEach(([key, checked]) => {
      dispatch(setInputFieldsError({
        page: 'write',
        type: key,
        error: !checked,
      }));
    });
    
    if(checks.filter(([_, check]) => !check).length === 0) {
      onClickNext();
    }
  }

  return (
    <>
      <InformationForm
        onHandleClick={handleClick}
        fields={fields}
        isPrivate={isPrivate}
        onRadioChange={handleRadioChange}
        onClickPrevious={onClickPrevious}
      />
    </>
  );
}
