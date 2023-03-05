import React from 'react'
import './index.css'
import logo from '../../assets/bg-white-logo.png'

function Header() {
  return (
      <header>
          <img height={200} width={200} src={logo} alt="" />
          <ul>
              <li>
                  <a>Documentation</a>
              </li>
              <li>
                  <a>Blog</a>
              </li>
          </ul>
        </header>
  )
}

export default Header