import React, { Component } from 'react'
import { Switch, Route } from 'react-router'

import './App.css'

// import io from "socket.io-client";


import ChatConnect from './components/ChatConnect'
import Chat from './components/Chat'
import { BrowserRouter } from 'react-router-dom'

// const socket = io('localhost:5000');


export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <h1>---coolchatapp---</h1>
                <Switch>
                    <Route exact path="/" component={ ChatConnect } />
                    <Route path="/chat/:roomId" component={ Chat } /> 
                </Switch>
            </BrowserRouter> 
        )
    }
}

/*


*/
