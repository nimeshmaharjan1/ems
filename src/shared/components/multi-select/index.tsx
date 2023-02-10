import React from 'react';
import ReactSelect, { Props as SelectProps } from 'react-select';

interface Props {
  placeholder: string;
}

const StyledReactSelect: React.FC<Props & SelectProps> = ({ placeholder, ...rest }) => {
  return (
    <ReactSelect
      {...rest}
      classNames={{
        control: () => {
          return 'min-h-[48px] block border-neutral-focus max-w-xs border rounded-lg';
        },

        menuList: () => {
          return 'max-w-xs border rounded-lg bg-base-200';
        },
        container: () => {
          return 'bg-base-300 min-h-[48px] rounded-lg bg-transparent';
        },
        option: () => {
          return 'hover:bg-primary hover:text-white px-2 py-1';
        },
        valueContainer: () => 'flex gap-2 p-2',

        multiValue: () => 'bg-primary text-white rounded-lg px-2 text-sm',
        singleValue: () => 'text-sm px-1',
        indicatorsContainer: () => 'px-2',
        placeholder: () => 'px-1 mb-1 opacity-80 text-sm',
      }}
      unstyled
      placeholder={placeholder}
      options={[
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
      ]}
    ></ReactSelect>
  );
};

export default StyledReactSelect;
