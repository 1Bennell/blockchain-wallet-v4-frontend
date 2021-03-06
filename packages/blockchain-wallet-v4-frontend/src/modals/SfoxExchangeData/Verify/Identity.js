import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormGroup, FormItem, TextBox } from 'components/Form'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'

import { requiredSSN, requiredDOB, normalizeSocialSecurity, normalizeDateOfBirth, ageOverEighteen } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ErrorWrapper, ColRightInner } from 'components/BuySell/Signup'
import { FAQ1, FAQ2 } from './faq.js'

const LockIcon = styled(Icon)`
  font-size: 24px;
  margin-left: 7px;
`
const FormContainer = styled.div`
  margin-top: 25px;
`

const Identity = (props) => {
  const { handleReset, handleSubmit, invalid, pristine, submitting, verificationError } = props
  const { busy } = props.ui

  return (
    <Form onSubmit={handleSubmit}>
      <ColLeft>
        <InputWrapper>
          <PartnerHeader>
            <FormattedMessage id='sfoxexchangedata.verify.partner.header' defaultMessage='Verify Identity' />
            <LockIcon name='lock' />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='sfoxexchangedata.verify.partner.subheader' defaultMessage='We are required to collect this information to open your exchange account. This information will be sent directly to SFOX and will not be saved to your Blockchain wallet.' />
          </PartnerSubHeader>
          <FormContainer>
            <FormGroup>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.ssn' defaultMessage='Social Security Number' />
                </Text>
                <Field name='ssn' validate={[requiredSSN]} component={TextBox} placeholder='___-__-___' normalize={normalizeSocialSecurity} />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.dateofbirth' defaultMessage='Date of Birth' />
                </Text>
                <Field name='dob' validate={[requiredDOB, ageOverEighteen]} component={TextBox} placeholder='mm/dd/yyyy' normalize={normalizeDateOfBirth} />
              </FormItem>
            </FormGroup>
          </FormContainer>
        </InputWrapper>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <Button uppercase nature='primary' fullwidth type='submit' disabled={busy || invalid || pristine || submitting || verificationError}>
            {
              !busy
                ? <FormattedMessage id='sfoxexchangedata.verify.continue' defaultMessage='Continue' />
                : <HeartbeatLoader height='20px' width='20px' color='white' />
            }
          </Button>
          <ErrorWrapper>
            {
              verificationError && <Text size='12px' color='error' weight={300} onClick={handleReset}>
                <FormattedHTMLMessage id='sfoxexchangedata.verify.identity.error' defaultMessage='Unfortunately there was a problem verifying your identity. <a>Click here</a> to start over.' />
              </Text>
            }
          </ErrorWrapper>
          <FAQ1 />
          <FAQ2 />
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'sfoxIdentity' })(Identity)
