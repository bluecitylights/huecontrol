import React, { Component } from 'react';

class Bridge extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            bridge: {
                ip: '',
                isAuthenticated: false
            }
        };
    }

    componentDidMount() {
        this.getBridge()
            .then(res => this.setState({bridge: res}))
            .catch(err => console.log(err));
    }

    getBridge = async () => {
        const response = await fetch('api/bridge');
        const body = await response.json();
        
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    }

    postBridge(bridge) {
        console.log('in post');
        console.log(JSON.stringify(bridge));
        fetch('/api/bridge', {
            method: 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bridge)
        }).catch(err => console.log('error submitting'));
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = this.state.bridge;
        this.postBridge(data);
    }

    handleChange(event) {
        console.log('change');
        console.log(event.target.value);
        this.setState({bridge: event.target.value});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor='bridgeip'>Bridge IP</label>
                <input id='bridgeip' name='bridgeip' type="text" value={this.state.bridge.ipAddress} onChange={this.handleChange} />
                <button>Update bridge</button>
                <h3>{JSON.stringify(this.state)}</h3>
            </form>
        );
    }
}

export default Bridge;