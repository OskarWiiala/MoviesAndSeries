import {useState} from 'react';

const useSearchForm = (callback) => {
  const [inputs, setInputs] = useState({
    text: '',
  });

  const handleInputChange = (name, text) => {
    // console.log(name, text);
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

export default useSearchForm;
