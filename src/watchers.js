import onChange from 'on-change';
import { get } from 'lodash';
import state from './state.js';

const input = document.querySelector('input');
const label = document.querySelector('.result');
const modal = document.getElementById('myModal');
const modalHeader = document.querySelector('.modal-header');
const modalTitle = modalHeader.querySelector('h2');
const modalBody = document.querySelector('.modal-body');
const button = document.querySelector('#main');
const spinner = document.querySelector('#spinner');
const wrapper = document.querySelector('#spin-wrapper');

const handleStatus = (status) => {
  switch (status) {
    case 'loading':
      button.disabled = true;
      spinner.classList = 'spinner';
      wrapper.classList = 'spin-wrapper';
      break;
    case 'pending':
      button.disabled = false;
      spinner.classList = '';
      wrapper.classList = '';
      break;
    case 'success':
      label.classList = 'result text-success';
      input.classList = 'form-control mb-2';
      input.value = '';
      break;
    case 'error':
      button.disabled = false;
      spinner.classList = '';
      wrapper.classList = '';
      label.classList = 'result text-danger';
      input.classList = 'form-control mb-2 is-invalid';
      break;
    default:
      throw new Error(`Unknown status - ${status}`);
  }
};

const getCheckValidPath = (path) => {
  if (!get(state, path)) {
    throw new Error(`Invalid path - ${path}`);
  }
  return 'valid path in watchedState';
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'form.status':
      handleStatus(value);
      break;
    case 'input.value':
      input.value = value;
      break;
    case 'modal.currentPost.description':
      modalBody.textContent = value;
      break;
    case 'modal.currentPost.title':
      modalTitle.textContent = value;
      break;
    case 'form.label.text':
      label.innerHTML = value;
      break;
    case 'errors':
      state.form.label.text = value;
      label.innerHTML = (state.errors.at(-1)).message;
      break;
    default:
      getCheckValidPath(path);
  }
});

export {
  input, label, modal, watchedState,
};
