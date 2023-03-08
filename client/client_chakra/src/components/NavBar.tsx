import { Box, Link, Flex, Button } from "@chakra-ui/react";
import NextLink from 'next/link'
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {
}

export const NavBar: React.FC<NavBarProps> =  ({ }) => {
    const [{ data, fetching }] = useMeQuery();
    let body = null;
    console.log(fetching)
    console.log('username', data?.me?.username)
    if (fetching) {
        <></>
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href={'/login'}>
                    <Link color={'white'} mr={8}>Login</Link>
                </NextLink>
                <NextLink href={'/register'}>
                    <Link color={'white'} mr={14}>Register</Link>
                </NextLink>
            </>
        )
    } else {
        body = (
            <Flex>
                <Box  mr={8}>
                    {data.me.username}
                </Box>
                <Button mr={14}>Logout</Button>
            </Flex>
        )
    }

    return (
        <Flex bg="slategrey" p={4} >
            <Box ml={'auto'}>{body}</Box>
        </Flex>
    )

}
