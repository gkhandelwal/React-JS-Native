import React, { Component } from 'react';
import {AsyncStorage, ToastAndroid,ScrollView} from 'react-native';
import { Container,Header,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
import Signup from '../templates/Signup';

const USER_REFERENCE = 'email';

export default class Login extends Component {

        constructor(props) {
        super(props);
        this.state = {
            email:'',
            password:''
            }
        this.submitLogin=this.submitLogin.bind(this);
        this.setEmail=this.setEmail.bind(this);
        this.buttonIsDisabled=this.buttonIsDisabled.bind(this);
        };

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
  if ((this.state.email && this.state.email.trim()) && (this.state.password && this.state.password.trim())){
  return false
  }else{
  return true
  }
}


submitLogin(){
 var self = this;
 var url= 'https://allergywatch.herokuapp.com/login/' + this.state.email +'/'+this.state.password
 fetch(url,{method: "GET"})
      .then((response) => response.json())
      .then((responseJson) => {
       console.log("Json", responseJson);
       console.log("Message" ,responseJson.message)
       if(responseJson.message=='success'){
        console.log("LoginSuccess");
        this.setEmail();
       }
       else{
            ToastAndroid.showWithGravity(responseJson.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
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
                    <List >
                        <ListItem>
                            <InputGroup style={{ alignSelf: 'center', marginTop: 20, marginBottom: 10 }}>
                                <Icon name="ios-person" style={{ color: '#0A69FE' }} />
                                <Input  onChangeText={(val)=>this.setState({email: val})} placeholder="EMAIL" />
                            </InputGroup>
                        </ListItem>
                        <ListItem>
                            <InputGroup style={{ alignSelf: 'center', marginTop: 20, marginBottom: 10 }}>
                                <Icon name="ios-unlock" style={{ color: '#0A69FE' }} />
                                <Input onChangeText={(val)=>this.setState({password: val})} placeholder="PASSWORD" secureTextEntry />
                            </InputGroup>
                        </ListItem>
                    </List>
                    <Button rounded disabled={this.buttonIsDisabled()} style={{ width:200, alignSelf: 'center', marginTop: 20, marginBottom: 5 }} onPress={this.submitLogin}>
                        Login
                    </Button>
                 </ScrollView>
              </Content>
            );

    }

}
