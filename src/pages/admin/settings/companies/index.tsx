import { getCategories } from '@/features/admin/services/categories/categories.service';
import { addCompany, deleteCompany, getCompanies, getCompany, updateCompany } from '@/features/admin/services/companies/companies.service';
import { SELECTED_ACTION } from '@/features/admin/settings/types';
import FormControl from '@/shared/components/form-control';
import StyledReactSelect from '@/shared/components/styled-react-select';
import { ICompany, ICompanyResponse } from '@/shared/interfaces/company.interface';
import { getDateWithWeekDay } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { Company } from '@prisma/client';
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
  } = useForm<ICompany>({ defaultValues, mode: 'onChange' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedAction, setSelectedAction] = useState<SELECTED_ACTION>(SELECTED_ACTION.ADD);

  const {
    data: companyData,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    isFetching: isCategoryFetching,
  } = useQuery<ICompanyResponse, Error>('getCompanies', async () => {
    const data = await getCompanies({ limit: 25, page: 1 });
    return data;
  });

  const addCompanyMutation = useMutation(addCompany, {
    onSuccess: () => {
      showToast(Toast.success, 'Company added successfully');
      queryClient.invalidateQueries(['getCompanies']);
    },
    onError: () => {
      showToast(Toast.error, 'Something went wrong while trying to add company');
    },
    onSettled: () => {
      reset();
      setIsSubmitting(false);
    },
  });

  const deleteCompanyMutation = useMutation(deleteCompany, {
    onSuccess: () => {
      showToast(Toast.success, 'Company deleted successfully');
      queryClient.refetchQueries('getCompanies');
    },
    onError: () => {
      showToast(Toast.error, 'Something went wrong while trying to delete company');
    },
    onSettled: () => setIsSubmitting(false),
  });

  const updateCompanyMutation = useMutation(updateCompany, {
    onSuccess: () => {
      setSelectedAction(SELECTED_ACTION.ADD);
      showToast(Toast.success, 'Company updated successfully');
      queryClient.invalidateQueries(['getCompanies']);
      reset();
    },
    onError: () => {
      showToast(Toast.error, 'Something went wrong while trying to update company');
    },
    onSettled: () => {
      setIsSubmitting(false);
      reset();
      setSelectedCompanyId('');
    },
  });

  const onSubmit: SubmitHandler<Company> = async (values) => {
    switch (selectedAction) {
      case SELECTED_ACTION.ADD:
        addCompanyMutation.mutate(values);
        break;
      case SELECTED_ACTION.EDIT:
        updateCompanyMutation.mutate(values);
        break;
      default:
        break;
    }
  };

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const {
    data: selectedCompany,
    isLoading: isSelectedCompanyLoading,
    isError: isSelectedCompanyError,
    isFetching: isSelectedCompanyFetching,
  } = useQuery<{ company: ICompany }, Error>(['getCompany', selectedCompanyId], async () => await getCompany(selectedCompanyId), {
    enabled: !!selectedCompanyId,
  });

  useEffect(() => {
    if (isSelectedCompanyError) {
      reset();
      setSelectedAction(SELECTED_ACTION.ADD);
    }
  }, [isSelectedCompanyError]);

  useEffect(() => {
    if (selectedCompany?.company.categories) {
      setValue('categories', selectedCompany.company.categories);
    }
  }, [selectedCompany?.company.categories]);

  const loadCategories = async (searchValue: string, loadedData: any, { page }: any) => {
    try {
      const companyData = await getCategories({ page, limit: 5 });
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
      <section className="overflow-x-auto col-span-6 lg:col-span-4 ">
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
          {isCompanyError ? (
            <tbody>
              <tr>
                <td className="text-error" colSpan={5}>
                  Something went wrong while trying to get the categories.
                </td>
              </tr>
            </tbody>
          ) : isCompanyLoading ? (
            Array.from({ length: 10 })
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
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                      <td className="animate-pulse bg-base-100"></td>
                    </tr>
                  </tbody>
                );
              })
          ) : !companyData?.data.length ? (
            <tbody>
              <tr>
                <td colSpan={5}>No data available.</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {companyData?.data?.map((company, categoryIndex) => {
                return (
                  <tr key={company.id}>
                    <td>{categoryIndex + 1}</td>
                    <td>{company.name}</td>
                    <td>
                      <div className="flex gap-2 flex-wrap">
                        {company.categories?.length
                          ? company.categories.map((category) => (
                              <span className="badge badge-accent !text-white" key={category.id}>
                                {category.name}
                              </span>
                            ))
                          : '-'}
                      </div>
                    </td>
                    <td>{company.createdAt ? getDateWithWeekDay(company.createdAt) : '-'}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-primary gap-1 items-center !font-medium"
                          onClick={() => {
                            setSelectedAction(SELECTED_ACTION.EDIT);
                            setValue('id', company.id);
                            setValue('name', company.name);
                            setSelectedCompanyId(company.id);
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
                            deleteCompanyMutation.mutate(company.id);
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
        {isSelectedCompanyLoading ? (
          <div className="card w-96 lg:w-full bg-base-100 shadow !rounded-none">
            <div className="card-body">
              <button className="btn btn-ghost loading"></button>
            </div>
          </div>
        ) : (
          <div className="card w-96 lg:w-full bg-base-100 shadow !rounded-none">
            <div className="card-body !gap-4">
              <div className="card-title justify-between items-center">
                {selectedAction === SELECTED_ACTION.ADD ? 'Add Company' : 'Edit Company'}
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
                <FormControl errorMessage={errors?.name?.message as string}>
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Company name is required.',
                    })}
                    placeholder="Company name"
                    className="input input-bordered"
                  />
                </FormControl>
              </div>
              <Controller
                control={control}
                name="categories"
                defaultValue={[]}
                render={({ field: { onChange, value, name, ref }, fieldState: { error } }) => (
                  <StyledReactSelect
                    onChange={onChange}
                    name={name}
                    value={value}
                    loadOptions={loadCategories}
                    isMulti
                    placeholder="Select categories"
                  ></StyledReactSelect>
                )}
              ></Controller>
              <div className="card-actions ">
                <button
                  className={classNames('btn btn-primary btn-block', {
                    loading: addCompanyMutation.isLoading || updateCompanyMutation.isLoading,
                  })}
                  onClick={handleSubmit(onSubmit)}
                  disabled={addCompanyMutation.isLoading || updateCompanyMutation.isLoading}
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
