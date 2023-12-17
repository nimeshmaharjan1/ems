import Image from 'next/image';

const brands = [
  {
    id: 1,
    logo: '/images/brands/black.png',
  },
  {
    id: 2,
    logo: '/images/brands/cg.png',
  },
  {
    id: 3,
    logo: '/images/brands/godrej.png',
  },
  {
    id: 4,
    logo: '/images/brands/kent.png',
  },
  {
    id: 5,
    logo: '/images/brands/lg.png',
  },
  {
    id: 6,
    logo: '/images/brands/midea.png',
  },
  {
    id: 7,
    logo: '/images/brands/pigeon.png',
  },
  {
    id: 8,
    logo: '/images/brands/sensei.png',
  },
  {
    id: 9,
    logo: '/images/brands/tck.png',
  },
];

const CompaniesScroll = () => {
  return (
    <div className="container overflow-x-hidden pb-16 pt-8 sm:pt-0">
      <div className="horizontal-scrolling-items  items-center gap-12 lg:w-[2600px]">
        {brands.map((brand) => (
          <div key={brand.id} className="whitespace-nowrap shrink-0">
            <Image src={brand.logo} alt="Brand" width={200} height={200}></Image>
          </div>
        ))}
        {brands.map((brand) => (
          <div key={brand.id} className="whitespace-nowrap shrink-0">
            <Image src={brand.logo} alt="Brand" width={200} height={200}></Image>
          </div>
        ))}
        {brands.map((brand) => (
          <div key={brand.id} className="whitespace-nowrap shrink-0">
            <Image src={brand.logo} alt="Brand" width={200} height={200}></Image>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesScroll;
