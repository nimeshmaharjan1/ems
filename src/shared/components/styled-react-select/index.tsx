import { useTheme } from 'next-themes';
import React from 'react';
import { Props as SelectProps } from 'react-select';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';

interface Props {
  placeholder: string;
  loadOptions: LoadOptions<any, any, any>;
  isRequired?: boolean;
}

const StyledReactSelect: React.FC<Props & SelectProps> = ({ placeholder, loadOptions, isRequired, ...rest }) => {
  const { theme } = useTheme();

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

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
          return `min-h-[40px] block ${theme === 'night' ? 'border-neutral-focus' : 'border'} ${
            isRequired ? 'border-error' : ''
          } border rounded-lg`;
        },

        menuList: () => {
          return 'border rounded-lg bg-base-200';
        },
        container: () => {
          return 'bg-base-300 min-h-[40px] rounded-lg bg-transparent';
        },
        option: () => {
          return 'hover:bg-primary hover:text-white px-2 py-1';
        },
        valueContainer: () => 'flex gap-2 p-2',

        multiValue: () => 'bg-primary text-white rounded-lg px-2 ',
        singleValue: () => `px-1 ${isRequired ? 'text-error' : ''}`,
        indicatorsContainer: () => 'px-2',
        placeholder: () => 'px-1 opacity-80 ',
      }}
      unstyled
      instanceId={'styled-react-select'}
      placeholder={placeholder}
    ></AsyncPaginate>
  );
};

export default StyledReactSelect;
