import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import { IProductResponse } from '@/shared/interfaces/product.interface';
import { IUserResponse } from '@/shared/interfaces/users.interface';
import { formatPrice, getDateWithWeekDay } from '@/shared/utils/helper.util';
import { PrismaClient, Product, USER_ROLES } from '@prisma/client';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaCogs } from 'react-icons/fa';

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone_number: true,
        emailVerified: true,
        role: true,
        image: true,
      },
    });
    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
      },
    };
  } catch (error) {
    console.error(error);
  }
  return {
    props: {
      users: null,
    },
  };
};

const Users: NextPageWithLayout<{ users: IUserResponse[] }> = ({ users }) => {
  console.log({ users });
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-2xl">Users</h2>
        <Link className="btn btn-sm btn-secondary" href={'/admin/users/create'}>
          Create
        </Link>
      </div>
      <section className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="border !border-base-300">Name</th>
              <th className="border !border-base-300">Phone Number</th>
              <th className="border !border-base-300">Email</th>
              <th className="border !border-base-300">Username</th>
              <th className="border !border-base-300">Role</th>
              <th className="border !border-base-300 w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td className="border !border-base-300">{`${user.name.substring(0, 40)}${user.name.length > 40 ? '...' : ''}`}</td>
                  <td className="border !border-base-300">{user.phone_number || '-'}</td>
                  <td className="border !border-base-300">{`${user.email.substring(0, 40)}${user.email.length > 40 ? '...' : ''}`}</td>
                  <td className="border !border-base-300">{user.username}</td>
                  <td className={classNames('border !border-base-300')}>
                    <span
                      className={classNames('badge-sm', {
                        'badge badge-accent': user.role === USER_ROLES.SUPER_ADMIN,
                        'badge badge-secondary': user.role === USER_ROLES.ADMIN,
                        'badge badge-primary': user.role === USER_ROLES.USER,
                      })}>
                      {user.role}
                    </span>
                  </td>
                  <td className="border !border-base-300 flex gap-2 w-48 justify-between">
                    <Link href={`/admin/users/edit/${user.id}`} className="btn btn-info btn-sm  gap-1">
                      <FaCogs></FaCogs> Edit
                    </Link>
                    <button className="btn btn-error btn-sm  gap-1">
                      <BsTrash></BsTrash> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
};
Users.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
export default Users;
