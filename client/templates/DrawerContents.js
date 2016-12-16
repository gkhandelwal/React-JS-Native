import React, { Component } from 'react';
import { Text,TouchableHighlight, View, Navigator, AsyncStorage, Image, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail,Button, Icon } from 'native-base';

const USER_REFERENCE = 'email';

export default class DrawerContents extends Component {
      constructor(props) {
      super(props);
      this.goHome = this.goHome.bind(this);
      this.goToFoo = this.goToFoo.bind(this);
      this.goHistory = this.goHistory.bind(this);
      this.goToPersonalInfo = this.goToPersonalInfo.bind(this);
      this.goToLogout = this.goToLogout.bind(this);
    }

    goHome() {
      // you can use different instead of push .. Information is provided on react-native page in navigation section
      this.props.navRef.replace({name: 'home'});
      this.props.setPageName('BarCodeScanner');
      this.props.drawerRef.closeDrawer();
    }

    goToFoo() {
      this.props.navRef.replace({name: 'foo'});
      this.props.drawerRef.closeDrawer();
    }

    goHistory(){
      this.props.navRef.replace({name: 'history'});
      this.props.setPageName('History');
      this.props.drawerRef.closeDrawer();

    }

    goToPersonalInfo(){
     this.props.navRef.replace({name: 'personalinfo'});
     this.props.setPageName('Personal Info');
     this.props.drawerRef.closeDrawer();
    }

    async goToLogout(){
        try {
        await AsyncStorage.removeItem(USER_REFERENCE);
        this.props.logoutCallBack();
        } catch(error) {
        console.log("Error");
    }
    }

    render() {
      return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Card style={{ flex: 0 }}>
          <CardItem>
          <Image source={require('./images/nav.jpg')}
                style={{width: 300, height: 200}} />
          </CardItem>
        </Card>
          <TouchableHighlight onPress={this.goHome} style={styles.container}>
            <View style={{flexDirection:'row'}}>
            <Icon name='md-home'  style={{color: 'green', flex:0.4, alignItems:'flex-end'}} />
            <Text style={{fontWeight: 'bold', fontSize: 20, flex:0.6}}>HOME</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.goToPersonalInfo} style={styles.container}>
            <View style={{flexDirection:'row'}}>
            <Icon name='ios-information-circle'  style={{color: 'red', flex:0.4, alignItems:'flex-end'}} />
            <Text style={{fontWeight: 'bold', fontSize: 20, flex:0.6}}>INFORMATION</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.goHistory} style={styles.container}>
            <View style={{flexDirection:'row'}}>
            <Icon name='md-archive'  style={{color: 'blue', flex:0.4, alignItems:'flex-end'}} />
            <Text style={{fontWeight: 'bold', fontSize: 20, flex:0.6}}>HISTORY</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.goToLogout} style={styles.container}>
            <View style={{flexDirection:'row'}}>
            <Icon name='md-log-out'  style={{color: 'red', flex:0.4, alignItems:'flex-end'}} />
            <Text style={{fontWeight: 'bold', fontSize: 20, flex:0.6}}>LOGOUT</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  },
});
