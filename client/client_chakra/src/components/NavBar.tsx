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
            <div>hi</div>
        } else if (!data?.me) {
            body = (
                <span style={{width:"20%",display:"flex", flexWrap:"wrap", marginLeft:"auto"}}>
                <span>

                    <NextLink  href={'/login'} >Login</NextLink>
                </span>
                    <NextLink href={'/register'}>Register</NextLink>
                </span>
            )
        } else {
            body = (
                <Flex>{data.me.username}
                    <Button onClick={() => logout()}isLoading={logoutfetching}>Logout</Button>
                </Flex>
            )
        }
        
    return (
        <Flex position='sticky' zIndex={1} top={0} bg="slategrey" p={4} ><div>{body}</div></Flex>
    )

}
