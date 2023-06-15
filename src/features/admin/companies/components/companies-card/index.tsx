import FormControl from '@/shared/components/form-control';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import classNames from 'classnames';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import { BsPlus } from 'react-icons/bs';

interface ICompany {
  name: string;
}

const CompaniesCard = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ICompany>({ defaultValues: { name: '' }, mode: 'onChange' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit: SubmitHandler<ICompany> = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/admin/companies', values);
      showToast(Toast.success, response.data.message);
      reset();
    } catch (error) {
      showToast(Toast.error, 'Something went wrong while trying to add company.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="card bg-base-300">
        <div className="card-body !gap-3">
          <section className="title-section flex justify-between items-center">
            <h2 className="font-bold text-lg">Companies</h2>
          </section>
          <div className="categories-section flex flex-wrap gap-2">
            <div className="badge badge-neutral">Asus</div>
          </div>
          <div className="card-actions justify-end mt-2">
            <label htmlFor="add-company-modal" className="btn btn-accent btn-sm !font-medium  items-center">
              Add
              <BsPlus className="h-5 w-5 mb-[1px]"></BsPlus>
            </label>
          </div>
        </div>
      </div>
      <input type="checkbox" id="add-company-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box  relative">
          <label htmlFor="add-company-modal" className="btn btn-sm btn-circle absolute right-3 top-3">
            <AiOutlineClose></AiOutlineClose>
          </label>
          <h3 className="font-bold text-lg">Add Company</h3>
          <FormControl className="my-3" label="Name" errorMessage={errors?.name?.message as string}>
            <input
              type="text"
              placeholder="Type here..."
              {...register('name')}
              className={`input input-bordered ${errors?.name ? 'input-error' : ''}`}
            />
          </FormControl>
          <div className="modal-action">
            <button className={classNames('btn btn-sm btn-primary !font-medium')} disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
              {isSubmitting && <span className="loading loading-spinner"></span>}
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompaniesCard;
