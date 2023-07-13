import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';
import { useRouter } from 'next/router';

export const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      postId: intId,
    },
  });
  const [_, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box><img src='./logo.png'/></Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          //   const { error } = await updatePost({ title: 'values', text:'asd' });
          //   if (!error) {
          //     router.push('/');
          //   }
          updatePost({
            id: intId,
            ...values,
          });
          router.push('/');
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
              Edit Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
