import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import Pagination from '@/shared/components/pagination';
import { PaginatedUsers } from '@/shared/interfaces/users.interface';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { USER_ROLES } from '@prisma/client';
import axios from 'axios';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const Users: NextPageWithLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: userData,
    isError,
    isLoading,
  } = useQuery<PaginatedUsers>(['fetchUsers', currentPage, limit], async () => {
    const response = await axios.get(`/api/admin/users?page=${currentPage}&limit=${limit}`);
    return response.data;
  });
  console.log(userData);
  const { mutate: mutateChangeRole, isLoading: isChangingRole } = useMutation(
    async (args: { userId: string; role: USER_ROLES }) => {
      const response = await axios.patch(`/api/admin/users/${args.userId}/change-role`, {
        role: args.role,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        showToast(Toast.success, data?.message);
        queryClient.invalidateQueries({ queryKey: ['fetchUsers'] });
      },
      onError: (error: any) => {
        showToast(Toast.error, error?.response?.data?.message);
      },
    }
  );
  const handleRoleChange = (args: { userId: string; role: USER_ROLES }) => {
    mutateChangeRole(args);
  };
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Users</h2>
      </div>
      <section className="overflow-x-auto">
        <table className="table w-full table-auto">
          <thead>
            <tr>
              <th className="border !border-base-300">Name</th>
              <th className="border !border-base-300">Phone Number</th>
              <th className="border !border-base-300">Email</th>
              <th className="border !border-base-300">Username</th>
              <th className="border !border-base-300">Applying as a Business</th>
              <th className="border !border-base-300">Role</th>
              {/* <th className="border !border-base-300 ">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {isError ? (
              <h2 className="p-2 py-4 text-error">Something went wrong while trying to fetch the users.</h2>
            ) : isLoading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <span className="loading loading-spinner"></span>
                </td>
              </tr>
            ) : (
              <>
                {userData &&
                  userData.data.map((user) => {
                    return (
                      <tr key={user.id}>
                        <td className="border !border-base-300">{`${user.name.substring(0, 40)}${user.name.length > 40 ? '...' : ''}`}</td>
                        <td className="border !border-base-300">{user.phone_number || '-'}</td>
                        <td className="border !border-base-300">{`${user.email.substring(0, 40)}${
                          user.email.length > 40 ? '...' : ''
                        }`}</td>
                        <td className="border !border-base-300">{user.username}</td>
                        <td className="border !border-base-300">{user.applyingAsBusinessClient ? 'Yes' : 'No'}</td>
                        <td className={classNames('border !border-base-300')}>
                          <select
                            value={user.role}
                            disabled={isChangingRole}
                            className="w-full select select-xs"
                            onChange={(e) => {
                              handleRoleChange({ role: e.target.value as USER_ROLES, userId: user.id });
                            }}>
                            {Object.values(USER_ROLES).map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          {/* <span
                            className={classNames('badge-sm', {
                              'badge badge-accent': user.role === USER_ROLES.SUPER_ADMIN,
                              'badge badge-secondary': user.role === USER_ROLES.STAFF,
                              'badge badge-primary': user.role === USER_ROLES.USER,
                            })}>
                            {user.role}
                          </span> */}
                        </td>
                        {/* <td className="border !border-base-300 text-center">
                    <Link href={`/admin/users/edit/${user.id}`} className="gap-1 btn btn-info btn-xs btn-outline">
                      <FaCogs></FaCogs> Edit
                    </Link> 
                    <button className="gap-1 ml-2 btn btn-error btn-xs btn-outline">
                      <BsTrash></BsTrash> Delete
                    </button>
                  </td> */}
                      </tr>
                    );
                  })}
              </>
            )}
          </tbody>
        </table>
      </section>
      <div className="flex justify-end mt-8 place-self-end">
        {userData?.totalPages !== undefined && (
          <Pagination {...{ currentPage, setCurrentPage }} totalPages={userData?.totalPages}></Pagination>
        )}
      </div>
    </>
  );
};
Users.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
export default Users;
