
import React from 'react';
import Login from './login';
import './home.css'

import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';



class Home extends React.Component{
    constructor(props){
        super(props)
        let login=false
        let userId = localStorage.getItem('userId')
        login=userId?true:false
        this.state={
          allUserBlogs:[],
          updateObj:'',
          showUpdateDialogueBox:false,
          login:login,
          day:'',
          day_of_week:'',
          date:''
        }
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    
    handleOnChange(event){
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    
    submit = (e) =>{
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ date: this.state.date })
        };
        
        fetch('/sendDateAndGetDay', requestOptions)
            .then(response => response.json()).then(data=> {
                console.log(data)
                if(data.status==200){
                    this.setState({
                        day:data.day,
                        day_of_week: data.day_of_week
                    })
                }
              
        })

    }
    onlogout=()=>{
        fetch('/logout').then(response=>{
            if(response.ok){
                localStorage.clear()
                this.setState({
                    login:false
                })
            }
        })
        
      }
    render(){
        if(!this.state.login){
            return <Redirect to='/login' />
        }
        return(
            <div>
                <input type="button"  onClick={this.onlogout} id="logout" value="Logout"/>
                <div className="form">
                    <form onSubmit={this.submit}>
                        <h2>Enter a date</h2>
                        <input type="date" id="date"  name="date" onChange={this.handleOnChange} value={this.state.date}/>
                        <input type="submit" />
                    </form>
                    <h3>show day :  <span className="data"> {this.state.day} </span></h3>
                     
                    <h3>show day of week : <span className="data">{this.state.day_of_week}</span></h3>
                    
                </div>
            </div>
        )
    }
}
export default Home;