import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { NavBar } from '../components/NavBar';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorsMap } from '../utils/toErrorsMap';

interface registerProps { }

const REGISTER_MUT = `
mutation Register($username: String!, $password:String!) {
    register(options: {username:$username,password:$password }) {
      user{
        id
      }
      errors {
        field
        message
      }
    }
  }
  `;

export const Register: React.FC<registerProps> = ({ }) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <>
      <NavBar></NavBar>
      <Wrapper>

        <Formik
          initialValues={{ email: '', username: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ options: values });
            console.log("response",response)
            if (response.data?.register.errors) {
              setErrors(toErrorsMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              console.log("fsdfsdf")
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name={'username'}
                placeholder={'username'}
                label={'Username'}
              ></InputField>
              <Box mt={4}>
                <InputField
                  name={'email'}
                  placeholder={'email'}
                  label={'email'}
                  type={'email'}
                ></InputField>
              </Box>
              <Box mt={4}>
                <InputField
                  name={'password'}
                  placeholder={'password'}
                  label={'Password'}
                  type={'password'}
                ></InputField>
              </Box>
              <Button
                mt={4}
                color={'white'}
                variant={'ghost'}
                backgroundColor={'teal'}
                type="submit"
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
