import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';

import LoginSignup from './templates/LoginSignup'
import MainComponent from './templates/mainComponent'
// remove this testTemplated and do mainLayout..
import Test from './templates/testTemplated'
export default class Hello extends Component {

        constructor(props) {
        super(props);
        this.state = {
             isLogin:true
        }
         this.loginCallBack = this.loginCallBack.bind(this);
         this.logoutCallBack = this.logoutCallBack.bind(this);
      };

loginCallBack()
{
    // if you are not setting token in login submit, you can set it here as well
    this.setState({isLogin: false});
}

logoutCallBack(){
    this.setState({isLogin: true});
}

render(){
  var self = this
/* put your token condition here */
// Replace test with mainlayout.. just for testing purpose as camera error occured
var flag = true
if(this.state.isLogin)
 {
   return(
          <LoginSignup  loginCallBack={self.loginCallBack}/>
       );
  }
  else {
    return(
           <MainComponent logoutCallBack={self.logoutCallBack}/>
        );
  }
}
}

AppRegistry.registerComponent('HelloWorld', () => Hello);
