import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { DarkModeSwitch } from './DarkModeSwitch';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutfetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {
    <div>Loading...</div>;
  } else if (!data?.me) {
    body = (
      <span
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginLeft: 'auto',
        }}
      >
        <span >
     
          <NextLink style={{marginRight:'14px'}} href={'/login'}>Login</NextLink>
        </span>
        <NextLink href={'/register'}>Register</NextLink>
      </span>
    );
  } else {
    body = (
      <Flex align="center" justifyContent="space-between">

        <Box>
          <Button mr={4} background="" as={Link} href="/create-post">
            Create Post
          </Button>
        </Box>
        <Box mr={6}>
          <strong>{data.me.username}</strong>
        </Box>
        <Button
          color="Black"
          variant="link"
          mr={'8%'}
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutfetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
  
    <Flex position="sticky" zIndex={1} top={0} bg="#1f9cee" p={4}>
    <DarkModeSwitch />
        
      <Flex flex={1} align="center" margin={'auto'} maxWidth={800}>
        <NextLink href="/">Home</NextLink>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Flex>
  );
};
