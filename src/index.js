import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Chat from './scenes/chat';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Route} from "react-router-dom"


ReactDOM.render(

        <Router>
            <Route exact path='/' component={App}/>
            <Route path='/chat' component={Chat}/>
        </Router>

  ,
    document.getElementById('root')
);

serviceWorker.unregister();
