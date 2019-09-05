import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Redirect,Switch } from 'react-router-dom';
import { Login } from './Components/Authentication';
import { Home } from './Components/Home';
import { logout } from './Actions/auth/logout';
import location from './Images/location.svg';
import call from './Images/call.svg';
import email from './Images/email.svg';
import './App.css';

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
			<div className="container-fluid App">
				<div className="row dummy">					
				</div>
				<div className="row dark-row">
					<div className="container-fluid">
						<div className="row names">
							<p>DHRUV KALUSKAR &nbsp; | &nbsp; ASEEM JUNEJA</p>
						</div>
					</div>
				</div>
				<div className="row designer-row">
                    <div className="col">
						<div className="container-fluid">
							<div className="row">
								<div className="col-lg-6 logo-col">
									<a href="http://csatimes.co.in/" className="csa-link-home"><h1 className="display-3 logo-heading">CSA TIMES</h1></a>
									<small className="text-muted">Council for Student Affairs</small>
								</div>
								<div className="col-lg-6">
									<div className="container-fluid">										
										<div className="row icons-row">
											<div className="col">
												<a href="tel:+917589201824" className="icon-link">
													<img src={call} className="icons-pic" alt="call" />
													<br/>
													+91 7589201824
												</a>
											</div>
											<div className="col">
												<a href="mailto:gensec@goa.bits-pilani.ac.in" target="_top" className="icon-link">
													<img src={email} className="icons-pic" alt="email" />
													<br/>
													gensec@goa.bits-pilani.ac.in
												</a>
											</div>
											<div className="col">
												<img src={location} className="icons-pic" alt="location" />
												<br/>
												BITS Pilani, Goa Campus
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
                </div>
				<div className="row blue-row text-center">
					<div className="container">
						<div className="row">
							<div className="col">
								<a href="http://csatimes.co.in/" className="csa-link">CSA Home</a>
							</div>
							<div className="col">
								<a href="http://csatimes.co.in/csa" className="csa-link">CSA Team</a>
							</div>
							<div className="col">
								<a href="http://csatimes.co.in/questions" className="csa-link">CSA Forum</a>
							</div>
						</div>
					</div>
				</div>
				<div className="row switch-row">
					<Router>
						<Switch>
							<Route path="/login" component={Login} />
							<PrivateRoute path='/' component={Home} />
						</Switch>
					</Router>
				</div>
				<div className="row">
					<div className="container-fluid text-right pr-5 pl-5">
						{this.props.credential ? <button className="btn btn-danger signout" onClick={() => {this.props.logout()}}>Sign Out</button> : null}
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
		logout: () => {dispatch(logout())},
	};
};
const connectedApp = connect(mapStateToProps,mapDispatchToProps)(App);
export { connectedApp as App };
