import React, { Component } from 'react';
import AuthService from './AuthService';
import { withRouter } from "react-router-dom";

export default function withAuth(AuthComponent) {
    const Auth = new AuthService();

    return withRouter(class AuthWrapped extends Component {
        constructor() {
            super();
            this.state = {
                user: null
            }
        }

        componentWillMount() {
            if (!Auth.loggedIn()) {
                console.log('not logged in');
                this.props.history.replace('/login')
            }
            else {
                try {
                    const profile = Auth.getProfile()
                    this.setState({
                        user: profile
                    })
                }
                catch(err){
                    Auth.logout()
                    this.props.history.replace('/login')
                }
            }
        }

        render() {
            console.log('withauth loc ' + JSON.stringify(this.props.location));
            if (this.state.user) {
                return (
                    <AuthComponent location={this.props.location} user={this.state.user} />
                )
            }
            else {
                return null
            }
        }
    })
}