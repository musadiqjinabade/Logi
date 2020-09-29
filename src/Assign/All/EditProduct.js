import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, FlatList, StatusBar, TextInput, StyleSheet, Image, Animated, TouchableOpacity, Alert, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, Container, Right, Title, Toast, Header, CheckBox, Body, ListItem, Left, Row, Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from './searchablebleDropdown';
import svgImages from '../../Images/images';
import Headers from '../../component/Headers';




const mockData = [
    { id: 1, name: 'React Native Developer' }, // set default checked for render option item
    { id: 2, name: 'Android Developer' },
    { id: 3, name: 'iOS Developer' },
    { id: 4, name: 'React Native Developer' }, // set default checked for render option item
    { id: 5, name: 'Android Developer' },
    { id: 6, name: 'iOS Developer' },
    { id: 12, name: 'React Native Developer' }, // set default checked for render option item
    { id: 22, name: 'Android Developer' },
    { id: 32, name: 'iOS Developer' },
    { id: 142, name: 'React Native Developer' }, // set default checked for render option item
    { id: 23, name: 'Android Developer' },
    { id: 34, name: 'iOS Developer' }
];

class EditProduct extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            focus: false,
            username: '',
            Product: mockData,
            products: '',
            isVisible: true,
            checked: false,
            progressText: 'Loading...',
            expanded: true

        }

    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    searchText(text) {
        this.setState({ username: text }, () => {
            const newData = mockData.filter(item => {
                var itemData = item.name ? (item.name) : '----';
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            //   mockData = newData;
            this.setState({ Product: newData });
        });
    }

    renderModalContent = () => {
        if (this.state.isModalVisible) {
            return (
                <View style={styles.overlay}>
                    <ActivityIndicator color="#1D3567" size="large" />
                    <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#1D3567' }}>{this.state.progressText}</Text>
                </View>
            );
        }
        else {
            return null;
        }
    }



    render() {
        const { selectedItems } = this.state
        const fontSize = 11

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'Edit Product'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: widthPercentageToDP('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 30, marginTop: widthPercentageToDP('5%') }}>
                            <TouchableOpacity style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('10%'),
                                // marginLeft: widthPercentageToDP('5%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                flexDirection: 'row',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
                                <SvgUri width="15" height="15" svgXmlData={svgImages.search} style={{
                                    padding: widthPercentageToDP('3%'),
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }} />
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.manufactureloc || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    editable={this.state.checked ? false : true}
                                    placeholder={'Enter Manufacturing Location'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        manufactureloc: text
                                    })}></TextInput>
                            </TouchableOpacity>

                            <View style={{
                                flex: 1, shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                borderRadius: 5,
                                // marginLeft: widthPercentageToDP('4%'),
                                // marginRight: widthPercentageToDP('4%'),
                                marginBottom: widthPercentageToDP('4%'),
                                width: widthPercentageToDP('94%'),
                                padding: widthPercentageToDP('2%'),
                                flexDirection: 'column',
                                elevation: 4,
                                backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                            }}>


                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                                    <View style={{
                                        flexDirection: 'row', flex: 1, marginTop: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('2%'),
                                        shadowOpacity: 0.8, justifyContent: 'flex-start', alignItems: 'flex-start',
                                    }}>
                                        <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>Total Scan:</Text>
                                        <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>16</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center',
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Scanproduct', { item: false })}
                                            style={{
                                                flexDirection: 'row', width: widthPercentageToDP('35%'), height: widthPercentageToDP('8%'), paddingRight: widthPercentageToDP('2%'),
                                                //  width: widthPercentageToDP('30%'), height: widthPercentageToDP('5%'), 
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.8,
                                                padding: widthPercentageToDP('2%'),
                                                shadowColor: '#CECECE',
                                                shadowRadius: 3,
                                                borderRadius: 34,
                                                elevation: 4,
                                                backgroundColor: '#FE3547', justifyContent: 'flex-end', alignItems: 'center',
                                            }}>
                                            <SvgUri width="15" height="15" fill={"#FFFFFF"} svgXmlData={svgImages.photo_camera} style={{ marginHorizontal: widthPercentageToDP('1%'), resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }} />
                                            <Text style={{ margin: widthPercentageToDP("1%"), fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center', color: '#FFFFFF' }}>Delete by Scan</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <View style={{ width: widthPercentageToDP('86%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%') }} />


                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <View style={{ flex: 1, justifyContent: 'flex-start', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), flexDirection: 'column' }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>J0002</Text>
                                    </View>
                                    <View style={{ width: widthPercentageToDP('29%'), height: widthPercentageToDP('5%'), marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#F3DDB6' }}>
                                        <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>In-progress</Text>
                                    </View>

                                </View>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                                }}>
                                    <Text style={{ justifyContent: 'flex-start', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), alignItems: 'flex-start', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>{'Type: Assignment & Mapping'}</Text>
                                </View>
                                <View style={{ width: widthPercentageToDP('86%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%') }} />
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <View style={{ flex: 1, justifyContent: 'flex-start', margin: widthPercentageToDP('2%'), flexDirection: 'row' }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>Created Date:</Text>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize, marginLeft: widthPercentageToDP('1%') }}>{'24 Jul 2019'}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', margin: widthPercentageToDP('2%'), flexDirection: 'row' }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>Created by:</Text>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize, marginLeft: widthPercentageToDP('1%') }}>{'test@test.com'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flex: 1, shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                borderRadius: 5,
                                // marginLeft: widthPercentageToDP('4%'),
                                // marginRight: widthPercentageToDP('4%'),
                                marginBottom: widthPercentageToDP('4%'),
                                width: widthPercentageToDP('94%'),
                                padding: widthPercentageToDP('2%'),
                                flexDirection: 'column',
                                elevation: 4,
                                backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                            }}>

                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#FFFFFF',
                                }} >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Productsdetail')}
                                        style={{
                                            flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            height: widthPercentageToDP('8%'),
                                            shadowColor: '#CECECE', backgroundColor: '#33B4E4',
                                            shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                        }} >
                                        <Text style={{ fontFamily: 'Montserrat-Bold', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>Truck ID:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>PP1023457347</Text>

                                        {/* </View> */}
                                    </TouchableOpacity>


                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('6%'),
                                }} >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Productsdetail')} style={{
                                            flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            height: widthPercentageToDP('8%'),
                                            shadowColor: '#CECECE', backgroundColor: '#FEBA33',
                                            shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                        }}>
                                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>Pallet ID:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>PP1023457347</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('10%'),
                                }} >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Productsdetail')} style={{
                                            flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            height: widthPercentageToDP('8%'),
                                            shadowColor: '#CECECE', backgroundColor: '#00C551',
                                            shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                        }}>
                                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>Shipper ID:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>PP1023457347</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                                }} >
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                                    </View>

                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                                }} >
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                                    </View>

                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                                }} >
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                                    </View>

                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('10%'),
                                }} >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Productsdetail')} style={{
                                            flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            height: widthPercentageToDP('8%'),
                                            shadowColor: '#CECECE', backgroundColor: '#00C551',
                                            shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                        }}>
                                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>Shipper ID:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>PP1023457347</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                                }} >
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                                }} >
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                                    </View>

                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                                }} >
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                                    </View>

                                </View>

                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('6%'),
                                }} >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Productsdetail')} style={{
                                            flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            height: widthPercentageToDP('8%'),
                                            shadowColor: '#CECECE', backgroundColor: '#FEBA33',
                                            shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                        }}>
                                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>Pallet ID:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>PP1023457347</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('10%'),
                                }} >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Productsdetail')} style={{
                                            flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            height: widthPercentageToDP('8%'),
                                            shadowColor: '#CECECE', backgroundColor: '#00C551',
                                            shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                        }}>
                                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>Shipper ID:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>PP1023457347</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                                }} >
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                                    </View>

                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                                }} >
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                                    </View>

                                </View>
                                <View style={{
                                    flex: 1, flexDirection: 'row',
                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                                }} >
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                                    </View>

                                </View>

                            </View>



                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: widthPercentageToDP('2%') }}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Scanproduct')}
                                    style={{
                                        flex: 1,
                                        height: widthPercentageToDP('12%'),
                                        // marginRight: widthPercentageToDP('7%'),
                                        // marginHorizontal: widthPercentageToDP('7%'),
                                        marginBottom: widthPercentageToDP('2%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#65CA8F',
                                        borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                    }}>
                                    <Text style={styles.btntext}>{'Save'}</Text>
                                </TouchableOpacity></View>

                        </View>

                    </ScrollView>
                    {this.renderModalContent()}
                </View>

                {this.state.Product.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Products'}
                        data={this.state.Product}
                        onSelect={(selectedItem) => {
                            this.setState({ products: selectedItem, isModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisible: false }) }}
                        isVisible={this.state.isModalVisible === true} />) : null}
            </Container>

        )

    }
}

export default withNavigation(EditProduct);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
    },
    products: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    productsdisable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: '#C0BCBC'
    },
    selectproducts: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: widthPercentageToDP('2%'),
        color: '#636363'

    },
    selectproductsdiable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: widthPercentageToDP('2%'),
        color: '#636363'

    },
    searchstyle: {
        paddingLeft: 6,
        flexDirection: 'row',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        alignSelf: 'center',
        width: widthPercentageToDP('75%'),
        height: 48,
        color: '#000000',
        fontSize: 14,
        paddingTop: 0,
        paddingBottom: 0,
    },
    batchstyle: {
        paddingLeft: 6,
        flexDirection: 'row',
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: widthPercentageToDP('80%'),
        height: widthPercentageToDP('11%'),
        color: '#000000',
        fontSize: 14,
    },
    btntext: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    }
});