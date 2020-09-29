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
import Headers from '../../component/Headers'
import Modal from 'react-native-modalbox';




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

class Productsdetail extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            focus: false,
            first: '',
            last: '',
            batch: '',
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

    async cancelJob() {
        this.refs.modalComment.close()        
        var data = {}
        data.mapping_id = this.state.mapping_id?this.state.mapping_id.job_id:null
        var cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + 'mapping/canceljob', data)
        if (cancelJobresponse.data.status_code == 200) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.navigate('Dashboard')
        }
    }



    render() {
        const { selectedItems } = this.state

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers isHome={true} onBackHome={() => { this.refs.redirectHome.open() }} label={'Product Details'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: widthPercentageToDP('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 30, marginTop: widthPercentageToDP('5%') }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), }}>
                                <Text style={styles.products}>Sequence</Text>
                            </View>

                            <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                // marginLeft: widthPercentageToDP('5%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.first || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Scan a First Product'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        first: text
                                    })}></TextInput>
                            </View>

                            <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), }}>
                                <Text style={styles.products}>Product</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>

                            <TouchableOpacity style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('10%'),
                                // marginLeft: widthPercentageToDP('5%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                flexDirection: 'row',
                                borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }} onPress={this.toggleModal}>
                                <Text style={styles.selectproducts}>{this.state.products.name || "Select a Product"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />

                            </TouchableOpacity>

                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={styles.products}>Batch</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>

                            <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                // marginLeft: widthPercentageToDP('5%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.batch || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Select a Batch'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        batch: text
                                    })}></TextInput>
                            </View>


                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={styles.products}>MRP</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>

                            <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                // marginLeft: widthPercentageToDP('5%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                flexDirection: 'row',
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
                                <View style={{
                                    width: widthPercentageToDP('13%'),
                                    height: widthPercentageToDP('11%'), fontSize: 14, justifyContent: 'center', backgroundColor: '#BDBCBC', borderRadius: 5, shadowColor: '#F1F1F1', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, elevation: 2, shadowRadius: 1
                                }}>
                                    <Text style={{ justifyContent: 'center', alignSelf: 'center', color: '#000' }}>INR</Text>
                                </View>
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.mrp || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Enter Product MRP'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        mrp: text
                                    })}></TextInput>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Manufacturing Date</Text>
                                <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text>
                            </View>
                            <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                // marginLeft: widthPercentageToDP('5%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.manufacture || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={this.state.checked ? false : true}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Enter Manufacturing Date'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        manufacture: text
                                    })}></TextInput>
                            </View>


                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Expiry Date</Text>
                                <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text>
                            </View>
                            <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                // marginLeft: widthPercentageToDP('5%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.expiry || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    editable={this.state.checked ? false : true}
                                    placeholder={'Enter Epiry Date'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        expiry: text
                                    })}></TextInput>
                            </View>


                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Manufacturing Location</Text>
                                <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text>
                            </View>
                            <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                // marginLeft: widthPercentageToDP('5%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
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
                            </View>


                            <TouchableOpacity style={{
                                width: widthPercentageToDP('75%'),
                                height: widthPercentageToDP('13%'),
                                marginHorizontal: widthPercentageToDP('10%'),
                                marginTop: widthPercentageToDP('5%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#65CA8F',
                                borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                            }}
                                onPress={() => this.props.navigation.navigate('EditProduct')}
                            >
                                <Text style={styles.btntext}>{'Save & Complete'}</Text>
                            </TouchableOpacity>


                        </View>
                    </ScrollView>
                    <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"redirectHome"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                        <TouchableOpacity style={{ width: wp('10%'), height: hp('5%'), justifyContent: 'center', alignSelf: 'flex-end', alignItems: 'flex-end'}} onPress={() => { this.refs.redirectHome.close() }} >
                                    <SvgUri width="20" height="20" svgXmlData={svgImages.close} style={{ resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            <SvgUri width="55" height="55" svgXmlData={svgImages.checkmark} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: wp('4%') }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', padding: 5 }}>
                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#1D3567' }}>Confirmation</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', textAlign: 'center' }}>Do you want to go back without completing job ?</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', alignSelf: 'center', flex: 1, flexDirection: 'row', marginBottom: wp('2%') }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.refs.redirectHome.close()
                                        this.props.navigation.navigate('Dashboard')                                    
                                    }}
                                    style={{
                                        width: wp('26%'), height: wp('12%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: wp('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#6AC259',
                                    }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF', textAlign: 'center' }}>Save to in progress</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.cancelJob()}
                                    style={{
                                        width: wp('26%'), height: wp('12%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: wp('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                    }} >
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567', textAlign: 'center' }}>Cancel job</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
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

export default withNavigation(Productsdetail);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
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
        width: widthPercentageToDP('85%'),
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
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modal4: {
        maxHeight: 300,
        minHeight: 80
    },
    modal1: {
        maxHeight: 260,
        minHeight: 80
    }
});