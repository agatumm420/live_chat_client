import React, {Component,useState, useEffect} from "react";
import { PostData } from "../services/PostData";
import {Navigate} from 'react-router-dom';
export default class Login extends Component {
    constructor(){
        super();
        this.state = {
        email: '',
        password: '',
        redirectToReferrer: false
        };
        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);
        }
        login() {
            if(this.state.email && this.state.password){
              PostData('login',{
                'data':{
                    'email':this.state.email,
                    'password':this.state.password
                }
            }).then((result) => {
                console.log(result);
                let responseJson = result;
                if(responseJson['data']){
                sessionStorage.setItem('userData',JSON.stringify(responseJson));
                    this.setState({redirectToReferrer: true});
                  }
                else
                  console.log(result);
                });
            }
            else{
              console.log('no stuff');
            }
    }
    onChange(e){
        this.setState({[e.target.name]:e.target.value});
    }
    render(){
        if (this.state.redirectToReferrer) {
            return (<Navigate to={'/chats'}/>)
            }
            if(sessionStorage.getItem('userData')){
            return (<Navigate to={'/chats'}/>)
            }
        return (<section className="h-screen">
        <div className="container px-6 py-12 h-full">
      <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
        
        <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
          <form>
            {/* <!-- Email input --> */}
            <div className="mb-6">
              <input
                type="text"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Email address"
                name='email'
                onChange={this.onChange}
              />
            </div>
  
            {/* <!-- Password input --> */}
            <div className="mb-6">
              <input
                type="password"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Password"
                name="password"
                onChange={this.onChange}
              />
            </div>
  
            <div className="flex justify-between items-center mb-6">
              
              <a
                href="#!"
                className="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
                >Forgot password?</a
              >
            </div>
  
            {/* <!-- Submit button --> */}
            <button
              type="submit"
              className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              onClick={this.login}
            >
              Sign in
            </button>
  
           
              
          </form>
        </div>
      </div>
    </div>
  </section>)
  }
}
