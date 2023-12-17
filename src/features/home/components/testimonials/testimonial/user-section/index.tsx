import Image from 'next/image';

const UserSection = ({ testimonial }: any) => {
  return (
    <section className="user-section flex gap-x-4 items-center mt-3">
      <div className="avatar">
        <div className="w-14 bg-base-300 shadow-lg rounded-full">
          <Image height={200} width={200} alt="user" src="/icons/default-user.png" />
        </div>
      </div>
      <section className="user-details">
        <h2 className="text-sm font-bold mb-1">{testimonial.userName}</h2>
      </section>
    </section>
  );
};

export default UserSection;
