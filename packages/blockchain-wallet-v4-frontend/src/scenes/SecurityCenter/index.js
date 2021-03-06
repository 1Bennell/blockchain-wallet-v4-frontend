import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'

import SecurityCenter from './template.js'

class SecurityCenterContainer extends React.Component {
  constructor (props) {
    super(props)

    this.handleEnable = this.handleEnable.bind(this)
    this.onClose = this.onClose.bind(this)
    this.setView = this.setView.bind(this)

    this.state = { enabling: false, editing: false, viewing: 'security' }
  }

  handleEnable (step) {
    this.setState({ enabling: step })
  }

  onClose () {
    this.setState({ enabling: false })
  }

  determineProgress () {
    const { authType, emailVerified, isMnemonicVerified } = this.props
    let progress = 0
    if (authType.data > 0) progress++
    if (emailVerified.data > 0) progress++
    if (isMnemonicVerified) progress++
    return progress
  }

  setView (tab) {
    this.setState({ viewing: tab })
  }

  render () {
    return (
      <SecurityCenter progress={this.determineProgress()}
        data={this.props}
        editing={this.state.editing}
        enabling={this.state.enabling}
        handleEnable={this.handleEnable}
        onClose={this.onClose}
        viewing={this.state.viewing}
        setView={this.setView}
        isMnemonicVerified={this.props.isMnemonicVerified}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  authType: selectors.core.settings.getAuthType(state),
  emailVerified: selectors.core.settings.getEmailVerified(state),
  isMnemonicVerified: selectors.core.wallet.isMnemonicVerified(state)
})

export default connect(mapStateToProps, undefined)(SecurityCenterContainer)
