import React, { Component } from 'react';

class Bridge extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            bridge: {
                ip: '',
                isAuthenticated: false
            },
            isLoading: false
        };
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.getBridge()
            .then(res => this.setState({bridge: res}))
            .catch(err => console.log(err))
            .then(() => this.setState({isLoading: false}));
    }

    getToken = () => {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjA3MzQxNjI0LTM2MTctNDU2OC1iMmQ0LWEyNzFiMzYwMDRmYyIsImlhdCI6MTUyMDgwMzcyMywiZXhwIjoxNTIwODkwMTIzfQ.e9BVERT_KsE6JvkBiSdJFPdJcyg9BnkYeCSiwba5k4U";
    }

    getBridge = async () => {
        const response = await fetch('api/bridge', {
            method: 'GET',
            headers : {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'x-access-token' : this.getToken()
            }
        });
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
                'Content-Type': 'application/json',
                'x-access-token' : this.getToken()
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
        this.setState({bridge: event.target.value});
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h2>Loading .. </h2>
            );
        }
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