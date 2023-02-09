import { getCategories } from '@/features/admin/services/categories.service';
import FormControl from '@/shared/components/form-control';
import MultiSelect from '@/shared/components/multi-select';
import { ICategory } from '@/shared/interfaces/category.interface';
import { ICompany } from '@/shared/interfaces/company.interface';
import { getDateWithWeekDay } from '@/shared/utils/helper.util';
import { Category } from '@prisma/client';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsTrash, BsTrashFill } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { useQuery } from 'react-query';

enum SELECTED_ACTION {
  ADD,
  EDIT,
}

const SettingCategory = () => {
  const [selectedAction, setSelectedAction] = useState<SELECTED_ACTION>(SELECTED_ACTION.ADD);
  const {
    data: categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useQuery<ICategory[], Error>('fetchCategories', getCategories);

  const defaultValues = {
    id: '',
    name: '',
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues, mode: 'onChange' });

  return (
    <div className="grid grid-cols-6 gap-6">
      <section className="overflow-x-auto col-span-6 lg:col-span-4 shadow">
        <table className="table w-full shadow">
          <thead>
            <tr className="bg-base-100">
              <th>SN</th>
              <th>Name</th>
              <th>Companies</th>
              {/* <th>Products</th> */}
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>
          {isCategoryError ? (
            <tr>
              <td className="text-error" colSpan={5}>
                Something went wrong while trying to get the categories.
              </td>
            </tr>
          ) : isCategoryLoading ? (
            Array.from({ length: 5 })
              .fill(0)
              .map((_, index) => {
                return (
                  <tr key={index}>
                    <td className="animate-pulse bg-base-100"></td>
                    <td className="animate-pulse bg-base-100"></td>
                    <td className="animate-pulse bg-base-100"></td>
                    <td className="animate-pulse bg-base-100"></td>
                    <td className="animate-pulse bg-base-100"></td>
                  </tr>
                );
              })
          ) : (
            <tbody>
              {categories?.map((category, categoryIndex) => {
                return (
                  <tr key={category.id}>
                    <td>{categoryIndex + 1}</td>
                    <td>{category.name}</td>

                    <td>{category.companies?.length ? category.name : '-'}</td>
                    {/* <td>{category.products?.length ? category.name : '-'}</td> */}
                    <td>{category.createdAt ? getDateWithWeekDay(category.createdAt) : '-'}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm btn-primary gap-1 items-center !font-medium"
                        onClick={() => {
                          setSelectedAction(SELECTED_ACTION.EDIT);
                          setValue('id', category.id);
                          setValue('name', category.name);
                        }}
                      >
                        <FiSettings></FiSettings>
                      </button>
                      <button className="btn btn-sm btn-error gap-1 items-center !font-medium">
                        <BsTrash></BsTrash>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </section>
      <section className="col-span-6 lg:col-span-2">
        <div className="card bg-base-100 shadow !rounded-none">
          <div className="card-body">
            <div className="card-title justify-between items-center">
              {selectedAction === SELECTED_ACTION.ADD ? 'Add Category' : 'Edit Category'}
              {selectedAction === SELECTED_ACTION.EDIT && (
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    setSelectedAction(SELECTED_ACTION.ADD);
                    reset();
                  }}
                >
                  Add
                </button>
              )}
            </div>
            <div className="mt-1">
              <FormControl errorMessage={errors?.name?.message}>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Category name is required.',
                  })}
                  placeholder="Category name"
                  className="input input-bordered max-w-xs"
                />
              </FormControl>
            </div>
            <FormControl>
              <select className="select select-bordered max-w-xs">
                <option value="">Select category</option>
              </select>
            </FormControl>
            <div className="card-actions">
              <button className="btn btn-primary btn-block btn-sm">Submit</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingCategory;
