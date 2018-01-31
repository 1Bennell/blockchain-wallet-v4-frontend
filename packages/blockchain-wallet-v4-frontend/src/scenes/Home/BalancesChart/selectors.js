import { selectors } from 'data'
import { lift } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { Color } from 'blockchain-info-components'

export const getData = (state) => {
  const bitcoinBalanceR = selectors.core.data.bitcoin.getBalance(state)
  const etherBalanceR = selectors.core.data.ethereum.getBalance(state)
  const bitcoinBalance = bitcoinBalanceR.getOrElse(0)
  const etherBalance = etherBalanceR.getOrElse(0)
  const bitcoinRates = selectors.core.data.bitcoin.getRates(state)
  const ethereumRates = selectors.core.data.ethereum.getRates(state)
  const settings = selectors.core.settings.getSettings(state)

  const transform = (bitcoinRates, ethereumRates, settings) => {
    const bitcoinFiatBalance = Exchange.convertBitcoinToFiat({ value: bitcoinBalance, fromUnit: 'SAT', toCurrency: settings.currency, rates: bitcoinRates })
    const etherFiatBalance = Exchange.convertEtherToFiat({ value: etherBalance, fromUnit: 'WEI', toCurrency: settings.currency, rates: ethereumRates })

    const chartData = [{
      name: 'Bitcoin',
      y: Number(bitcoinFiatBalance.value),
      id: 'btc',
      color: Color('brand-primary')
    }, {
      name: 'Ether',
      y: Number(etherFiatBalance.value),
      id: 'eth',
      color: Color('brand-secondary')
    }, {
      name: 'Bitcoin Cash',
      y: 0,
      id: 'bch',
      color: Color('brand-tertiary')
    }]

    return ({ bitcoinBalance, etherBalance, chartData, symbol: bitcoinFiatBalance.unit.symbol })
  }

  return lift(transform)(bitcoinRates, ethereumRates, settings)
}