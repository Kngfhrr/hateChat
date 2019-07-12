import React from 'react';

import smile from '../images/smile1.svg'
import image from '../images/image.svg'


const Footer = () => (

    <div className='footer'>
        <div className='icons'>
            <img style={{width: '30px', cursor: 'pointer'}} src={smile} alt={''}/>
            <img style={{width: '30px', cursor: 'pointer'}} src={image} alt={''}/>
        </div>

        <input
            onKeyPress={this.createChat}
            placeholder='Write a message...'
            className='input-send'></input>


    </div>
);
export default Footer;