import { formValueSelector } from 'redux-form'
import { equals, filter, head, lift, map, prop, path, is, has } from 'ramda'
import settings from 'config'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (selector, value) => {
  if (value == null) return Remote.of(undefined)
  if (is(String, value)) return Remote.of(value)
  if (has('address', value)) return Remote.of(prop('address', value))
  if (has('index', value)) return selector(prop('index', value))
  return Remote.of(undefined)
}

export const getData = state => {
  const getReceive = index => selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  const getChange = index => selectors.core.common.bitcoin.getNextAvailableChangeAddress(settings.NETWORK, index, state)

  const toDropdown = map(x => ({ text: x.label, value: x }))
  const balancesR = selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown)
  const xpub = selectors.core.wallet.getDefaultAccountXpub(state)
  const defaultFromR = balancesR.map(x => prop('value', head(filter(y => equals(y.value.xpub, xpub), x))))
  const feeR = selectors.core.data.bitcoin.getFee(state)
  const defaultFeeR = feeR.map(path(['regular']))
  const coinsR = selectors.core.data.bitcoin.getCoins(state)
  const coin = formValueSelector('sendBitcoin')(state, 'coin')
  const from = formValueSelector('sendBitcoin')(state, 'from')
  const to = formValueSelector('sendBitcoin')(state, 'to') || formValueSelector('sendBitcoin')(state, 'to2')
  const fee = formValueSelector('sendBitcoin')(state, 'fee')
  const amount = formValueSelector('sendBitcoin')(state, 'amount')
  const effectiveBalance = selectors.core.data.bitcoin.getEffectiveBalance(state)
  const receiveAddressR = extractAddress(getReceive, to)
  const changeAddressR = extractAddress(getChange, from)
  const unitR = selectors.core.settings.getBtcUnit(state)

  const transform = (defaultFrom, defaultFee, coins, receiveAddress, changeAddress, unit) => ({
    initialValues: {
      from: defaultFrom,
      fee: defaultFee,
      coin: 'BTC'
    },
    coin,
    from,
    fee,
    to,
    amount,
    effectiveBalance,
    effectiveBalanceScaled: Exchange.convertBitcoinToBitcoin({ value: effectiveBalance, fromUnit: 'SAT', toUnit: unit }).value,
    coins,
    receiveAddress,
    changeAddress,
    unit
  })

  return lift(transform)(defaultFromR, defaultFeeR, coinsR, receiveAddressR, changeAddressR, unitR)

  // const getReceive = index => selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  // const getChange = index => selectors.core.common.bitcoin.getNextAvailableChangeAddress(settings.NETWORK, index, state)
  // const coin = formValueSelector('sendBitcoin')(state, 'coin')
  // const from = formValueSelector('sendBitcoin')(state, 'from')
  // const to = formValueSelector('sendBitcoin')(state, 'to')
  // const to2 = formValueSelector('sendBitcoin')(state, 'to2')
  // const toFinal = to || to2

  // const amount = formValueSelector('sendBitcoin')(state, 'amount')
  // const message = formValueSelector('sendBitcoin')(state, 'message')
  // const fee = formValueSelector('sendBitcoin')(state, 'fee')
  // const selection = selectors.core.data.bitcoin.getSelection(state)
  // const feeValues = selectors.core.data.bitcoin.getFee(state)
  // const effectiveBalance = selectors.core.data.bitcoin.getEffectiveBalance(state)
  // const coins = selectors.core.data.bitcoin.getCoins(state)
  // const unit = selectors.core.settings.getBtcUnit(state)

  // const receiveAddressR = extractAddress(getReceive, toFinal)
  // const changeAddressR = extractAddress(getChange, from)
  // const addressesR = lift((receiveAddress, changeAddress, fee) =>
  //   ({ receiveAddress, changeAddress, fee }))(receiveAddressR, changeAddressR, feeR)

  // return addressesR
}

export const getFormValues = state => {
  const coin = formValueSelector('sendBitcoin')(state, 'coin')
  const from = formValueSelector('sendBitcoin')(state, 'from')
  const to = formValueSelector('sendBitcoin')(state, 'to')
  const to2 = formValueSelector('sendBitcoin')(state, 'to2')
  const toFinal = to || to2

  return {
    coin,
    from,
    to: toFinal
  }
}

export const getInitialValues = state => {
  // const toDropdown = map(x => ({ text: x.label, value: x }))
  // const balancesR = selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown)
  // const xpub = selectors.core.wallet.getDefaultAccountXpub(state)
  // const fromR = balancesR.map(x => prop('value', head(filter(y => equals(y.value.xpub, xpub), x))))
  // const feeR = selectors.core.data.bitcoin.getFee(state)
  // const feeRegularR = feeR.map(path(['regular']))
  // return lift((from, fee) => ({ from, fee, coin: 'BTC' }))(fromR, feeRegularR)
}