import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import Pagination from '@/shared/components/pagination';
import { PaginatedUsers } from '@/shared/interfaces/users.interface';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { PrismaClient, USER_ROLES } from '@prisma/client';
import axios from 'axios';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// const prisma = new PrismaClient();
// export const getServerSideProps = async () => {
//   await prisma.user.delete({
//     where: { id: 'cljlnbhc70000p9k4js35ixzy' },
//   });
//   return { props: {} };
// };

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
      <p className="px-3 mb-6">
        NOTE: The users applying as a <strong>business client</strong> will have their table row marked with a{' '}
        <span className="px-2 rounded bg-base-300">dark background</span> please keep this in mind.
      </p>
      <section className="overflow-x-auto">
        <table className="table w-full table-auto">
          <thead>
            <tr className="bg-base-200">
              <th className="">Name</th>
              <th className="">Phone Number</th>
              <th className="">Email</th>
              <th className="">Username</th>
              {/* <th className="">Applying as a Business</th> */}
              <th className="">Role</th>
              {/* <th className="">Actions</th> */}
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
                      <tr
                        key={user.id}
                        className={classNames('', {
                          'bg-base-300 !': user.applyingAsBusinessClient,
                        })}>
                        <td className="">{`${user.name.substring(0, 40)}${user.name.length > 40 ? '...' : ''}`}</td>
                        <td className="">{user.phone_number || '-'}</td>
                        <td className="">{`${user.email.substring(0, 40)}${user.email.length > 40 ? '...' : ''}`}</td>
                        <td className="">{user.username}</td>
                        {/* <td className="">{user.applyingAsBusinessClient ? 'Yes' : 'No'}</td> */}
                        <td className={classNames('')}>
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
                        </td>
                        {/* <td className="text-center ">
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
