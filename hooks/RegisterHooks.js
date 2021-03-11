// RegisterHooks.js:
import {useState} from 'react';
import {useUser} from './ApiHooks';
import {validator} from '../utils/Validator';

const constraints = {
  username: {
    presence: {
      message: 'Cannot be empty'
    },
    length: {
      minimum: 3,
      message: 'Minimum length is 3 characters'
    }
  },

  password: {
    equality: 'password'
  },

  confirmPassword: {
    presence: {
      message: 'Cannot be empty'
    },
    length: {
      minimum: 5,
      message: 'Minimum length is 5 characters'
    }
  },

  email: {
    presence: {
      message: 'Cannot be empty'
    },
    email: {
      message: 'is not valid'
    }
  },

  full_name: {
    length: {
      minimum: 5,
      message: 'Minimum length is 5 characters'
    }
  }
};

const useSignUpForm = (callback) => {
  const [registerErrors, setRegisterErrors] = useState({});
  const {checkIsUserAvailable} = useUser();

  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    email: '',
    full_name: ''
  });

  const handleInputChange = (name, text) => {
    console.log(name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text
      };
    });
  };

  const handleInputEnd = (name, text) => {
    console.log('input end text', text);
    if (text === '') {
      text = null;
    }

    let error;
    if (name === 'confirmPassword') {
      error = validator(name,
        {password: inputs.password, confirmPassword: text}, constraints);
    } else {
      error = validator(name, text, constraints);
    }

    // const error = validator(name, text, constraints);
    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        [name]: error
      };
    });
  };

  const checkPasswordMatch = async () => {
    console.log("logging", inputs.password);
    let error;
      if (inputs.password != inputs.confirmPassword) {
        setRegisterErrors((registerErrors) => {
          return {
            ...registerErrors,
            confirmPassword: 'Passwords do not match',
          };
        });
      } else {
        setRegisterErrors((registerErrors) => {
          return {
            ...registerErrors,
            confirmPassword: '',

          };
        });
  }
  }

  const checkUserAvailable = async (event) => {
    console.log('usernameInput', event.nativeEvent.text);

    try {
      const result = await checkIsUserAvailable(event.nativeEvent.text);
      if (!result) {
        setRegisterErrors((registerErrors) => {
          return {
            ...registerErrors,
            username: 'Username already exists'
          };
        });
      }
    } catch (error) {
      console.log('reg checkUserAvailable error', error);
    }
  };

  const validateOnSend = () => {
    const usernameError = validator('username', inputs.username, constraints);
    const passwordError = validator('username', inputs.password, constraints);
    const confirmError = validator('username', inputs.confirmPassword,
      {password: inputs.password, confirmPassword: inputs.confirmPassword},
      constraints);
    const emailError = validator('username', inputs.email, constraints);
    const fullnameError = validator('username', inputs.full_name, constraints);
    const matchingError = validator('username', inputs.confirmPassword, constraints);

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        username: usernameError,
        password: passwordError,
        confirmPassword: confirmError,
        email: emailError,
        full_name: fullnameError,
        confirmPassword: matchingError,
      };
    });

    if(usernameError !== null || passwordError !== null || confirmError !== null || emailError !== null  || fullnameError !== null || matchingError !== null || inputs.password !== inputs.confirmPassword) {
      return false;
    }

    return true;
  };

  return {
    handleInputChange,
    inputs,
    validateOnSend,
    checkUserAvailable,
    registerErrors,
    handleInputEnd,
    checkPasswordMatch,
  };
};

export default useSignUpForm;
