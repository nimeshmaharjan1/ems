import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '@/features/admin/services/categories/categories.service';
import { getCompanies } from '@/features/admin/services/companies/companies.service';
import { SELECTED_ACTION } from '@/features/admin/settings/types';
import FormControl from '@/shared/components/form-control';
import Pagination from '@/shared/components/pagination';
import StyledReactSelect from '@/shared/components/styled-react-select';
import { ICategory, ICategoryResponse } from '@/shared/interfaces/category.interface';

import { getDateWithWeekDay } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { Category } from '@prisma/client';
import classNames from 'classnames';
import { Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BsTrash } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

//TODO Do this or that

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
  } = useQuery<ICategoryResponse, Error>('getCategories', async () => await getCategories({ page: currentPage, limit: 5 }));

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

  const updateCategoryMutation = useMutation(updateCategory, {
    onSuccess: () => {
      setSelectedAction(SELECTED_ACTION.ADD);
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
      queryClient.invalidateQueries(['getCategories']);
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
        updateCategoryMutation.mutate(values);
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

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  return (
    <div className="grid grid-cols-6 gap-6">
      <section className="col-span-6 overflow-x-auto lg:col-span-4">
        <table className="table w-full table-sm">
          <thead>
            <tr className="bg-base-200">
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
            <tbody>
              <tr className="!border-none">
                <td className="w-full text-center h-72" colSpan={6} rowSpan={6}>
                  <span className="loading loading-spinner"></span>
                </td>
              </tr>
            </tbody>
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
                      <div className="flex flex-wrap gap-2 ">
                        {category.companies?.length
                          ? category.companies.map((company) => (
                            <span className="badge badge-sm badge-accent !text-white" key={company.id}>
                              {company.name}
                            </span>
                          ))
                          : '-'}
                      </div>
                    </td>
                    <td>{category.createdAt ? getDateWithWeekDay(category.createdAt) : '-'}</td>
                    <td className="flex justify-center h-">
                      <div className="gap-2 join">
                        <button
                          className="btn btn-xs  btn-outline btn-primary gap-1 items-center !font-medium"
                          onClick={() => {
                            setSelectedAction(SELECTED_ACTION.EDIT);
                            setValue('id', category.id);
                            setValue('name', category.name);
                            setSelectedCategoryId(category.id);
                          }}>
                          <FiSettings></FiSettings>
                        </button>
                        <button
                          className={classNames('btn  group btn-xs btn-outline btn-error gap-1 items-center !font-medium', {
                            loading: isSubmitting,
                          })}
                          disabled={isSubmitting}
                          onClick={async () => {
                            setIsSubmitting(true);
                            deleteCategoryMutation.mutate(category.id);
                          }}>
                          <Trash size={16} className="group-hover:text-white"></Trash>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
        <div className="flex justify-end mt-4 place-self-end">
          {categoryData?.totalPages !== undefined && (
            <Pagination {...{ currentPage, setCurrentPage }} totalPages={categoryData.totalPages}></Pagination>
          )}
        </div>
      </section>
      <section className="col-span-6 lg:col-span-2">
        {isSelectedCategoryLoading ? (
          <div className="rounded-lg shadow card w-96 lg:w-full bg-base-100">
            <div className="flex items-center justify-center card-body">
              <button className="btn btn-ghost">
                <span className="loading loading-spinner"></span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg shadow card w-96 lg:w-full bg-base-100">
            <div className="card-body !gap-4">
              <div className="items-center justify-between card-title">
                <span className="text-lg">{selectedAction === SELECTED_ACTION.ADD ? 'Add Category' : 'Edit Category'}</span>
                {selectedAction === SELECTED_ACTION.EDIT && (
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setSelectedAction(SELECTED_ACTION.ADD);
                      reset();
                    }}>
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
                    className={classNames('input input-bordered', {
                      'input-error': errors?.name,
                    })}
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
                      isClearable></StyledReactSelect>
                  </>
                )}></Controller>
              <div className="card-actions">
                <button
                  className={classNames('btn btn-primary btn-sm btn-block ')}
                  onClick={handleSubmit(onSubmit)}
                  disabled={addCategoryMutation.isLoading || updateCategoryMutation.isLoading}>
                  {(addCategoryMutation.isLoading || updateCategoryMutation.isLoading) && <span className="loading loading-spinner"></span>}
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
