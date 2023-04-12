import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnipetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnipetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading'| 'not-loading'>()
    const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        as={ChevronUpIcon}
        onClick={async () => {
            if(post.voteStatus === 1){
            return
            }
            setLoadingState('updoot-loading')
           await vote({
            postId:post.id,
            value: 1
            })
            setLoadingState('not-loading')
        }}
        colorScheme={post.voteStatus === 1 ? 'green': undefined}
        aria-label="upvote"
        isLoading={loadingState==='updoot-loading'}
      />
      {post.points}
      <IconButton as={ChevronDownIcon}
       onClick={async () => {
        if(post.voteStatus === -1){
            return
            }
        setLoadingState('downdoot-loading')
       await vote({
        postId:post.id,
        value: -1
        })
        setLoadingState('not-loading')
    }}
    colorScheme={post.voteStatus === -1 ?'red': undefined}
    isLoading={loadingState==='downdoot-loading'}
      aria-label="downvote" />
    </Flex>
  );
};
