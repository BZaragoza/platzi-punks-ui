import React from 'react'

import {BrowserRouter, Routes} from 'react-router-dom'

const AppRouter = ({ children }) => {
  return (
    <BrowserRouter>
      <Routes>
        {children}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter