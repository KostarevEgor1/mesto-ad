const isValidText = (value) => {
  const textRegex = /^[-\sА-Яа-яЁёa-zA-Z]+$/;
  return textRegex.test(value);
};

const showInputError = (inputElement, errorMessage, config) => {
  const errorElement = document.getElementById(`${inputElement.id}-error`);

  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

const hideInputError = (inputElement, config) => {
  const errorElement = document.getElementById(`${inputElement.id}-error`);

  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
};

const checkInputValidity = (inputElement, config) => {
  let errorMessage = '';

  if (inputElement.validity.valueMissing) {
    errorMessage = 'Это обязательное поле.';
  } else if (inputElement.validity.tooShort || inputElement.validity.tooLong) {
    errorMessage = `Должно быть от ${inputElement.minLength} до ${inputElement.maxLength} символов.`;
  } else if (inputElement.type === 'url' && inputElement.validity.typeMismatch) {
    errorMessage = 'Нужно ввести URL.';
  } else if (
    (inputElement.classList.contains('popup__input_type_name') ||
      inputElement.classList.contains('popup__input_type_card-name')) &&
    !isValidText(inputElement.value)
  ) {
    errorMessage = inputElement.dataset.errorMessage ||
      'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
  }

  if (errorMessage) {
    showInputError(inputElement, errorMessage, config);
  } else {
    hideInputError(inputElement, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

const disableSubmitButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

const enableSubmitButton = (buttonElement, config) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(config.inactiveButtonClass);
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, config);
  } else {
    enableSubmitButton(buttonElement, config);
  }
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  disableSubmitButton(buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

export const clearValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(inputElement, config);
  });

  disableSubmitButton(buttonElement, config);
};

export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};