import { FC, JSXElementConstructor, Key, ReactElement, ReactFragment, useCallback, useEffect, useRef, useState } from 'react';

interface Props<T> {
  results?: any;
  // results?: T[];
  // renderItem(item: T): JSX.Element;
  onChange?: React.ChangeEventHandler;
  onSelect?: (item: T) => void;
  value?: string;
  ref: any;
  isSuccess?: boolean;
}

const Combobox = <T extends object>({
  results = [],
  // renderItem,
  value,
  onChange,
  onSelect,
  ref,
  isSuccess = false,
}: Props<T>): JSX.Element => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const resultContainer = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [defaultValue, setDefaultValue] = useState('');

  const handleSelection = (selectedIndex: number) => {
    const selectedItem = results[selectedIndex];
    if (!selectedItem) return resetSearchComplete();
    onSelect && onSelect(selectedItem);
    resetSearchComplete();
  };

  const resetSearchComplete = useCallback(() => {
    setFocusedIndex(-1);
    setShowResults(false);
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const { key } = e;
    let nextIndexCount = 0;

    // move down
    if (key === 'ArrowDown') nextIndexCount = (focusedIndex + 1) % results.length;

    // move up
    if (key === 'ArrowUp') nextIndexCount = (focusedIndex + results.length - 1) % results.length;

    // hide search results
    if (key === 'Escape') {
      resetSearchComplete();
    }

    // select the current item
    if (key === 'Enter') {
      e.preventDefault();
      handleSelection(focusedIndex);
    }

    setFocusedIndex(nextIndexCount);
  };

  type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: changeHandler = (e) => {
    setDefaultValue(e.target.value);
    onChange && onChange(e);
  };

  useEffect(() => {
    if (!resultContainer.current) return;

    resultContainer.current.scrollIntoView({
      block: 'center',
    });
  }, [focusedIndex]);
  useEffect(() => {
    if (results.pages[0].length > 0 && !showResults) setShowResults(true);

    if (results.pages[0].length <= 0) setShowResults(false);
  }, [results, showResults]);

  useEffect(() => {
    if (value) setDefaultValue(value);
  }, [value]);

  return (
    <div className="z-50 flex justify-center flex-1">
      <div tabIndex={1} onBlur={resetSearchComplete} onKeyDown={handleKeyDown} className="relative lg:w-[32rem]">
        <input
          value={defaultValue}
          onChange={handleChange}
          type="text"
          className="w-full px-4 py-2 transition border-2 border-gray-400 rounded-lg outline-none bg-base-100 focus:border-gray-700"
          placeholder="Search your query..."
        />

        {/* Search Results Container */}
        {showResults && isSuccess && (
          <div className="absolute z-50 w-full p-2 mt-1 overflow-y-auto bg-white rounded-bl rounded-br shadow-lg max-h-56">
            {results.pages.map((page: any[]) =>
              page.map(
                (
                  product: {
                    title:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | ReactFragment
                      | null
                      | undefined;
                  },
                  productIndex: number
                ) => {
                  if (page.length === productIndex - 3) {
                    return (
                      <div
                        ref={ref}
                        key={productIndex}
                        // onMouseDown={() => handleSelection(productIndex)}
                        style={{
                          backgroundColor: productIndex === focusedIndex ? 'rgba(0,0,0,0.1)' : '',
                        }}
                        className="z-50 p-2 cursor-pointer hover:bg-black hover:bg-opacity-10">
                        {product.title}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={productIndex}
                      onMouseDown={() => handleSelection(productIndex)}
                      style={{
                        backgroundColor: productIndex === focusedIndex ? 'rgba(0,0,0,0.1)' : '',
                      }}
                      className="z-50 p-2 cursor-pointer hover:bg-black hover:bg-opacity-10">
                      {product.title}
                    </div>
                  );
                }
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Combobox;
