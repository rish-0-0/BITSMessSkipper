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
            <div className="container-fluid">
                {this.props.credential ? <Redirect to='/' /> : null}
                <div className="row">
                    <div className="container-fluid text-center p-5 m-2">
                        <div className="card text-center">
                            <div className="card-header">
                                Portal for mess skip service
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Sign in with your BITS Mail</h5>
                                <p className="card-text">You don't have to avail this if you have applied for leave.</p>
                                <button className="btn btn-primary signin" onClick={() => this.props.login()}>Login via Google</button>
                            </div>
                            <div className="card-footer text-muted">
                                Applicable only twice a month
                            </div>
                        </div>
                    </div>
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