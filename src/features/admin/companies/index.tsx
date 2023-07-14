import { getCategories } from '@/features/admin/services/categories/categories.service';
import { addCompany, deleteCompany, getCompanies, getCompany, updateCompany } from '@/features/admin/services/companies/companies.service';
import { SELECTED_ACTION } from '@/features/admin/settings/types';
import FormControl from '@/shared/components/form-control';
import Pagination from '@/shared/components/pagination';
import StyledReactSelect from '@/shared/components/styled-react-select';
import { ICompany, ICompanyResponse } from '@/shared/interfaces/company.interface';
import { getDateWithWeekDay } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { Company } from '@prisma/client';
import classNames from 'classnames';
import { Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BsTrash } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const SettingCompany = () => {
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
    const data = await getCompanies({ limit: 5, page: currentPage });
    return data;
  });

  const addCompanyMutation = useMutation(addCompany, {
    onSuccess: () => {
      showToast(Toast.success, 'Company added successfully');
      reset();
      queryClient.invalidateQueries(['getCompanies']);
    },

    onError: (error: any) => {
      if (error?.response?.data?.error?.meta?.target?.[0] === 'name') {
        return showToast(Toast.error, 'Company with the name already exists.');
      }
      showToast(Toast.error, 'Something went wrong while trying to add the company');
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
    onError: (error: any) => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  return (
    <div className="grid grid-cols-6 gap-6">
      <section className="col-span-6 overflow-x-auto lg:col-span-4 ">
        <table className="table w-full table-sm">
          <thead>
            <tr className="bg-base-200">
              <th>SN</th>
              <th>Name</th>
              <th>Categories</th>
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
            <tbody>
              <tr className="!border-none">
                <td className="w-full text-center h-72" colSpan={6} rowSpan={6}>
                  <span className="loading loading-spinner"></span>
                </td>
              </tr>
            </tbody>
          ) : !companyData?.data.length ? (
            <tbody>
              <tr>
                <td colSpan={5}>No data available.</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {companyData?.data?.map((company, companyIndex) => {
                return (
                  <tr key={company.id}>
                    <td>{companyIndex + 1}</td>
                    <td>{company.name}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {company.categories?.length
                          ? company.categories.map((category) => (
                            <span className="badge badge-accent badge-sm !text-white" key={category.id}>
                              {category.name}
                            </span>
                          ))
                          : '-'}
                      </div>
                    </td>
                    <td>{company.createdAt ? getDateWithWeekDay(company.createdAt) : '-'}</td>
                    <td className="flex justify-center h-">
                      <div className="gap-2 join">
                        <button
                          className="btn btn-xs btn-outline btn-primary gap-1 items-center !font-medium"
                          onClick={() => {
                            setSelectedAction(SELECTED_ACTION.EDIT);
                            setValue('id', company.id);
                            setValue('name', company.name);
                            setSelectedCompanyId(company.id);
                          }}>
                          <FiSettings></FiSettings>
                        </button>
                        <button
                          className={classNames('btn btn-xs btn-outline btn-error gap-1 items-center !font-medium', {
                            loading: isSubmitting,
                          })}
                          disabled={isSubmitting}
                          onClick={async () => {
                            setIsSubmitting(true);
                            deleteCompanyMutation.mutate(company.id);
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
          {companyData?.totalPages !== undefined && (
            <Pagination {...{ currentPage, setCurrentPage }} totalPages={companyData.totalPages}></Pagination>
          )}
        </div>
      </section>
      <section className="col-span-6 lg:col-span-2">
        {isSelectedCompanyLoading ? (
          <div className="card w-96 lg:w-full bg-base-100 shadow !rounded-lg">
            <div className="flex items-center justify-center card-body">
              <button className="btn btn-ghost loading"></button>
            </div>
          </div>
        ) : (
          <div className="card w-96 lg:w-full bg-base-100 shadow !rounded-lg">
            <div className="card-body !gap-4">
              <div className="items-center justify-between card-title">
                {selectedAction === SELECTED_ACTION.ADD ? 'Add Company' : 'Edit Company'}
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
                    placeholder="Select categories"></StyledReactSelect>
                )}></Controller>
              <div className="card-actions ">
                <button
                  className={classNames('btn btn-primary btn-sm btn-block')}
                  onClick={handleSubmit(onSubmit)}
                  disabled={addCompanyMutation.isLoading || updateCompanyMutation.isLoading}>
                  {(addCompanyMutation.isLoading || updateCompanyMutation.isLoading) && <span className="loading loading-spinner"></span>}
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

export default SettingCompany;
