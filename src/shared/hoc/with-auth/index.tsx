import React from 'react';
import Router from 'next/router';

const withAuth = (WrappedComponent: any) => {
  const WithAuth = (props: any) => {
    const { user } = props;
    if (!user) {
      Router.push('/auth/signin');
    }
    return <WrappedComponent {...props} />;
  };

  WithAuth.getInitialProps = async (ctx: any) => {
    const { user } = await ctx.req.auth.getUser();
    const pageProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
    return { ...pageProps, user };
  };

  return WithAuth;
};

export default withAuth;
