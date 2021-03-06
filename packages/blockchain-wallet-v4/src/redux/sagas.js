import { dataSagasFactory } from './data/sagas.js'
import { settingsSaga } from './settings/sagas.js'
import { walletSaga } from './wallet/sagas.js'
import { webSocketSaga } from './webSocket/sagas.js'
import { walletOptionsSaga } from './walletOptions/sagas.js'
import { kvStoreSagasFactory } from './kvStore/sagas.js'
import { refreshSaga } from './refresh/sagas.js'

export const coreSagasFactory = ({ api, socket, sfoxService, coinifyService } = {}) => ({
  data: dataSagasFactory({ api, socket, sfoxService, coinifyService }),
  settings: settingsSaga({ api, socket }),
  wallet: walletSaga({ api, socket }),
  walletOptions: walletOptionsSaga({ api, socket }),
  webSocket: webSocketSaga({ api, socket }),
  kvStore: kvStoreSagasFactory({ api }),
  refresh: refreshSaga({api})
})
