import { Button, Container, Header, Icon, Input, Item, ListItem, Body } from 'native-base';
import React, { Component } from 'react';
import {  ActivityIndicator,FlatList, StatusBar, StyleSheet, Text,View, ScrollView, ToastAndroid } from "react-native";
import Modal from 'react-native-modalbox';
import LinearGradient from 'react-native-linear-gradient';
import APIService from '../../component/APIServices';


// var jwtDecode = require('jwt-decode');

export default class VendorDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            value: '',
            searchInput: '',
            data: this.props.data,
            filteredData: '',
            page_count:0
        };
        this.arrayholder = [];
    }

    async componentDidMount(){
        this.setState({loading:false},async()=>{
            var response = await APIService.execute('GET', APIService.URLBACKEND + 'rowmaterial/getvendorlist?page_no=0&page_count=10&sort_on=created_at&sort_by=desc', null)
            console.log("response:",response)
            if(response.data.status==200){
                if(response.data.data.length > 0) {
                    this.arrayholder=response.data.data
                    this.setState({data:response.data.data,loading:false})
                }
                else{
                    this.setState({loading:false})
                    ToastAndroid.show('No Vendor found. Please contact the administrator', ToastAndroid.LONG, 25, 50);
                    this.props.onSelect('');


                }
            }
            else{
                this.setState({loading:false})
            }

        })
        
    }

    async loadMoreJobs(){
        this.setState({page_count:this.state.page_count+1,loading:true},async()=>{
            var response = await APIService.execute('GET', APIService.URLBACKEND + 'rowmaterial/getvendorlist?page_no='+ this.state.page_count+'&page_count=10&sort_on=created_at&sort_by=desc', null)
            console.log("response:",response)
            if(response.data.status==200){
                if(response.data.data > 0) {
                    for (var i = 0; i < response.data.datalength; i++) {
                        this.state.data.push(response.data.data[i])
                        this.arrayholder.push(response.data.data[i])

                    }
                    this.setState({
                        loading: false
                    })
                }
                else{
                    this.setState({loading:false})

                    ToastAndroid.show('All Vendor Loaded', ToastAndroid.LONG, 25, 50);

                }
            }
            else{
                this.setState({loading:false})
            }

        })

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
                    if (d.recipient_name ? d.recipient_name.toLowerCase().includes(text.toLowerCase()) : d.recipient_name.toLowerCase().includes(text.toLowerCase())) {
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
        if(this.state.data){
            return (
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
                                    onEndReached={({ distanceFromEnd }) => {
                                        this.loadMoreJobs();
                                    }}
                                    // onEndThreshold={20}

                                    renderItem={({ item }) => (
                                        <ListItem onPress={() => this.selectItem(item)}>
                                            <Body>
                                                <Text style={{ color: "#263C88", fontFamily: 'Montserrat-Regular', }}>{item.recipient_name || '---'}</Text>
                                            </Body>
                                        </ListItem>
                                    )}
                                    keyExtractor={item => item.recipient_id}
                                />
                            {this.state.loading?<View style={{flex:1, justifyContent:'center', alignSelf:'center'}}><ActivityIndicator/></View>:null}

                            </ScrollView>
                        </Container >
                    </Modal>
            
            );
        }
        else{
            ToastAndroid.show("Loading...", ToastAndroid.LONG, 25, 50);
            return null
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

