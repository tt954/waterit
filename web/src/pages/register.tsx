import React from 'react';
import { Formik, Form } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/core';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
	const router = useRouter();
	const [, register] = useRegisterMutation(); //custom hooks

	return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => { 
					const response = await register(values); 
					console.log(response)

					if (response.data?.register.errors) {
						setErrors(toErrorMap(response.data.register.errors));
					} else if (response.data?.register.user) {
						console.log("here")
						//worked
						router.push("/");
					} 
					// optional chaining, data?
					// data will return an error if data is undefined vs. data? will return undefined if there is no data 
				}}
      >
        {({ isSubmitting }) => (
          <Form>
						<InputField 
							name="username"
							placeholder="Username"
							label="Username"/>
						<Box mt={4}>
							<InputField 
								name="password"
								placeholder="Password"
								label="Password"
								type="password"/>
						</Box>

						<Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Register);