import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as crypto from 'crypto'

import { Exchange } from 'blockchain-wallet-v4/src'
import { getData } from './selectors'
import { actions, selectors } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FormContainer extends React.Component {
  constructor (props) {
    super(props)
    this.seed = crypto.randomBytes(16).toString('hex')
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentWillMount () {
    // If sourceCoin is BTC, refreshSelection to get final fee
    if (this.props.sourceCoin === 'BTC') {
      const { sourceAmount, sourceChangeAddress, btcFee, coins, depositAddress } = this.props
      const feePerByte = btcFee.priority
      const amount = Exchange.convertBitcoinToBitcoin({ value: sourceAmount, fromUnit: 'BTC', toUnit: 'SAT' }).value
      console.log('refreshSelection', feePerByte, coins, amount, depositAddress, sourceChangeAddress, 'singleRandomDraw', this.seed)
      this.props.dataBitcoinActions.refreshSelection(feePerByte, coins, amount, depositAddress, sourceChangeAddress, 'singleRandomDraw', this.seed)
    }
  }

  handleSubmit (e, value) {
    e.preventDefault()
    // Submit exchange
    switch (this.props.sourceCoin) {
      case 'BTC': {
        const payment = { selection: value.selection }
        this.props.sendShapeshiftActions.sendShapeshiftDeposit('BTC', payment, this.props.order)
        break
      }
      case 'ETH': {
        const { sourceAmount, depositAddress } = this.props
        const amount = Exchange.convertEtherToEther({ value: sourceAmount, fromUnit: 'ETH', toUnit: 'WEI' }).value
        const payment = {
          fromIndex: 0,
          to: depositAddress,
          message: 'Shapeshift order',
          amount: amount,
          gasPrice: value.gasPrice,
          gasLimit: value.gasLimit,
          nonce: value.nonce
        }
        this.props.sendShapeshiftActions.sendShapeshiftDeposit('ETH', payment, this.props.order)
        break
      }
    }
  }

  handleCancel () {
    // Reset form and go back to first step
    this.props.formActions.reset('exchange')
    this.props.previousStep()
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success
        {...rest}
        {...value}
        handleSubmit={(e) => this.handleSubmit(e, value)}
        handleCancel={this.handleCancel}
        handleExpiry={this.handleCancel}
      />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.sourceCoin, ownProps.source, ownProps.ethFee, ownProps.depositAmount),
  coins: selectors.core.data.bitcoin.getCoins(state).getOrElse([])
})

const mapDispatchToProps = (dispatch) => ({
  sendShapeshiftActions: bindActionCreators(actions.modules.sendShapeshift, dispatch),
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FormContainer)