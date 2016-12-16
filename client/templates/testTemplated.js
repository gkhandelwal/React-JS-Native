import React, { Component } from 'react';
import { Container, Content, Button, Icon, Fab } from 'native-base';
export default class testTemplated extends Component {
    render() {
        return (
            <Container>
                <Content>
                    <Fab
                        active='true'
                        direction="right"
                        containerStyle={{ marginLeft: 10 }}
                        style={{ backgroundColor: '#5067FF' }}
                        position="topLeft"
                    >
                        <Icon name="md-share" />
                        <Button style={{ backgroundColor: '#34A34F' }}>
                            <Icon name="logo-whatsapp" />
                        </Button>
                        <Button style={{ backgroundColor: '#3B5998' }}>
                            <Icon name="logo-facebook" />
                        </Button>
                        <Button disabled style={{ backgroundColor: '#DD5144' }}>
                            <Icon name="ios-mail" />
                        </Button>
                    </Fab>
                </Content>
            </Container>
        );
    }
}
