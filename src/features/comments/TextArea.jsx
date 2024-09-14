import { useEffect, useRef, useState } from 'react';
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from '../comments/commentsApiSlice';
import { useDispatch } from 'react-redux';
import { createToast } from '../toast/toastsSlice';
import useAuth from '../../hooks/useAuth';
import '../../styles/Textarea.scss';

const TextArea = ({ movieId, userComment, setResetCache, setPage }) => {
  const dispatch = useDispatch();

  const auth = useAuth();

  const [text, setText] = useState('');
  const [textareaPlaceholder, setTextareaPlaceholder] = useState(
    'Enter your comment...'
  );
  const [textareaInvalid, setTextareaInvalid] = useState(false);
  const [textareaErrorMessage, setTextareaErrorMessage] = useState('');
  // The 2 states bellow handle the case where a user is logged in and verified and has not left a comment already!
  // All other cases are handled in the useEffect hook
  const [buttonDisabled, setButtonDisabled] = useState({
    cancel: true,
    edit: true,
    submit: false,
  });
  const [buttonDescription, setButtonDescription] = useState({
    cancel: 'Leave a comment first.',
    edit: 'Leave a comment first.',
    submit: '',
  });

  const textareaRef = useRef(null);
  const autoUpdateTextRef = useRef(true);

  const [addComment] = useAddCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextInvalid = (e) => {
    const validity = e.target.validity;
    if (validity.valueMissing) {
      setTextareaInvalid(true);
      setTextareaErrorMessage('Textarea field is required.');
    } else if (validity.tooShort) {
      setTextareaInvalid(true);
      setTextareaErrorMessage('Your comment is too short.');
    } else if (validity.tooLong) {
      setTextareaInvalid(true);
      setTextareaErrorMessage('Your comment is too long.');
    }
  };

  const handleCancelClick = (e) => {
    if (buttonDisabled.cancel) {
      e.preventDefault();
    } else if (userComment) {
      setText(userComment?.text);
      setButtonDisabled((n) => ({
        ...n,
        cancel: true,
        edit: false,
        submit: true,
      }));
      setButtonDescription((n) => ({
        ...n,
        cancel: 'Press the edit button',
        edit: '',
        submit: 'Press the edit button',
      }));

      textareaRef.current.setAttribute('readOnly', '');
    } else {
      setText('');
      setButtonDisabled((n) => ({
        ...n,
        cancel: true,
        edit: true,
        submit: false,
      }));
      setButtonDescription((n) => ({
        ...n,
        cancel: 'Enter a comment first',
        edit: 'Enter a comment first',
        submit: '',
      }));

      textareaRef.current.removeAttribute('readOnly');
    }
  };

  const handleEditClick = (e) => {
    if (buttonDisabled.edit) {
      e.preventDefault();
    } else {
      setButtonDisabled((n) => ({
        ...n,
        cancel: false,
        edit: true,
        submit: false,
      }));
      setButtonDescription((n) => ({
        ...n,
        cancel: '',
        edit: 'Edit already enabled',
        submit: '',
      }));

      textareaRef.current.removeAttribute('readOnly');
      textareaRef.current.focus();
    }
  };

  const handleDeleteClick = async (e) => {
    if (!userComment) {
      e.preventDefault();
    } else {
      try {
        await deleteComment({ id: userComment._id }).unwrap();
        setResetCache(true);
        setPage(1);
        setText('');
        setTextareaPlaceholder('Enter your comment...');
        setButtonDisabled((n) => ({
          ...n,
          cancel: true,
          edit: true,
          submit: false,
        }));

        setButtonDescription((n) => ({
          ...n,
          cancel: 'Submit a comment first',
          edit: 'Submit a comment first',
          submit: '',
        }));
        textareaRef.current.removeAttribute('readOnly');
        autoUpdateTextRef.current = false;
        dispatch(createToast('success', 'Comment deleted'));
      } catch (err) {
        dispatch(createToast('error', err.data.message));
      }
    }
  };

  const handleSubmitClick = (e) => {
    if (buttonDisabled.submit) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTextareaInvalid(false);
    setTextareaErrorMessage('');

    if (e.target.checkValidity()) {
      try {
        if (!userComment) {
          await addComment({
            movieId,
            userId: auth?.id,
            name: auth?.username,
            text,
          }).unwrap();
          dispatch(createToast('success', 'Comment added'));
        } else {
          if (userComment.text === text) {
            dispatch(createToast('success', 'No changes detected'));
          } else {
            await updateComment({ id: userComment._id, text }).unwrap();
            dispatch(createToast('success', 'Comment updated'));
          }
        }
        setResetCache(true);
        setPage(1);
        setButtonDisabled((n) => ({
          ...n,
          cancel: true,
          edit: false,
          submit: true,
        }));
        setButtonDescription((n) => ({
          ...n,
          cancel: 'Press the edit button',
          edit: '',
          submit: 'Press the edit button',
        }));
        textareaRef.current.setAttribute('readOnly', '');
        autoUpdateTextRef.current = false;
      } catch (err) {
        dispatch(createToast('error', err.data.message));
      }
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    // User not logged in.
    if (!auth?.id) {
      setTextareaPlaceholder('You must sign up, in order to leave a comment.');
      textarea.setAttribute('readOnly', '');
      setButtonDisabled((n) => ({
        ...n,
        cancel: true,
        edit: true,
        submit: true,
      }));
      setButtonDescription((n) => ({
        ...n,
        cancel: 'You must sign up',
        edit: 'You must sign up',
        submit: 'You must sign up',
      }));
      // User not verified.
    } else if (auth && !auth.isVerified) {
      setTextareaPlaceholder(
        'You must verify your account, in order to leave a comment.'
      );
      textarea.setAttribute('readOnly', '');
      setButtonDisabled((n) => ({
        ...n,
        cancel: true,
        edit: true,
        submit: true,
      }));

      setButtonDescription((n) => ({
        ...n,
        cancel: 'Verify your account',
        edit: 'Verify your account',
        submit: 'Verify your account',
      }));

      // User logged in and verified.
    } else if (auth && auth?.isVerified) {
      // If comment already exists set the textarea text to the comment text ONCE.
      if (userComment && autoUpdateTextRef.current) {
        textarea.setAttribute('readOnly', '');
        setText(userComment?.text);
        setButtonDisabled((n) => ({
          ...n,
          cancel: true,
          edit: false,
          submit: true,
        }));
        setButtonDescription((n) => ({
          ...n,
          cancel: 'Press the edit button',
          edit: '',
          submit: 'Press the edit button',
        }));
      } else if (!userComment && autoUpdateTextRef.current) {
        setTextareaPlaceholder('Enter your comment...');
        setText('');
        setButtonDisabled((n) => ({
          ...n,
          cancel: true,
          edit: true,
          submit: false,
        }));

        setButtonDescription((n) => ({
          ...n,
          cancel: 'Submit a comment first',
          edit: 'Submit a comment first',
          submit: '',
        }));
        // Reset the readonly attribute that gets added from above because until the fetching completes
        // the above statements are true (user not logged in)
        textarea.removeAttribute('readOnly');
      }
      // Reset automatic update
      autoUpdateTextRef.current = true;
    }
  }, [auth, userComment]);

  return (
    <form className='textarea__form' onSubmit={handleSubmit} noValidate>
      <label htmlFor='movie-textarea' className='textarea__label'>
        {userComment ? 'Edit' : 'Add'} comment
      </label>
      <textarea
        ref={textareaRef}
        id='movie-textarea'
        className='textarea__textarea'
        minLength='15'
        maxLength='700'
        placeholder={textareaPlaceholder}
        required
        aria-invalid={textareaInvalid}
        aria-describedby='movie-textarea-error'
        value={text}
        onChange={handleTextChange}
        onInvalid={handleTextInvalid}></textarea>
      <p
        aria-live='assertive'
        id='movie-textarea-error'
        className='textarea__error'>
        {textareaErrorMessage}
      </p>
      <div className='textarea__button-group'>
        <button
          type='button'
          className='textarea__button textarea__button--cancel'
          aria-describedby='movie-cancel-button-desc'
          aria-disabled={buttonDisabled.cancel}
          onClick={handleCancelClick}>
          Cancel
        </button>
        <span id='movie-cancel-button-desc' className='visually-hidden'>
          {buttonDescription.cancel}
        </span>
        <button
          type='button'
          className='textarea__button textarea__button--edit'
          aria-describedby='movie-edit-button-desc'
          aria-disabled={buttonDisabled.edit}
          onClick={handleEditClick}>
          Edit
        </button>
        <span id='movie-edit-button-desc' className='visually-hidden'>
          {buttonDescription.edit}
        </span>
        <button
          type='button'
          aria-disabled={userComment ? false : true}
          aria-describedby='movie-delete-button-desc'
          className='textarea__button textarea__button--delete'
          onClick={handleDeleteClick}>
          Delete
        </button>
        <span id='movie-delete-button-desc' className='visually-hidden'>
          {userComment ? '' : 'No comment to delete'}
        </span>
        <button
          type='submit'
          aria-describedby='movie-submit-button-desc'
          aria-disabled={buttonDisabled.submit}
          className='textarea__button textarea__button--submit'
          onClick={handleSubmitClick}>
          Submit
        </button>
        <span id='movie-submit-button-desc' className='visually-hidden'>
          {buttonDescription.submit}
        </span>
      </div>
    </form>
  );
};

export default TextArea;
