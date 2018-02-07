import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { Icon } from 'blockchain-info-components'
import { SelectBoxBitcoinAddresses, TextBox, TabMenuTransactionStatus } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['gray-1']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  @media(min-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const Controls = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 5px;
  width: 100%;

  & > * { margin-left: 5px; }
  & input { border: 1px solid ${props => props.theme['gray-2']}!important; }
  & button { border: 1px solid ${props => props.theme['gray-2']}!important; }

  @media(min-width: 1200px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: auto;
  }
`
const Addresses = styled.div`
  width: 100%;
  @media(min-width: 1200px) { width: 360px; }
`
const Status = styled.div`
  width: 100%;
  @media(min-width: 1200px) { width: 360px; }
`

const Search = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  @media(min-width: 1200px) { width: auto; }
`
const SearchIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`

const Menu = (props) => {
  return (
    <Wrapper>
      <Container>
        <Controls>
          <Addresses>
            <Field name='source' component={SelectBoxBitcoinAddresses} />
          </Addresses>
          <Status>
            <Field name='status' component={TabMenuTransactionStatus} />
          </Status>
        </Controls>
        <Controls>
          <Search>
            <Field name='search' component={TextBox} />
            <SearchIcon name='search' size='20px' />
          </Search>
        </Controls>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({ form: 'bchTransaction' })(Menu)