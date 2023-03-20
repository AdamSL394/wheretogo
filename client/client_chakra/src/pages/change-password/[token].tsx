import { Box, Button, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/router';
import React, { useState } from 'react';
import { DarkModeSwitch } from '../../components/DarkModeSwitch';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorsMap } from '../../utils/toErrorsMap';
import login from '../login';

export const ChangePasword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePasword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper>
      <DarkModeSwitch />
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePasword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorsMap(response.data.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            } else {
              setErrors(errorMap);
            }
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name={'newPassword'}
              placeholder={'New Password'}
              label={'New Password'}
              type={'password'}
            ></InputField>
            {tokenError ? (
              <Flex>
                <Box color="red">{tokenError}</Box>
                <Box ml={4}>
                  <NextLink href="/forgot-password">
                    Click here to reset password
                  </NextLink>
                </Box>
              </Flex>
            ) : null}
            <Button
              mt={4}
              color={'white'}
              variant={'ghost'}
              backgroundColor={'teal'}
              type="submit"
              isLoading={isSubmitting}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePasword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePasword);
