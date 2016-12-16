import React, { Component } from 'react';
import { Text,TouchableHighlight, View, Navigator } from 'react-native';
import { Container,Header,Title, Content, List, ListItem, InputGroup, Input, Icon,Picker, Button } from 'native-base';

export default class AddAllergy extends Component {
    
        constructor(props) {
        super(props);
        this.state = {
        count:1            
        };
     this.increaseAddCount = this.increaseAddCount.bind(this);            
    }     
    
increaseAddCount(){
    if(this.state.count>=5){
        alert('Maximum 5 Allergies can be added at a time');  
    }else{
    var newct = this.state.count + 1;
    this.setState({count : newct}); 
    console.log(this.state.count);          
    }     
}
    
render(){
    var alergyAdds=[];    
    for(var i=1;i<=this.state.count;i++){
    var allergy = "Allergy "+ i;
    alergyAdds.push(<ListItem key={i}>
                        <InputGroup>
                        <Input inlineLabel label={allergy}/>
                        </InputGroup>
                    </ListItem>);
    }
    return (
            <Container>
                <Header>
                    <Title>Add Allergies</Title>
                    <Button transparent onPress={this.increaseAddCount.bind(this)}>
                    <Icon name="ios-add" />
                    </Button>
                </Header>    
                <Content>
                    <List>
                    {alergyAdds}
                    </List>   
                <Button style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }}>Add</Button>    
                </Content>
                        
            </Container>
            );   
        
    }
}