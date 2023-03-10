import { FormControl, FormLabel, Input, FormErrorMessage, DarkMode, Box, Button } from "@chakra-ui/react";
import { error } from "console";
import { Form, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorsMap } from "../utils/toErrorsMap";
import { useRouter } from "next/router";

interface registerProps { }

const REGISTER_MUT = `
mutation Register($username: String!, $password:String!) {
    register(options: {username:$username,password:$password }) {
      user{
        id
      }
      errors {
        field
        message
      }
    }
  }
  `

export const Register: React.FC<registerProps> = ({ }) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Wrapper>
            <DarkModeSwitch />
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register(values)
                    if (response.data?.register.errors) {
                        setErrors(toErrorsMap(response.data.register.errors));
                    }else if (response.data?.register.user) {
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
                        <Button mt={4} color={"white"} variant={'ghost'} backgroundColor={'teal'} type="submit" isLoading={isSubmitting}>Register</Button>
                    </Form>

                )}
            </Formik>
        </Wrapper>
    );
};

export default Register;
