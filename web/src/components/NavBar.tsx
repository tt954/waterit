import React from 'react';
import { Flex, Box, Link, Button } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {}

{
  /* nextlink uses client-side routing (preferred over anchor links) */
}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{data, fetching}] = useMeQuery();
  let body = null;

  // data is loading 
  if (fetching) {
  // user not logged in 
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login"> 
          <Link color="white" mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    )
  // user is logged in 
  } else {
    body = (
      <Flex>
        <Box mr={4}>Hi, {data.me.username}</Box>
        <Button variant="link">Log Out</Button>
      </Flex>
    )
  }

  return (
    <Flex bg="#48BB78" p={4}>
      <Box ml={"auto"}>
        {body}
      </Box>
    </Flex>
  )
}