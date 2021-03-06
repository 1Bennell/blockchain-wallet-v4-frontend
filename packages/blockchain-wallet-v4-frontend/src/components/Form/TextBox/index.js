import React from 'react'
import styled from 'styled-components'

import { Text, TextInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: -20px;
  right: 0;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const TextBox = (field) => {
  const errorState = getErrorState(field.meta)

  return (
    <Container>
      <TextInput {...field.input} errorState={errorState} placeholder={field.placeholder} center={field.center} />
      {field.meta.touched && field.meta.error && <Error size='12px' weight={300} color='error'>{field.meta.error}</Error>}
    </Container>
  )
}

export default TextBox
