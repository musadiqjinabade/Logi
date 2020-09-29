import { Button, Container, Header, Icon, Input, Item, ListItem, Body } from 'native-base';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text,View, ScrollView } from "react-native";
import Modal from 'react-native-modalbox';
import LinearGradient from 'react-native-linear-gradient';

// var jwtDecode = require('jwt-decode');

export default class searchableDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            value: '',
            searchInput: '',
            data: this.props.data,
            filteredData: '',
        };
        this.arrayholder = [];
    }

    selectItem(item) {
        // Keyboard.dismiss(); 
        this.props.onSelect(item);
    }
    searchText(text) {
        this.setState({ searchInput: text }, () => {
            if (text !== '') {
                var searchResults = [];
                for (var d of this.arrayholder) {
                    if (d.itemName ? d.itemName.toLowerCase().includes(text.toLowerCase()) : d.name.toLowerCase().includes(text.toLowerCase())) {
                        searchResults.push(d);
                    }
                }
                this.setState({
                    data: searchResults,
                    searchInput: text
                })
            }
            else {
                this.setState({ data: this.arrayholder, searchInput: text })
            }
        });
    }

    load() { this.setState({ loading: false }) }

    render() {
        this.arrayholder = this.props.data;
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> <ActivityIndicator /> </View>
            );
        }
        return (
            this.props.isVisible ? (
                <Modal isOpen={true} style={{ backgroundColor: 'yellow', flex: 1 }} backdrop={false} >
                    <Container style={{ backgroundColor: '#fdfdfd', flex: 1 }} keyboardShouldPersistTaps='handled'>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#1D3567', '#1C6DAE']} >
                            <Header style={{ justifyContent: 'flex-start', flexDirection: 'row', backgroundColor: "transparent" }} transparent
                                searchBar containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                rounded>
                                <Item>
                                    <Button transparent style={{ justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => { this.props.onCancel(); }}>
                                        <Icon name="ios-arrow-back" size={20} style={{ fontSize: 31, justifyContent: 'center', alignItems: 'center', color: '#1D3567' }} />
                                    </Button>
                                    <Input
                                        autoFocus={false}
                                        value={this.state.searchInput}
                                        keyboardType='default'
                                        style={{ fontFamily: 'Montserrat-Regular', }}
                                        // onFocus={() => this.setState({ focus: true })}
                                        placeholder='Search'
                                        clearIcon
                                        onChangeText={(text) => this.searchText(text)}
                                    />
                                </Item>
                            </Header>
                        </LinearGradient>
                        <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                        <ScrollView style={{ paddingBottom: 20 }} keyboardShouldPersistTaps='handled' >
                            <FlatList
                                style={{ marginHorizontal: 10 }}
                                data={this.state.data}

                                renderItem={({ item }) => (
                                    <ListItem onPress={() => this.selectItem(item)}>
                                        <Body>
                                            <Text style={{ color: "#263C88", fontFamily: 'Montserrat-Regular', }}>{item.itemName || item.name}</Text>
                                        </Body>
                                    </ListItem>
                                )}
                                keyExtractor={item => item.id}
                            />
                        </ScrollView>
                    </Container >
                </Modal>
            ) : null
        );
    }
}

const styles = StyleSheet.create({

    item: {
        padding: 10,
        marginHorizontal: 20,
        fontSize: 18,
        height: 44,
    },
})

