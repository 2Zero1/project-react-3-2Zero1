import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import validate from '../utils/validate';
import { getField } from '../utils/utils';

import ContentsForm from '../presentational/ContentsForm';

import {
  setInputFieldsError,
  changeInputFieldValue,
} from '../state/commonSlice';

export default function ContentsFormContainer({
  onClickNext,
  onClickPrevious,
  checkValidAccess,
}) {
  const dispatch = useDispatch();

  const {
    writePageIndex,
    inputFields,
  } = useSelector((state) => (
    {
      writePageIndex: state.writePageIndex,
      inputFields: state.inputFields,
    }
  ));

  const getChangeHandler = (page, type) => ((value) => {
    dispatch(changeInputFieldValue({
      page,
      type,
      value,
    }));
  });

  const {
    write: { contents },
  } = inputFields;

  checkValidAccess(writePageIndex);

  const fields = {
    contents: getField({
      field: contents,
      id: 'contents',
      onChange: getChangeHandler('write', 'contents'),
    }),
  };

  function handleError([key, checked]) {
    dispatch(setInputFieldsError({
      page: 'write',
      type: key,
      error: !checked,
    }));
  }

  function handleClick() {
    validate(fields, handleError, onClickNext);
  }

  return ((
    <ContentsForm
      contents={fields.contents}
      onHandleClick={handleClick}
      onClickPrevious={onClickPrevious}
    />
  ));
}
