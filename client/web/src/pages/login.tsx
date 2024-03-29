import { Box, Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { NavBar } from '../components/NavBar';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorsMap } from '../utils/toErrorsMap';

export const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <>
    <NavBar></NavBar>
    <Wrapper>
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
          <Form style={{padding:"1rem",  margin:'auto'}}>
            <InputField
              name={'usernameOrEmail'}
              placeholder={'Username or Email'}
              label={'Username or Email'}
            ></InputField>
            <Box mt={4}>
              <InputField
                name={'password'}
                placeholder={'password'}
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
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
