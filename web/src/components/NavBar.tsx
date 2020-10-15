import React from 'react';
import { Flex, Box, Link } from '@chakra-ui/core';
import NextLink from 'next/link';

interface NavBarProps {}

{
  /* nextlink uses client-side routing (preferred over anchor links) */
}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>
        <NextLink href="/login"> 
          <Link color="white" mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </Box>
    </Flex>
  )
}