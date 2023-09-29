import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { useQuery } from 'react-query';
import axios from 'axios';
import { ICommentsData } from '@/shared/interfaces/comments.interface';
import { Facebook } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import Link from 'next/link';

const MainSharedFooter = () => {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: settings } = useQuery(['getSettings'], async () => {
    const response = await axios.get(`/api/settings`);
    return response.data?.settings;
  });

  if (!isMounted) return null;
  return (
    <footer className="footer p-10 bg-base-300 text-base-content mt-16">
      <div>
        <h2 className="text-3xl text-primary font-bold">EME</h2>
        <p>Bangemudha, New Road, Kathmandu</p>
        <p>{settings?.email}</p>
        <p>{settings?.contactNumber}</p>
        <p>TM © 2023 - Eeshan Mahadev Enterprises - All Rights Reserved.</p>
      </div>
      <div>
        <span className="footer-title">Navigation</span>
        <Link href={'/'} passHref>
          <span className="link link-hover">Home</span>
        </Link>
        <Link passHref href={'/products'}>
          <span className="link link-hover">Products</span>
        </Link>
        <Link passHref href="/about">
          <span className="link link-hover">About us</span>
        </Link>
        <Link passHref href="/raise-issue">
          <span className="link link-hover">Issue Assistance</span>
        </Link>
      </div>
      <div>
        <span className="footer-title">Social</span>
        <div className="grid grid-flow-col gap-4">
          <a href={settings?.facebook} target="_blank" rel="noreferrer">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </span>
          </a>
          <a href={settings?.tiktok} target="_blank" rel="noreferrer">
            <FaTiktok className="w-6 h-6"></FaTiktok>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default MainSharedFooter;
