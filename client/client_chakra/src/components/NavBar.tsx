import { Box, Link, Flex, Button } from "@chakra-ui/react";
import NextLink from 'next/link'
import { useQueryQuery } from '../generated/graphql'

interface NavBarProps {
}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ data, fetching }] = useQueryQuery();
    let body = null;

    if (fetching) {

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
            <>
                <Box>
                    {data.me.username}
                </Box>
                <Button>Logout</Button>
            </>
        )
    }

    return (
        <Flex bg="slategrey" p={4} >
            <Box ml={'auto'}>
                <NextLink href={'/login'}>
                    <Link color={'white'} mr={8}>Login</Link>
                </NextLink>
                <NextLink href={'/register'}>
                    <Link color={'white'} mr={14}>Register</Link>
                </NextLink>
            </Box>
        </Flex>
    )

}

function useMeQuery(): [{ data: any; fetching: any; }] {
    throw new Error("Function not implemented.");
}
