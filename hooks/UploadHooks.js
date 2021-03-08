import {useState} from 'react';
import {validator} from '../utils/Validator';

const constraints = {
  rating: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 1,
      maximum: 1,
      message: 'must be 1 - 5',
    },
  },
  title: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'min length is 3 characters',
    },
  },
  description: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 5,
      message: 'min length is 5 characters',
    },
  },
};

const useUploadForm = (callback) => {
  const [inputs, setInputs] = useState({
    rating: 1,
    title: '',
    description: '',
  });
  const [uploadErrors, setUploadErrors] = useState({});

  const handleInputChange = (name, text) => {
    console.log(name, text);
    // console.log('inputs state', inputs);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
    const error = validator(name, text, constraints);
    setUploadErrors((uploadErrors) => {
      return {
        ...uploadErrors,
        [name]: error,
      };
    });
  };

  const reset = () => {
    setInputs({
      rating: 1,
      title: '',
      description: '',
    });
    setUploadErrors({});
  };

  return {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  };
};

export default useUploadForm;
