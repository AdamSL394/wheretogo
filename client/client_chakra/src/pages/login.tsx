import { FormControl, FormLabel, Input, FormErrorMessage, DarkMode, Box, Button } from "@chakra-ui/react";
import { error } from "console";
import { Form, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { toErrorsMap } from "../utils/toErrorsMap";
import { useRouter } from "next/router";


export const Login: React.FC<{}> = ({ }) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper>
            <DarkModeSwitch />
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({options: values})
                    if (response.data?.login.errors) {
                        setErrors(toErrorsMap(response.data.login.errors));
                    }else if (response.data?.login.user) {
                        router.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name={"username"} placeholder={"username"} label={"Username"}>
                        </InputField>
                        <Box mt={4}>

                            <InputField name={"password"} placeholder={"password"} label={"Password"} type={"password"}>
                            </InputField>
                        </Box>
                        <Button mt={4} color={"white"} variant={'ghost'} backgroundColor={'teal'} type="submit" isLoading={isSubmitting}>Login</Button>
                    </Form>

                )}
            </Formik>
        </Wrapper>
    );
};

export default Login;
