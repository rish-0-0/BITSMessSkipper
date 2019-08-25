import React, { Component } from 'react';
import { connect } from 'react-redux';
import { writeNewDocumentWithId } from '../../Actions/writeData';
import { readData } from '../../Actions/readData';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            BITSid:'',
            selectOption: false,
            error:null,
            valid:true,
        };
    }
    componentDidMount() {
        let email = this.props.email;
        email = email.split('.').join('_');
        this.props.readData('Users',email);
    }
    handleName = (e) => {
        const name = e.target.value;
        this.setState({
            name:name,
        });
    };
    handleId = (e) => {
        const BITSid = e.target.value;
        this.setState({
            BITSid:BITSid,
        });
    };
    handleCheck = () => {
        this.setState({
            selectOption: !this.state.selectOption,
        });
    };
    handleSubmit = (name,id,selected) => {
        let email = this.props.email;
        // Retrieve count from previous time and handle count exceeding funda
        // basically return the function after a state change 
        // So no writing to the database is done
        if(Array.isArray(this.props.readItems) && this.props.readItems.length && this.props.readItems[0]) {
            // console.log(this.props.readItems);
            let { SkipMess } = this.props.readItems[0];
            let getMonths = [];
            Object.keys(SkipMess).forEach( key => {
                getMonths.push(SkipMess[key]);
            });
            let numberOfMonths = Object.keys(SkipMess).length;
            let lastMonth = getMonths[numberOfMonths - 1];
            let numberOfMonthsRequestedForSkip = Object.keys(lastMonth).length;
            if(numberOfMonthsRequestedForSkip === 2) {
                this.setState({
                    valid:false,
                });
            } else {
                let modifiedEmail = email.split('.').join('_');
                let nowDate = new Date();
                let month = nowDate.getMonth()+1; //1-12
                let year = nowDate.getFullYear(); //Year
                let day = nowDate.getDate(); // 1-31
                let combined_month_year = month + '_'+year;
                if(numberOfMonthsRequestedForSkip === 1) {
                    lastMonth['second'] = {
                        'day':day,
                    };
                } else if(numberOfMonthsRequestedForSkip === 0) {
                    lastMonth = {
                        [combined_month_year]: {
                            'first': {
                                'day':day,
                            },
                        },
                    };
                }
                const pkg = {
                    [modifiedEmail]:{
                        'Email':email,
                        'Id':id,
                        'Name':name,
                        'SkipMess':{
                            [combined_month_year]: {
                                ...lastMonth,
                            },
                        },
                    },
                };
                if(selected) {
                    this.props.writeNewDocumentWithId('Users',pkg);
                    this.props.readData('Users',modifiedEmail);
                }
                else {
                    this.setState({
                        error:'Please confirm the option to opt out of mess for tomorrow',
                    });
                }
            }

        } else {
            let modifiedEmail = email.split('.').join('_');
            let nowDate = new Date();
            let month = nowDate.getMonth()+1; //1-12
            let year = nowDate.getFullYear(); //Year
            let day = nowDate.getDate(); // 1-31
            let combined_month_year = month + '_'+year;
            const pkg = {
                [modifiedEmail]:{
                    'Email':email,
                    'Id':id,
                    'Name':name,
                    'SkipMess':{
                        [combined_month_year]: {
                            'first':{
                                'day':day,
                            },
                        },
                    },
                },
            };
            if(selected) {
                this.props.writeNewDocumentWithId('Users',pkg);
                this.props.readData('Users',modifiedEmail);
            }
            else {
                this.setState({
                    error:'Please confirm the option to opt out of mess for tomorrow',
                });
            }
        }
        
    };
    render() {
        return(
            <div className="container">
                <div className="row">
                    {(Array.isArray(this.props.readItems) && this.props.readItems.length) ?
                    this.props.readItems.map((item,index) => {
                        if(!item) {
                            return <h1 key={index}>Hello, {this.props.name}</h1>;
                        }
                        return(
                            <div className="container-fluid" key={item.Id}>
                                <h3>{item.Name}</h3>
                                <h3>{item.Email}</h3>
                                <h3>{item.Id}</h3>
                            </div>
                        )
                    }) : <h1>Welcome, First Time?<br /></h1>}
                </div>
                <div className="row">
                    <div className="container">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <span className="badge badge-warning badge-pill">!</span>
                                &nbsp;
                                You can only avail this service two times every month
                            </li>
                            <li className="list-group-item">
                                <span className="badge badge-secondary badge-pill">!</span>
                                &nbsp;
                                Please only write your own name and ID in the form, as it is recorded by the CSA
                            </li>
                            <li className="list-group-item">
                                <span className="badge badge-danger badge-pill">!</span>
                                &nbsp;
                                You must not utilise the mess services for the next day during any meal, i.e, breakfast, lunch and dinner
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row form-row">
                    <form>
                        <fieldset>
                            <div className="form-group">
                                <label htmlFor="nameField">Name</label>
                                <input className="form-control" type="text" id="nameField" value={this.state.name} onChange={(e) => this.handleName(e)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="idField">BITS ID</label>
                                <input className="form-control" type="text" id="idField" value={this.state.BITSid} onChange={(e) => this.handleId(e)} />
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="confirmField" onChange={() => this.handleCheck()} />
                                <label className="form-check-label" htmlFor="confirmField">I want to opt out of mess for tomorrow</label>
                            </div>
                            <button className="btn btn-success" onClick={(e) => {
                                e.preventDefault();
                                this.handleSubmit(this.state.name,this.state.BITSid,this.state.selectOption);
                            }}>Submit</button>
                            {this.state.error ? <h5>{this.state.error}</h5> : null}
                        </fieldset>
                    </form>
                </div>
                <div className="row">
                    {!this.state.valid ? <h1>You have already applied twice</h1> : null}
                    {this.props.wrote ? <h1>Successfully launched request</h1> : null}
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    const { name, email, credential, firebaseUID, isNewUser } = state.auth;
    const { stillWriting, wroteDocumentId, writeError,wrote } = state.write;
    const { loading, readItems, readError } = state.read;
    return {
       name,
       email,
       credential,
       firebaseUID,
       stillWriting,
       wroteDocumentId,
       writeError,
       loading,
       readItems,
       readError,
       isNewUser,
       wrote,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        readData: (collection,document) => {dispatch(readData(collection,document))},
        writeNewDocumentWithId: (collection,data) => {dispatch(writeNewDocumentWithId(collection,data))},
    };
};
const connectedHome = connect(mapStateToProps,mapDispatchToProps)(Home);

export { connectedHome as Home };