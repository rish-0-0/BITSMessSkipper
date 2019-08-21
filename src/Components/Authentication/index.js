import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../Actions/auth/login';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return(
            <div className="container">
                {this.props.credential ? <Redirect to='/' /> : null}
                <div className="row">
                    Some theme shit
                </div>
                <div className="row">
                    Some more theme shit
                </div>
                <div className="row">
                    Login via your BITS Email
                </div>
                <div className="row">
                    Some rules and regulations
                </div>
                <div className="row">
                    <button className="button button-outline" onClick={() => this.props.login()}>Login via Google</button>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    const { credential } = state.auth;
    return {
        credential,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        login: () => {dispatch(login())},
    };
};
const connectedLogin = connect(mapStateToProps,mapDispatchToProps)(Login);
export { connectedLogin as Login };