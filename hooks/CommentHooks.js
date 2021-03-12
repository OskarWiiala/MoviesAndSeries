import {useState} from 'react';

/** Hooks for comments */

const useCommentForm = () => {
  const [inputs, setInputs] = useState({
    comment: 'empty comment',
  });

  const handleInputChange = (name, text) => {
    console.log(name, text);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };
  return {
    handleInputChange,
    inputs,
  };
};

export default useCommentForm;
