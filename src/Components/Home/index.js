import React, { Component } from 'react';
import { connect } from 'react-redux';
import { writeNewDocumentWithId } from '../../Actions/writeData';
import { readData } from '../../Actions/readData';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BITSid:'',
            selectOption: false,
            num:0,
            successfulSubmission:false,
            status:null,
            error:null,
            valid:true,
        };
    }
    async componentDidMount() {
        let email = this.props.email;
        const success = await this.getBitsId(email);
        if(!success) {
            this.setState({
                error:"You have network problems, or you don't belong to the database",
            });
        }
        else {
            email = email.split('.').join('_');
            this.props.readData('Users',email);
        }
    }
    // handleName = (e) => {
    //     const name = e.target.value;
    //     this.setState({
    //         name:name,
    //     });
    // };
    // handleId = (e) => {
    //     const BITSid = e.target.value;
    //     this.setState({
    //         BITSid:BITSid,
    //     });
    // };
    getBitsId = async (email) => {
        // console.log('getting BITS ID');
        try {
            console.log('fetching');
            const response = await fetch(`https://us-central1-bitsdelivery-6a7e4.cloudfunctions.net/getStudentDetails?flag=true&dest=${email}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept':'application/json',
                    },
                }
            );
            // const data = await response.text();
            // console.log("what: ",data);
            // const data = await response.json();
            // console.log("data",data);
            // console.log('HOW LONG WILL THIS WAIT');
            console.log('DATA after fetching ID',response);
            let flag;
            if(response.status === 200) {
                flag = true;
            } else {
                flag = false;
            }
            console.log("FLAG",flag);
            return flag;
        } catch (err) {
            console.log('Error ocurred while running firebase function from email: ',email,err);
        }
    };
    handleCheck = () => {
        this.setState({
            selectOption: !this.state.selectOption,
        });
    };
    setBitsId = (id) => {
        this.setState({
            BITSid: id,
        });
    };
    handleSubmit = async (name,id,selected) => {
        let email = this.props.email;
        if(!selected) {
            await this.setState({
                error:'Please select the option',
            });
            console.log("Not selected option");
            return;
        }
        if(id === '') {
            await this.setState({
                error: 'NO RECORD FOUND. NOT A REGISTERED STUDENT IN BITS PILANI, GOA',
            });
            console.log("Error ocurred due to an ID Problem: The ID is: ",id);
            return;
        }
        // Retrieve count from previous time and handle count exceeding funda
        // basically return the function after a state change 
        // So no writing to the database is done
        if(Array.isArray(this.props.readItems) && this.props.readItems.length && this.props.readItems[0]) {
            // console.log(this.props.readItems);
            let { SkipMess } = this.props.readItems[0];
            let getMonths = [];
            let numberOfMonths;
            console.log("SKPMESS",SkipMess);
            let noSkipFlag = false;
            if(typeof SkipMess === "undefined")
                {
                    SkipMess = {};
                    noSkipFlag = true;
                }
            Object.keys(SkipMess).forEach( key => {
                getMonths.push(SkipMess[key]);
            });
            numberOfMonths = !noSkipFlag ? Object.keys(SkipMess).length : 0;
            let lastMonth = !noSkipFlag ? getMonths[numberOfMonths - 1] : null;
            let numberOfMonthsRequestedForSkip = !noSkipFlag ? Object.keys(lastMonth).length : 0;
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
                day = this.tomorrow(nowDate).day;
                month = this.tomorrow(nowDate).month;
                let combined_month_year = month + '_'+year;
                if(numberOfMonthsRequestedForSkip === 1) {
                    lastMonth['second'] = {
                        'day':day,
                    };
                } else if(numberOfMonthsRequestedForSkip === 0) {
                    // lastMonth = {
                    //     [combined_month_year]: {
                    //         'first': {
                    //             'day':day,
                    //         },
                    //     },
                    // };
                    lastMonth={};
                    lastMonth['first'] = {
                        'day':day,
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
            day = this.tomorrow(nowDate).day;
            month = this.tomorrow(nowDate).month;
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
    tomorrow = (nowDate) => {
        let tomo = new Date();
        tomo.setDate(nowDate.getDate()+1);

        return {
            day:tomo.getDate(),
            month:tomo.getMonth()+1, //month in js is from 0-11
        };
    };
    functionSubmit = async (email,selectOption) => {
        // fetch(`https://us-central1-bitsdelivery-6a7e4.cloudfunctions.net/setTodayMessOption?dest=${email}`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept':'application/json',
        //     },
        // })
        // .then(res => {
        //     console.log(res);
            
        //     this.setState({
        //         valid:true,
        //         successfulSubmission:true,
        //     });
        // })
        // .catch(err => {
        //     console.log("Error ocurred while submitting",err.message);
        //     this.setState({
        //         error: 'Error ocurred while submission',
        //     });
        // });
        if(!selectOption) {
            this.setState({
                error:'Please tick the checkbox to submit a request',
            });
            return;
        }
        try {
            const response = await fetch(`https://us-central1-bitsdelivery-6a7e4.cloudfunctions.net/setTodayMessOption?dest=${email}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':'application/json',
                },
            });
            const text = await response.text();
            const status = parseInt(text[text.length - 1]);
            this.setState({
                status:status,
            });
            
        } catch(err) {
            console.log("Error ocurred while submitting through function",err.message);
        }
    };
    render() {
        let BITSID = '';
        if(Array.isArray(this.props.readItems) && this.props.readItems.length) {
            BITSID = this.props.readItems[0].Id;
        }
        return(
            <div className="container">
                <div className="row">
                    {(Array.isArray(this.props.readItems) && this.props.readItems.length) ?
                    this.props.readItems.map((item,index) => {
                        if(!item) {
                            return <h1 key={index}>Hello, {this.props.name}</h1>;
                        }
                        return(
                            // <div className="container-fluid" key={item.Id}>
                            //     <h3>{item.Name}</h3>
                            //     <h3>{item.Email}</h3>
                            //     <h3>{item.Id}</h3>
                            // </div>
                            <div className="table-responsive" key={item.Id}>
                                <table className="table">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row"></th>
                                            <td>{this.props.name}</td>
                                            <td>{this.props.email}</td>
                                            <td>{item.Id}</td>
                                        </tr>
                                    </tbody>
                                </table>
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
                                <span className="badge badge-danger badge-pill">!</span>
                                &nbsp;
                                You must not utilise the mess services for the next day during any meal, i.e breakfast, lunch and dinner
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row form-row">
                    <form>
                        <fieldset>
                            {/* <div className="form-group">
                                <label htmlFor="nameField">Name</label>
                                <input className="form-control" type="text" id="nameField" value={this.state.name} onChange={(e) => this.handleName(e)} />
                            </div> */}
                            <div className="form-group">
                                <label htmlFor="idField">BITS ID</label>
                                <input className="form-control" type="text" id="idField" value={BITSID} readOnly />
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="confirmField" onChange={() => this.handleCheck()} />
                                <label className="form-check-label" htmlFor="confirmField">I want to opt out of mess for tomorrow</label>
                            </div>
                            <button className="btn btn-success" onClick={(e) => {
                                e.preventDefault();
                                //this.handleSubmit(this.props.name,BITSID,this.state.selectOption);
                                this.functionSubmit(this.props.email,this.state.selectOption);
                            }}>Submit</button>
                            {this.state.error ? <h5>{this.state.error}</h5> : null}
                        </fieldset>
                    </form>
                </div>
                <div className="row">
                    {this.state.status ? this.state.status === 1 ? <h1>You have skipped mess for tomorrow</h1> : null : null}
                    {this.state.status ? this.state.status === 2 ? <h1>You have used it twice this month</h1> : null : null}
                    {this.state.status ? this.state.status === 3 ? <h1>You have already used it for tomorrow</h1> : null : null}
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