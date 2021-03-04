import {useState} from 'react';

const useSearchForm = () => {
  const [inputs, setInputs] = useState({
    title: '',
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

export default useSearchForm;
