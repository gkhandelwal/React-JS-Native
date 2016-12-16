import React, { Component } from 'react';
import {AsyncStorage,ToastAndroid, StyleSheet, ToolbarAndroid,TouchableHighlight, View, ScrollView, Alert,Image} from 'react-native';
import { Container,Header,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button, Card,CardItem, Fab } from 'native-base';

import Prompt from 'react-native-prompt';
const USER_REFERENCE = 'email';

export default class PersonalInfo extends Component {
        constructor(props) {
        super(props);
        this.state = {
            fname:'',
            email:'',
            allergys:[],
            allergyName:'',
            promptVisible:false,
            promptDeleteVisible:false
            }
        this.addNewAllergy=this.addNewAllergy.bind(this);
        this.removeAllergy=this.removeAllergy.bind(this);
        this.updateAllergyName=this.updateAllergyName.bind(this);
        this.getEmail=this.getEmail.bind(this);
        this.addNewAllergyAlert=this.addNewAllergyAlert.bind(this);
        this.removeAllergyPrompt = this.removeAllergyPrompt.bind(this);
        };


async getEmail() {
    var self=this;
   try {
     let email = await AsyncStorage.getItem(USER_REFERENCE);
     console.log("Inside Getemail",email)
     if(!email) {
         console.log("Error");
     } else {
         console.log("Success",email);
         self.setState({email: email})
         var url= 'https://allergywatch.herokuapp.com/allergy/'+ this.state.email
          fetch(url,{method: "GET"})
           .then((response) => response.json())
           .then((responseData) => {
            alrgys =[];
            for(var i=0; i<responseData.allergy.length; i++){
            if(i<(responseData.allergy.length-1))
            alrgys.push(responseData.allergy[i].allergyName);
            else
            alrgys.push(responseData.allergy[i].allergyName);
            }
           console.log(responseData);

           self.setState({
            fname:responseData.firstName,
            allergys:alrgys
           })})

          .catch((error) => {
            console.error(error);
          })
        .done;
     }
   } catch(error) {
       console.log("Something went wrong");
   }
 }

updateAllergyName(){
 console.log("Before", this.state.allergyName);
 this.setState({allergyName:''});
 console.log("After", this.state.allergyName);

var self=this;
console.log("Logging the API")
var url= 'https://allergywatch.herokuapp.com/allergy/'+ this.state.email
fetch(url,{method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {

         alrgys =[];
         for(var i=0; i<responseData.allergy.length; i++){
            if(i<(responseData.allergy.length-1))
            alrgys.push(responseData.allergy[i].allergyName);
            else
            alrgys.push(responseData.allergy[i].allergyName);
            }
           console.log(responseData);

           self.setState({
            allergys:alrgys
           })})

          .catch((error) => {
            console.error(error);
          })
        .done;

}

componentWillMount(){
    this.getEmail();

}

  addNewAllergyAlert()
  {
    this.setState({promptVisible: true})
  }

  addNewAllergy(value){
     var url='https://allergywatch.herokuapp.com/allergy/'

     fetch(url, {method: 'PUT',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      },
     body: JSON.stringify({
      email:this.state.email,
      allergyName:value['value'],
      ingredient: value['value']})})
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        console.log(responseJson.message)
         if(responseJson.message=='success'){
           this.updateAllergyName();
           ToastAndroid.showWithGravity("Allergy Added", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
           this.setState({ promptVisible: false});
        }})
    .catch((error) => {
        console.error(error);
      })
    .done;
   }
   removeAllergyPrompt()
   {
       this.setState({promptDeleteVisible: true})
   }

   removeAllergy(value){
    console.log("Allergy : " + value);
    var url='https://allergywatch.herokuapp.com/allergy/'
      fetch(url, {method: 'DELETE',
       headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       },
      body: JSON.stringify({
      email:this.state.email,
      allergyName:value})})
    .then((response) => response.json())
    .then((responseJson) => {
       console.log(responseJson);
       console.log(responseJson.message)
         if(responseJson.message=='success'){
           this.updateAllergyName();
           ToastAndroid.showWithGravity("Allergy Deleted", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
           this.setState({ promptDeleteVisible: false});
        }
        else {
          ToastAndroid.showWithGravity(responseJson.message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
          this.setState({ promptDeleteVisible: false});
        }
      })
    .catch((error) => {
        console.error(error);
        this.setState({ promptDeleteVisible: false});
      })
    .done;
  }

    render(){
        console.log("InsideRender" + this.state.promptVisible);
        var self = this;
        var colorCollection = ['#00c497','#07157B','#FFC300', '#FF5733', '#581845']
        var alertMessage = 'Are you sure you want to delete';

        return(
            <Image source={require('./images/3.jpg')} style={styles.container}>
            <Container>
           
              <Content Padder>
              <Card>
               <CardItem>
                  <Text>Full Name : {this.state.fname}</Text>
               </CardItem>
               <CardItem>
                  <Text>Email : {this.state.email}</Text>
               </CardItem>
             </Card>
             <ScrollView>
             <View style={{flexDirection:'row', flexWrap: 'wrap', alignItems: 'flex-start', margin: 10, flex:1 , padding:10, overflow: 'scroll', justifyContent: 'space-between'}}>
            {
              self.state.allergys.map(function(item, index){
                 return (
                     <Button key={item} onPress={() => Alert.alert('Delete Allergy',alertMessage,
                     [{text: 'NO', onPress: () => console.log('Cancel Pressed!')},
                      {text: 'YES', onPress: () => self.removeAllergy(item)},]
                    )} style={{padding:20, borderRadius:4,backgroundColor: colorCollection[index%5]}}>{item}</Button>
                 )
               }.bind(this))
             }
             </View>
             </ScrollView>
            <Prompt
                title="Add Allergy"
                placeholder="Start typing"
                defaultValue=""
                visible={self.state.promptVisible}
                onCancel={() => self.setState({ promptVisible: false})}
                onSubmit={(value) => {self.addNewAllergy({value})}}/>

            <Prompt
                    title="Remove Allergy"
                    placeholder="Start typing"
                    defaultValue=""
                    visible={self.state.promptDeleteVisible}
                    onCancel={() => self.setState({ promptDeleteVisible: false})}
                    onSubmit={(value) => {self.removeAllergy({value})}}/>
           </Content>
           <Fab
               active='true'
               direction="right"
               containerStyle={{ marginLeft: 10 }}
               position="bottomRight"
               style={{ backgroundColor: '#077B20' }}
               onPress={() => self.setState({ promptVisible: true})}
           >
            <Icon name="md-add-circle" />
           </Fab>
        </Container>
        </Image>
        );
     }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  toolbar: {
    backgroundColor: '#2a7d5e',
    height: 56,
  },
  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  container: {
    flex: 1,
    width: null,
    height: null
  },
});
