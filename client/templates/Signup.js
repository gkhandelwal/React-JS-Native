import React, { Component } from 'react';
import {AsyncStorage, ScrollView} from 'react-native';
import { Container,Header,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
const USER_REFERENCE = 'email';

export default class Signup extends Component {
    
        constructor(props) {
        super(props);
        this.state = {
        firstname:'',
        lastname:'',
        email:'',
        password:''
        };
    this.submitSignup=this.submitSignup.bind(this);   
    this.setEmail=this.setEmail.bind(this);  
    this.buttonIsDisabled=this.buttonIsDisabled.bind(this);
    }
    
setEmail(){
AsyncStorage.setItem(USER_REFERENCE,this.state.email, (err)=> {
        if(err){
            console.log("an error");
            throw err;
          }
          console.log("success");
          this.props.loginCallBack(); 
        }).catch((err)=> {
            console.log("error is: " + err);
    });
}    
    
buttonIsDisabled(){
  if ((this.state.email && this.state.email.trim()) && (this.state.password && this.state.password.trim()) &&
      (this.state.firstname && this.state.firstname.trim()) && (this.state.lastname && this.state.lastname.trim())){
  return false  
  }else{
  return true
  }
}   
    
submitSignup(){
var url= 'https://allergywatch.herokuapp.com/Signup/'    
    fetch(url, {method: 'POST',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      },
     body: JSON.stringify({
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email:this.state.email,
      password:this.state.password})}) 
    .then((response) => response.json())
    .then((responseJson) => {
       console.log(responseJson);
       if(responseJson.message=='success')
           {
               console.log("LoginSuccess");
               this.setEmail();
           }
      })
    .catch((error) => {
        console.error(error);
      })
    .done();
}    
            
  render(){
        return (
                 <Content style={{ alignSelf: 'center', marginTop: 80, marginBottom: 10 }}>
                 <ScrollView>
                    <List>
                        <ListItem>
                            <InputGroup style={{ alignSelf: 'center', marginTop: 30, marginBottom: 20 }}>
                                <Input onChangeText={(text)=>this.setState({firstname: text})}inlineLabel label="First Name" placeholder="" />
                            </InputGroup>
                        </ListItem>
                        <ListItem>
                            <InputGroup style={{ alignSelf: 'center', marginTop: 40, marginBottom: 10 }}>
                                <Input onChangeText={(text)=>this.setState({lastname: text})} inlineLabel label="Last Name" placeholder="" />
                            </InputGroup>
                        </ListItem>
                        <ListItem>
                            <InputGroup style={{ alignSelf: 'center', marginTop: 20, marginBottom: 10 }}>
                                <Icon name="ios-person" style={{ color: '#0A69FE' }} />
                                <Input onChangeText={(text)=>this.setState({email: text})} placeholder="EMAIL" />
                            </InputGroup>
                        </ListItem>
                        <ListItem>
                            <InputGroup style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }}>
                                <Icon name="ios-unlock" style={{ color: '#0A69FE' }} />
                                <Input onChangeText={(text)=>this.setState({password:text})} placeholder="PASSWORD" secureTextEntry />
                            </InputGroup>
                        </ListItem>
                    </List>
                    <Button  disabled={this.buttonIsDisabled()} style={{ alignSelf: 'center', marginTop: 5, marginBottom: 10 }} onPress={this.submitSignup}>
                        Sign Up
                    </Button>
                   </ScrollView>
              </Content>
            );   
        
    }
            
}