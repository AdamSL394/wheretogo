import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { use, useState } from 'react';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Layout } from '../components/Layout';
import { UpdootSection } from '../components/UpdootSection';
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariable] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data: meData }] = useMeQuery();
  const [{ data, fetching, ...other }] = usePostsQuery({
    variables,
  });
  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>You got no query</div>;
  }

  return (
    <Layout>
      <DarkModeSwitch />
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Heading fontSize={'xl'}>
                      <div key={p.id}>{p.title}</div>
                    </Heading>
                  </NextLink>
                  <Flex align="center">
                    <Text flex={1} mt={1}>
                      {p.textSnippet}
                    </Text>
                    <Flex display="block">
                      <Text mr="auto">Posted by: {p.creator.username}</Text>
                      <Box>
                        {meData?.me?.id === p.creator.id ? (
                          <>
                            <NextLink href='/post/edit/[id]' as={`/post/edit/${p.id}`}>
                              <IconButton
                                ml="auto"
                                aria-label="edit Button"
                                icon={<EditIcon />}
                                onClick={() => {}}
                              >
                                {' '}
                              </IconButton>
                            </NextLink>
                            <IconButton
                              ml="auto"
                              aria-label="delete Button"
                              icon={<DeleteIcon />}
                              onClick={() => {
                                deletePost({ id: p.id });
                              }}
                            >
                              {' '}
                            </IconButton>{' '}
                          </>
                        ) : (
                          <> </>
                        )}
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
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
