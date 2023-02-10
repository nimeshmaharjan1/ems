import React from 'react';
import { Props as SelectProps } from 'react-select';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';

interface Props {
  placeholder: string;
  loadOptions: LoadOptions<any, any, any>;
}

const StyledReactSelect: React.FC<Props & SelectProps> = ({ placeholder, loadOptions, ...rest }) => {
  return (
    <AsyncPaginate
      {...rest}
      {...{ loadOptions }}
      additional={{ page: 1 }}
      noOptionsMessage={(options) => {
        if (!options.inputValue) {
          return <span>No data found.</span>;
        } else {
          return <span>Could not find {options?.inputValue}.</span>;
        }
      }}
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

        multiValue: () => 'bg-primary text-white rounded-lg px-2 ',
        singleValue: () => ' px-1',
        indicatorsContainer: () => 'px-2',
        placeholder: () => 'px-1 mb-1 opacity-80 ',
      }}
      unstyled
      placeholder={placeholder}
    ></AsyncPaginate>
  );
};

export default StyledReactSelect;
