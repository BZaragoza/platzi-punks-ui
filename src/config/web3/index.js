import Web3 from 'web3/dist/web3.min.js'

import { InjectedConnector } from '@web3-react/injected-connector'

export const connector = new InjectedConnector({ 
  supportedChainIds: [4]
})

export const getLibrary = (provider) => {
  return new Web3(provider);
}