import React, { Component } from 'react'

export default class ChatConnect extends Component {
    state = {

    }

    connectToRoom(e) {
        e.preventDefault();
    }

    render() {
        return (
            <form onSubmit={ (e) => this.connectToRoom(e) }>
                <h2>Connect to room</h2>
                <label>Username</label>
                <input type="text" name="username" /> <br/>
                <label>room id</label>
                <input type="text" name="roomId" /> <br/>
                <button>Connect</button>
            </form>
        )
    }
}
