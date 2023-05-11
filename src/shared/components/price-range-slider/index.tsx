import React from 'react';

const PriceRangeSlider = ({
  minPrice = 0,
  maxPrice = 10000,
  handlePriceChange,
}: {
  minPrice: any;
  maxPrice: any;
  handlePriceChange: any;
}) => {
  const [minValue, setMinValue] = React.useState(minPrice);
  const [maxValue, setMaxValue] = React.useState(maxPrice);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinValue = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(newMinValue);
    handlePriceChange(newMinValue, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxValue = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(newMaxValue);
    handlePriceChange(minValue, newMaxValue);
  };

  return (
    <div className="w-full mx-auto px-4">
      <div className="flex justify-between">
        <span className="text-gray-500 font-bold text-sm">Price</span>
        <span className="text-gray-500 font-bold text-sm">{`$${minValue} - $${maxValue}`}</span>
      </div>
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        value={minValue}
        onChange={handleMinChange}
        className="price-range-slider thumb-left w-full mt-4"
        style={{
          backgroundImage:
            'linear-gradient(to right, #B91D1D, #B91D1D ' +
            ((minValue - minPrice) / (maxPrice - minPrice)) * 100 +
            '%, #e5e7eb ' +
            ((minValue - minPrice) / (maxPrice - minPrice)) * 100 +
            '%, #e5e7eb)',
        }}
      />
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        value={maxValue}
        onChange={handleMaxChange}
        className="price-range-slider thumb-right w-full mt-2"
        style={{
          backgroundImage:
            'linear-gradient(to right, #e5e7eb ' +
            ((maxValue - minPrice) / (maxPrice - minPrice)) * 100 +
            '%, #e5e7eb, #B91D1D ' +
            ((maxValue - minPrice) / (maxPrice - minPrice)) * 100 +
            '%, #B91D1D)',
        }}
      />
    </div>
  );
};

export default PriceRangeSlider;
