import React from 'react';

const ShopByAside = () => {
  return (
    <>
      <header className="mb-6 text-2xl font-bold md:font-medium  md:text-xl uppercase border-b relative mt-1 pb-[0.65rem] box-border">
        Shop By
        {/* <span
            className="bg-primary"
            style={{
              content: '',
              width: '70px',
              height: '2px',
              display: 'inline-block',
              position: 'absolute',
              bottom: '-0.5px',
              left: '0',
            }}
          ></span> */}
      </header>
      <div className="border-2 p-6">
        <section className="brand-section mb-6 pb-2 border-b border-gray-300">
          <h3 className="uppercase">brands</h3>
          <div className="form-control my-1">
            <label className="label !justify-start gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-sm " />
              <span className="label-text">Acer</span>
            </label>
            <label className="label !justify-start gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-sm " />
              <span className="label-text">Apple</span>
            </label>
            <label className="label !justify-start gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-sm " />
              <span className="label-text">Asus</span>
            </label>
            <label className="label !justify-start gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-sm " />
              <span className="label-text">Dell</span>
            </label>
          </div>
        </section>

        <section className="type-section mb-6 border-b border-gray-300 pb-4">
          <h3 className="uppercase">Type</h3>
          <label className="label !justify-start gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm " />
            <span className="label-text">Gaming</span>
          </label>
          <label className="label !justify-start gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm " />
            <span className="label-text">Notebook</span>
          </label>
          <label className="label !justify-start gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm " />
            <span className="label-text">Designer</span>
          </label>
        </section>
        <section className="price-section mb-5">
          <h3 className="uppercase">Price</h3>
          <div className="range-wrapper mt-4">
            <input type="range" min="0" max="100" className="range range-sm range-primary" />
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopByAside;
