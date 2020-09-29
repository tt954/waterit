import React from 'react';
import { Formik, Form } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/core';

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
	return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => console.log(values)}
      >
        {(values, handleChange, isSubmitting) => (
          <Form>
						<InputField 
							name="username"
							placeholder="username"
							label="Username"/>
						<Box mt={4}>
							<InputField 
								name="password"
								placeholder="password"
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

export default Register;