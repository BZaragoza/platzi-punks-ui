import React from 'react'
import {Route} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { Web3ReactProvider } from '@web3-react/core'

import AppRouter from './router/AppRouter'
import MainLayout from './layouts/main/index';
import Home from './views/home';
import Punks from './views/punks'
import Punk from './views/punk/index';

import {getLibrary} from './config/web3'

const App = () => {
  return (
    <ChakraProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AppRouter>
          <Route path='/' element={<MainLayout><Home /></MainLayout>} />
          <Route path='/punks' element={<MainLayout><Punks /></MainLayout>} />
          <Route path='/punk/:tokenId' element={<MainLayout><Punk /></MainLayout>} />
        </AppRouter>
      </Web3ReactProvider>
    </ChakraProvider>
  )
}

export default App