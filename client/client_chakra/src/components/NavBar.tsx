import { Button, Flex } from "@chakra-ui/react";
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {
}

export const NavBar: React.FC<NavBarProps> =  ({ }) => {
    const [{fetching:logoutfetching} ,logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery();
    let body = null;

        if (fetching) {
            console.log('1', data, fetching);
            <div>hi</div>
        } else if (!data?.me) {
            console.log('2',data, fetching);
            body = (
                <>
                    <NextLink href={'/login'} >Login</NextLink>
                    <NextLink href={'/register'}>Register</NextLink>
                </>
            )
        } else {
            console.log('3',data, fetching);
            body = (
                <Flex>{data.me.username}
                    <Button onClick={() => logout()}isLoading={logoutfetching}>Logout</Button>
                </Flex>
            )
        }
        
    return (
        <Flex bg="slategrey" p={4} ><div>{body}</div></Flex>
    )

}
