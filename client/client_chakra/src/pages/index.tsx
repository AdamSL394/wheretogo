import { withUrqlClient } from 'next-urql';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Layout } from '../components/Layout';
import { NavBar } from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from "next/link"

const Index = () => {

  return (
    <Layout>
      <NextLink href="/create-post">
      Create Post
      </NextLink>
      <DarkModeSwitch />
      <>Hello World</>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
