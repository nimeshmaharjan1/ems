import { addCompany, deleteCompany, getCompanies, updateCompany } from '@/features/admin/services/companies.service';
import { SELECTED_ACTION } from '@/features/admin/settings/types';
import FormControl from '@/shared/components/form-control';
import MultiSelect from '@/shared/components/styled-react-select';
import { ICompanyResponse } from '@/shared/interfaces/company.interface';
import { getDateWithWeekDay } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { Company } from '@prisma/client';
import classNames from 'classnames';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsTrash } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ReactSelect from 'react-select';

const SettingCompany = () => {
  const queryClient = useQueryClient();
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
  } = useForm<Company>({ defaultValues, mode: 'onChange' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedAction, setSelectedAction] = useState<SELECTED_ACTION>(SELECTED_ACTION.ADD);

  const {
    data: companyData,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
    isFetching: isCompanyRefetching,
  } = useQuery<ICompanyResponse, Error>('getCompanies', getCompanies);

  const addCompanyMutation = useMutation(addCompany, {
    onSuccess: () => {
      showToast(Toast.success, 'Company added successfully');
      reset();
      queryClient.invalidateQueries(['getCompanies']);
    },
    onError: () => {
      showToast(Toast.error, 'Something went wrong while trying to add company');
    },
  });

  const onSubmit: SubmitHandler<Company> = async (values) => {
    switch (selectedAction) {
      case SELECTED_ACTION.ADD:
        await addCompanyMutation.mutateAsync(values);
        break;
      case SELECTED_ACTION.EDIT:
        await updateCompany(values);
        reset();
        break;
      default:
        break;
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
              <th>Categories</th>
              {/* <th>Products</th> */}
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>
          {isCompanyError ? (
            <tr>
              <td className="text-error" colSpan={5}>
                Something went wrong while trying to get the categories.
              </td>
            </tr>
          ) : isCompanyLoading || isCompanyRefetching ? (
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
              {companyData?.data?.map((company, CompanyIndex) => {
                return (
                  <tr key={company.id}>
                    <td>{CompanyIndex + 1}</td>
                    <td>{company.name}</td>

                    <td>{company.categories?.length ? company.name : '-'}</td>
                    {/* <td>{company.products?.length ? company.name : '-'}</td> */}
                    <td>{company.createdAt ? getDateWithWeekDay(company.createdAt) : '-'}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm btn-primary gap-1 items-center !font-medium"
                        onClick={() => {
                          setSelectedAction(SELECTED_ACTION.EDIT);
                          setValue('id', company.id);
                          setValue('name', company.name);
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
                            const data = await deleteCompany(company.id);
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
          <div className="card-body">
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
              <FormControl errorMessage={errors?.name?.message}>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Company name is required.',
                  })}
                  placeholder="Company name"
                  className="input input-bordered max-w-xs"
                />
              </FormControl>
            </div>
            <FormControl>
              <select className="select select-bordered max-w-xs">
                <option value="">Select companies</option>
              </select>
            </FormControl>
            <div className="card-actions">
              <button
                className={classNames('btn btn-primary btn-block btn-sm', {
                  loading: addCompanyMutation.isLoading,
                })}
                onClick={handleSubmit(onSubmit)}
                disabled={addCompanyMutation.isLoading}
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

export default SettingCompany;
