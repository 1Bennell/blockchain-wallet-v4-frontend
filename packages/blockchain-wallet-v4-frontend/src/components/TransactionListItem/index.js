import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import TransactionListItem from './template.js'

class ListItemContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleCoinToggle = this.handleCoinToggle.bind(this)
    this.handleEditDescription = this.handleEditDescription.bind(this)
  }

  handleCoinToggle () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }
  handleEditDescription (value) {
    if (this.props.coin === 'ETH') {
      this.props.ethereumActions.setTxNotesEthereum(this.props.transaction.hash, value)
    } else {
      this.props.walletActions.setTransactionNote(this.props.transaction.hash, value)
    }
  }

  render () {
    return <TransactionListItem
      coin={this.props.coin}
      minConfirmations={this.props.minConfirmations}
      transaction={this.props.transaction}
      handleClick={this.handleCoinToggle}
      handleEditDescription={this.handleEditDescription}
    />
  }
}

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  ethereumActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ListItemContainer)
