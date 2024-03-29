import { Box, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();

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
    <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id}/>
    </Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
