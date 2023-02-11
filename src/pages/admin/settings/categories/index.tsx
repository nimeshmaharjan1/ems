import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from '@/features/admin/services/categories.service';
import { getCompanies } from '@/features/admin/services/companies.service';
import { SELECTED_ACTION } from '@/features/admin/settings/types';
import FormControl from '@/shared/components/form-control';
import StyledReactSelect from '@/shared/components/styled-react-select';
import { ICategory, ICategoryResponse } from '@/shared/interfaces/category.interface';

import { getDateWithWeekDay } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { Category } from '@prisma/client';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
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

  const updateCompanyMutation = useMutation(updateCategory, {
    onSuccess: () => {
      showToast(Toast.success, 'Company updated successfully');
      queryClient.invalidateQueries(['getCategories']);
    },
    onError: () => {
      showToast(Toast.error, 'Something went wrong while trying to update category.');
    },
    onSettled: () => {
      setSelectedAction(SELECTED_ACTION.ADD);
      setSelectedCategoryId('');
      reset();
    },
  });

  const deleteCategoryMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      showToast(Toast.success, 'Company deleted successfully');
      queryClient.invalidateQueries(['getCompanies']);
    },
    onError: () => {
      showToast(Toast.error, 'Something went wrong while trying to delete company');
    },
    onSettled: () => setIsSubmitting(false),
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const {
    data: selectedCategory,
    isLoading: isSelectedCategoryLoading,
    isError: isSelectedCategoryError,
    isFetching: isSelectedCategoryFetching,
  } = useQuery<{ category: ICategory }, Error>(['getCategory', selectedCategoryId], async () => await getCategory(selectedCategoryId), {
    enabled: !!selectedCategoryId,
  });

  useEffect(() => {
    if (isSelectedCategoryError) {
      reset();
      setSelectedAction(SELECTED_ACTION.ADD);
    }
  }, [isSelectedCategoryError]);

  useEffect(() => {
    if (selectedCategory?.category.companies) {
      setValue('companies', selectedCategory.category.companies);
    }
  }, [selectedCategory?.category.companies]);

  const onSubmit: SubmitHandler<Category> = async (values) => {
    switch (selectedAction) {
      case SELECTED_ACTION.ADD:
        addCategoryMutation.mutate(values);
        break;
      case SELECTED_ACTION.EDIT:
        updateCompanyMutation.mutate(values);
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
      <section className="overflow-x-auto col-span-6 lg:col-span-4">
        <table className="table w-full">
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
            <tbody>
              <tr>
                <td className="text-error" colSpan={5}>
                  Something went wrong while trying to get the categories.
                </td>
              </tr>
            </tbody>
          ) : isCategoryLoading ? (
            Array.from({ length: 5 })
              .fill(0)
              .map((_, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                    </tr>
                  </tbody>
                );
              })
          ) : !categoryData?.data.length ? (
            <tbody>
              <tr>
                <td colSpan={5}>No data available.</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {categoryData?.data?.map((category, categoryIndex) => {
                return (
                  <tr key={category.id}>
                    <td>{categoryIndex + 1}</td>
                    <td>{category.name}</td>

                    <td>
                      <div className="flex gap-2 flex-wrap ">
                        {category.companies?.length
                          ? category.companies.map((company) => (
                              <span className="badge badge-secondary" key={company.id}>
                                {company.name}
                              </span>
                            ))
                          : '-'}
                      </div>
                    </td>
                    <td>{category.createdAt ? getDateWithWeekDay(category.createdAt) : '-'}</td>
                    <td className="h-full">
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-primary gap-1 items-center !font-medium"
                          onClick={() => {
                            setSelectedAction(SELECTED_ACTION.EDIT);
                            setValue('id', category.id);
                            setValue('name', category.name);
                            setSelectedCategoryId(category.id);
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
                            deleteCategoryMutation.mutate(category.id);
                          }}
                        >
                          <BsTrash></BsTrash>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </section>
      <section className="col-span-6 lg:col-span-2">
        {isSelectedCategoryLoading ? (
          <div className="card w-96 lg:w-full bg-base-100 shadow !rounded-none">
            <div className="card-body">
              <button className="btn btn-ghost loading"></button>
            </div>
          </div>
        ) : (
          <div className="card w-96 lg:w-full bg-base-100 shadow !rounded-none">
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
                    className="input input-bordered "
                  />
                </FormControl>
              </div>
              <Controller
                control={control}
                defaultValue={[]}
                name="companies"
                render={({ field: { onChange, value, name, ref }, fieldState: { error } }) => (
                  <>
                    <StyledReactSelect
                      onChange={onChange}
                      name={name}
                      value={value}
                      loadOptions={loadCompanies}
                      isMulti
                      placeholder="Select companies"
                      isClearable
                    ></StyledReactSelect>
                  </>
                )}
              ></Controller>
              <div className="card-actions">
                <button
                  className={classNames('btn btn-primary btn-block btn-sm', {
                    loading: addCategoryMutation.isLoading || updateCompanyMutation.isLoading,
                  })}
                  onClick={handleSubmit(onSubmit)}
                  disabled={addCategoryMutation.isLoading || updateCompanyMutation.isLoading}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SettingCategory;
