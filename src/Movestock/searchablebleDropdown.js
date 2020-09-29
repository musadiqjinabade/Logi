import isArray from 'lodash';
import { Button, Container, Header, Icon, Input, Item, ListItem, Body } from 'native-base';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet,View, Text, TouchableOpacity, Alert, ScrollView, AsyncStorage, Keyboard } from "react-native";
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
        this.props.onSelect(item);
    }
    searchText(text) {
        this.setState({ searchInput: text }, () => {
            if (text !== '') {
                var searchResults = [];
                for (var d of this.arrayholder) {
                    if (d.itemName ? d.itemName.toLowerCase().includes(text.toLowerCase()) : d.document_number ? d.document_number.toLowerCase().includes(text.toLowerCase()) : d.location_name ? d.location_name.toLowerCase().includes(text.toLowerCase()) : null) {
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
        if (this.state.data) {
            return (
                this.props.isVisible ? (
                    <Modal isOpen={true} style={{ backgroundColor: 'yellow', flex: 1 }} backdrop={false} >
                        <Container style={{ backgroundColor: '#fdfdfd', flex: 1 }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#1D3567', '#1C6DAE']} >
                                <Header style={{ justifyContent: 'flex-start', flexDirection: 'row', backgroundColor: "transparent" }} transparent
                                    searchBar containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                    rounded>
                                    <Item>
                                        <Button transparent style={{ justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => { this.props.onCancel(); }}>
                                            <Icon name="ios-arrow-back" size={20} style={{ fontSize: 31, justifyContent: 'center', alignItems: 'center', color: '#1D3567' }} />
                                        </Button>
                                        <Input
                                            style={{ fontFamily: 'Montserrat-Regular', }}
                                            // autoFocus={true}
                                            value={this.state.searchInput}
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
    
                                    renderItem={({ item }) =>(
                                        <ListItem onPress={() => this.selectItem(item)}>
                                            <Body>
                                                <Text style={{ color: "#263C88", fontFamily: 'Montserrat-Regular', }}>{item.document_number || item.itemName || item.location_name || item.name|| item.document_name || item.itemName || "---"}</Text>
                                            </Body>
                                        </ListItem>
                                )}
                                />
                            </ScrollView>
                        </Container >
                    </Modal>
                ) : null
            );
        }
        else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> <ActivityIndicator /> </View>
            );
        }
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

