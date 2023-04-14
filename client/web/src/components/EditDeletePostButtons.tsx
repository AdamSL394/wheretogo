import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();
  if (meData?.me?.id !== creatorId) {
    return null;
  }
  return (
    <>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
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
          deletePost({ id: id });
        }}
      >
        {' '}
      </IconButton>{' '}
    </>
  );
};
