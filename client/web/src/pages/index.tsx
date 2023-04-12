import { withUrqlClient } from 'next-urql';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Layout } from '../components/Layout';
import { NavBar } from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { createRouteLoader } from 'next/dist/client/route-loader';

const Index = () => {
  const [variables, setVariable] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching, ...other }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>You got no query</div>;
  }

  return (
    <Layout>
      <Flex align="center" mb={7}>
        <h1>Where to Go</h1>
        <span style={{ marginLeft: 'auto' }}>
          <NextLink href="/create-post">Create Post</NextLink>
        </span>
      </Flex>
      <DarkModeSwitch />
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Flex>
                <Heading fontSize={'xl'}>
                  <div key={p.id}>{p.title}</div>
                </Heading>
                <Text ml="auto">Posted by: {p.creator.username}</Text>
              </Flex>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariable({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
