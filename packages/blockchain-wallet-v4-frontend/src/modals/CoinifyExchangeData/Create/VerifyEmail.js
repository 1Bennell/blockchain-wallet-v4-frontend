import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { actions, selectors } from 'data'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { formValueSelector, Field } from 'redux-form'

import { TextBox } from 'components/Form'
import { Text, Button } from 'blockchain-info-components'

import { required } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ButtonWrapper } from 'components/BuySell/Signup'

const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const EmailHelper = styled.span`
  margin-top: 5px;
  font-size: 12px;
  color: ${props => props.theme['gray-3']};
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`
const CancelText = styled.p`
  text-align: center;
  cursor: pointer;
  font-size: 14px;
`

class VerifyEmail extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.onSubmit = this.onSubmit.bind(this)
    this.resendCode = this.resendCode.bind(this)
  }

  componentDidMount () {
    if (this.props.ui.create === 'enter_email_code') {
      this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.oldEmail)
    }

    this.props.formActions.change('coinifyCreate', 'emailAddress', this.props.oldEmail)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.emailVerified && nextProps.ui.uniqueEmail) {
      this.props.updateUI({ create: 'change_mobile' })
    }
  }

  resendCode () {
    this.props.updateUI({ codeSent: true })
    this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.emailAddress)
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.create === 'enter_email_code') {
      this.props.coinifyFrontendActions.coinifyClearSignupError()
      this.props.securityCenterActions.verifyEmailCode(this.props.emailCode)
      this.props.updateUI({ create: 'create_account' })
    } else {
      this.props.updateUI({ create: 'enter_email_code' })
      this.props.securityCenterActions.updateEmail(this.props.emailAddress)
    }
  }

  render () {
    const { ui, invalid } = this.props

    let partnerHeader = () => {
      switch (ui.create) {
        case 'enter_email_code': return <FormattedMessage id='coinifyexchangedata.create.verifyemail.partner.header.enter_email_code' defaultMessage='Blockchain + Coinify' />
        case 'change_email': return <FormattedMessage id='coinifyexchangedata.create.verifyemail.partner.header.change_email' defaultMessage='Change Email' />
      }
    }

    let partnerSubHeader = () => {
      switch (ui.create) {
        case 'enter_email_code': return <FormattedHTMLMessage id='coinifyexchangedata.create.verifyemail.partner.subheader.enter_email_code' defaultMessage='We teamed up with Coinify’s exchange platform to offer buy and sell to our customers in Europe. We just sent a verification code to your <b>{email}</b> email address.' values={{email: this.props.emailAddress}} />
        case 'change_email': return <FormattedMessage id='coinifyexchangedata.create.verifyemail.partner.subheader.change_email' defaultMessage='Updating your email will also change the email associated with your wallet.' />
      }
    }

    let emailHelper = () => {
      switch (true) {
        case ui.codeSent: return <FormattedMessage id='coinifyexchangedata.create.verifyemail.helper.sentanothercode' defaultMessage='Another code has been sent!' />
        case !ui.codeSent: return <FormattedMessage id='coinifyexchangedata.create.verifyemail.helper.didntreceive' defaultMessage="Didn't receive your email? {resend} or {changeEmail}." values={{ resend: <a onClick={this.resendCode}>Resend</a>, changeEmail: <a onClick={() => this.props.updateUI({ create: 'change_email' })}>change email</a> }} />
      }
    }

    return (
      <Form onSubmit={this.onSubmit}>
        <ColLeft>
          <InputWrapper>
            <PartnerHeader>
              { partnerHeader() }
            </PartnerHeader>
            <PartnerSubHeader>
              { partnerSubHeader() }
            </PartnerSubHeader>
            {
              ui.create === 'enter_email_code'
                ? <EmailInput>
                  <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                    <FormattedMessage id='coinifyexchangedata.create.verifyemail.code' defaultMessage='Enter your verification code to get started:' />
                  </Text>
                  <Field name='emailCode' onChange={() => this.props.updateUI({ uniqueEmail: true })} component={TextBox} validate={[required]} />
                  <EmailHelper>
                    { emailHelper() }
                  </EmailHelper>
                </EmailInput>
                : <EmailInput>
                  <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                    <FormattedMessage id='coinifyexchangedata.create.verifyemail.confirm' defaultMessage='Confirm Email:' />
                  </Text>
                  <Field name='emailAddress' component={TextBox} validate={[required]} />
                </EmailInput>
            }
          </InputWrapper>
        </ColLeft>
        <ColRight>
          {
            ui.create === 'enter_email_code'
              ? <ButtonWrapper>
                <Button uppercase type='submit' nature='primary' fullwidth disabled={invalid}>
                  <FormattedMessage id='coinifyexchangedata.create.verifyemail.continue' defaultMessage='Continue' />
                </Button>
              </ButtonWrapper>
              : <ButtonWrapper>
                <Button type='submit' nature='primary' fullwidth disabled={invalid}>
                  <FormattedMessage id='coinifyexchangedata.create.verifyemail.sendverificationemail' defaultMessage='Send Verification Code Email' />
                </Button>
                <CancelText onClick={() => this.props.updateUI({create: 'enter_email_code'})}>Cancel</CancelText>
              </ButtonWrapper>
          }
        </ColRight>
      </Form>
    )
  }
}

VerifyEmail.propTypes = {
  ui: PropTypes.object,
  invalid: PropTypes.boolean,
  updateUI: PropTypes.function,
  emailAddress: PropTypes.string,
  formActions: PropTypes.object,
  emailCode: PropTypes.string,
  oldEmail: PropTypes.string
}

const mapStateToProps = (state) => ({
  oldEmail: selectors.core.settings.getEmail(state).data,
  emailCode: formValueSelector('coinifyCreate')(state, 'emailCode'),
  emailAddress: formValueSelector('coinifyCreate')(state, 'emailAddress')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyFrontendActions: bindActionCreators(actions.modules.coinify, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { codeSent: false } })
)

export default enhance(VerifyEmail)
