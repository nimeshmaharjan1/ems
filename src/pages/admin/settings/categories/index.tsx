import { addCategory, deleteCategory, getCategories, updateCategory } from '@/features/admin/services/categories.service';
import { getCompanies } from '@/features/admin/services/companies.service';
import { SELECTED_ACTION } from '@/features/admin/settings/types';
import FormControl from '@/shared/components/form-control';
import StyledReactSelect from '@/shared/components/styled-react-select';
import { ICategory, ICategoryResponse } from '@/shared/interfaces/category.interface';

import { getDateWithWeekDay } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { Category } from '@prisma/client';
import classNames from 'classnames';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BsTrash } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const SettingCategory = () => {
  const queryClient = useQueryClient();
  const defaultValues = {
    name: '',
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    control,
  } = useForm<ICategory>({ defaultValues, mode: 'onChange' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedAction, setSelectedAction] = useState<SELECTED_ACTION>(SELECTED_ACTION.ADD);

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    isFetching: isCategoryFetching,
  } = useQuery<ICategoryResponse, Error>('getCategories', async () => await getCategories({ page: 1, limit: 10 }));

  const addCategoryMutation = useMutation(addCategory, {
    onSuccess: () => {
      showToast(Toast.success, 'Category added successfully');
      reset();
      queryClient.invalidateQueries(['getCategories']);
    },
    onError: () => {
      showToast(Toast.error, 'Something went wrong while trying to add category');
    },
  });

  const onSubmit: SubmitHandler<Category> = async (values) => {
    switch (selectedAction) {
      case SELECTED_ACTION.ADD:
        await addCategoryMutation.mutateAsync(values);
        break;
      case SELECTED_ACTION.EDIT:
        await updateCategory(values);
        reset();
        break;
      default:
        break;
    }
  };

  const loadCompanies = async (searchValue: string, loadedData: any, { page }: any) => {
    try {
      const companyData = await getCompanies({ page, limit: 5 });
      let filteredOptions: any;
      if (!searchValue) {
        filteredOptions = companyData.data;
      } else {
        filteredOptions = companyData.data.filter((option: any) => option.name.toLowerCase().includes(searchValue.toLowerCase()));
      }
      return {
        options: filteredOptions.map((option: any) => {
          return {
            value: option.id,
            label: option.name,
          };
        }),
        hasMore: companyData.page < companyData.totalPages ? true : false,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  return (
    <div className="grid grid-cols-6 gap-6">
      <section className="overflow-x-auto col-span-6 lg:col-span-4 shadow">
        <table className="table w-full shadow">
          <thead>
            <tr className="bg-base-100">
              <th>SN</th>
              <th>Name</th>
              <th>Companies</th>
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
          ) : !categoryData?.data.length ? (
            <tr>
              <td colSpan={5}>No data available.</td>
            </tr>
          ) : (
            <tbody>
              {categoryData?.data?.map((category, categoryIndex) => {
                return (
                  <tr key={category.id}>
                    <td>{categoryIndex + 1}</td>
                    <td>{category.name}</td>

                    <td className="flex gap-2 flex-wrap">
                      {category.companies?.length
                        ? category.companies.map((company) => (
                            <span className="badge badge-primary" key={company.id}>
                              {company.name}
                            </span>
                          ))
                        : '-'}
                    </td>
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
                      <button
                        className={classNames('btn btn-sm btn-error gap-1 items-center !font-medium', {
                          loading: isSubmitting,
                        })}
                        disabled={isSubmitting}
                        onClick={async () => {
                          setIsSubmitting(true);
                          try {
                            const data = await deleteCategory(category.id);
                            showToast(Toast.success, data.message);
                          } catch (error) {
                            console.log(error);
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                      >
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
          <div className="card-body !gap-4">
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
            <Controller
              control={control}
              name="companies"
              render={({ field: { onChange, value, name, ref }, fieldState: { error } }) => (
                <StyledReactSelect
                  onChange={onChange}
                  passedRef={ref}
                  name={name}
                  loadOptions={loadCompanies}
                  isMulti
                  placeholder="Select companies"
                ></StyledReactSelect>
              )}
            ></Controller>
            <div className="card-actions">
              <button
                className={classNames('btn btn-primary btn-block btn-sm', {
                  loading: addCategoryMutation.isLoading,
                })}
                onClick={handleSubmit(onSubmit)}
                disabled={addCategoryMutation.isLoading}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingCategory;
