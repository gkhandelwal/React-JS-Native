import React, { Component } from 'react';
import { Container,Header,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button,Tabs } from 'native-base';
import {View, Image, StyleSheet,ScrollView } from 'react-native';
import Login from './Login'
import Signup from './Signup'

export default class LoginSignup extends Component {
    
        constructor(props) {
        super(props);
        this.state = {
            }
        };


render(){
 return(
        <Container> 
         <Image source={require('./images/3.jpg')} style={styles.container}>
          <Content>
           <Tabs>
            <Login tabLabel="Login" loginCallBack={this.props.loginCallBack} />
            <Signup tabLabel="Signup" loginCallBack={this.props.loginCallBack}/>
           </Tabs>
          </Content>
         </Image>
        </Container>
     );   
  }
}

var styles = StyleSheet.create({
   container: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
});