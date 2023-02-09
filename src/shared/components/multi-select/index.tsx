import { useTheme } from 'next-themes';
import React from 'react';
import Select, { StylesConfig } from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const MultiSelect = () => {
  const { resolvedTheme } = useTheme();
  const customStyles: StylesConfig = {
    control: (base, state) => ({
      ...base,
      '&:hover': { borderColor: '#b2b2b2' },
      borderColor: state.isFocused ? '#5a67d8' : '#b2b2b2',
      '&:active': { borderColor: '#5a67d8' },
    }),
    option: (base, state) => ({
      ...base,
      '&:hover': { backgroundColor: '#5a67d8', color: '#fff' },
      className: state.isSelected ? 'bg-red-500' : 'bg-white',
    }),
  };
  return (
    <Select
      options={options}
      styles={customStyles}
      className="max-w-xs shadow-md  focus:!outline-none transition duration-300 ease-in-out"
    />
  );
};

export default MultiSelect;
