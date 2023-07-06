import {Flex, Spinner, Text} from '@sanity/ui'
import React from 'react'

export default function Loading({message = 'Loading analytics'}) {
  return (
    <Flex style={{paddingTop: '15rem', position: 'relative'}} direction={'column'} justify={'center'} align="center">
      <Spinner />
      <Text muted size={1}>
        {message}
      </Text>
    </Flex>
  )
}
