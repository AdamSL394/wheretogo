import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import router from 'next/router';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import createPost from '../../create-post';
import { useUpdatePostMutation } from '../../../generated/graphql';

export const EditPost = ({}) => {
    const [_, updatePost] = useUpdatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { error } = await updatePost({ title: 'values', text:'asd' });
          if (!error) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name={'title'}
              placeholder={'title'}
              label={'Title'}
            ></InputField>
            <Box mt={4}>
              <InputField
                textarea
                name={'text'}
                placeholder={'text...'}
                label={'Text'}
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
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
