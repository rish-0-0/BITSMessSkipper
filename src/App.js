import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Redirect,Switch } from 'react-router-dom';
import { Login } from './Components/Authentication';
import { Home } from './Components/Home';
import { logout } from './Actions/auth/logout';

const PrivateRoute = ({
    component: Component, ...rest
}) => (
    <Route
        {...rest}
        render={props => (
            sessionStorage.getItem('token')
            ? <Component {...props} />
            : <Redirect to={ {pathname: '/login', /*state: {from: props.location}*/ } } />
        )}
    />
);

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			// APP STATE
		};
		// THIS BINDINGS AND VARIABLES
	}
	// LIFE CYCLE METHODS
	// componentDidMount() {
	// }
	// RENDER METHOD
	render() {
		return (
			<div className="container main-App">
				<div className="row">
                    <div className="column">

                    </div>
                    <div className="column">
                        {this.props.credential ? <button className="button button-primary" onClick={() => {this.props.logout()}}>Sign Out</button> : null}
                    </div>
                </div>
				<div className="row">
					<Router>
						<Switch>
							<Route path="/login" component={Login} />
							<PrivateRoute path='/' component={Home} />
						</Switch>
					</Router>
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
		logout: () => {dispatch(logout())},
	};
};
const connectedApp = connect(mapStateToProps,mapDispatchToProps)(App);
export { connectedApp as App };
