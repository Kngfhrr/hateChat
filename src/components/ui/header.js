import React from 'react'
import '../styles/header.css'



const Header = ({data}) => (
    <div className='header'>
        <div>
            <span className='hateChat'>
                HateChat
            </span>

        </div>
        <span className='user-online'>
            {'0'} Users online
        </span>
        <span className='your-login'>{data.login}</span>
    </div>
)
export default Header;