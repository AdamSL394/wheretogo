import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  position,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import { EditDeletePostButtons } from '../components/EditDeletePostButtons';
import { Layout } from '../components/Layout';
import { UpdootSection } from '../components/UpdootSection';
import {
  useDeletePostMutation,
  useLoginMutation,
  useMeQuery,
  usePostsQuery,
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { InputField } from '../components/InputField';
import { Form, Formik } from 'formik';
import router from 'next/router';
import { toErrorsMap } from '../utils/toErrorsMap';
import login from './login';

const Index = () => {
  const [variables, setVariable] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [, login] = useLoginMutation();
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
      {meData?.me ? (
        <>
          {!data && fetching ? (
            <div>Loading...</div>
          ) : (
            <Stack spacing={8}  style={{padding:"5px"}}>
              {data!.posts.posts.map((p) =>
                !p ? (
                  <></>
                ) : (
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
                            <EditDeletePostButtons
                              id={p.id}
                              creatorId={p.creator.id}
                            />
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
                    cursor:
                      data.posts.posts[data.posts.posts.length - 1].createdAt,
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
        </>
      ) : (
      <>
        <div></div>
        <img src='./logo.png' style={{borderRadius:'25px'}}/>
            <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorsMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if ( typeof router.query.next === "string"){
            router.push(router.query.next);
            }else {
            
              router.push('/');
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form style={{padding:"1rem"}}>
            <InputField
              name={'usernameOrEmail'}
              placeholder={'Username or Email'}
              label={'Username or Email'}
            ></InputField>
            <Box mt={4}>
              <InputField
                name={'password'}
                placeholder={'Password'}
                label={'Password'}
                type={'password'}
              ></InputField>
            </Box>
            <Flex>
              <Box mt={2} ml={'auto'}>
                <NextLink href="/forgot-password">
                  Forgot Password ?
                </NextLink>
              </Box>
            </Flex>
            <Button
              mt={4}
              color={'black'}
              variant={'ghost'}
              backgroundColor={'#faf089'}
              type="submit"
              isLoading={isSubmitting}
              colorScheme='yellow'
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
        </>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
