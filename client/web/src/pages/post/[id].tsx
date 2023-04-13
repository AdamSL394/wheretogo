import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { usePostQuery } from '../../generated/graphql';
import { Layout } from '../../components/Layout';
import { Box, Heading } from '@chakra-ui/react';

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      postId: intId,
    },
  });

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if(!data?.post){
    return(
      <Layout>
        <Box>
          Couldn't find post
        </Box>
      </Layout>
      )
  }

  return <Layout>
    <Heading>{data?.post?.title}</Heading>
    {data?.post?.text}
    </Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
