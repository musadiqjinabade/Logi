import React, { Component } from 'react';
import { Text, View, StatusBar, TextInput, StyleSheet, TouchableOpacity, BackHandler,Dimensions, Platform ,ToastAndroid, ActivityIndicator} from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color'
import APIService from '../component/APIServices';
import SearchableDropdown from '../Assign/All/searchablebleDropdown';
import Searchable from '../Movestock/searchablebleDropdown';
import AsyncStorage from '@react-native-community/async-storage';

var decoded = {}

var jwtDecode = require('jwt-decode');

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});
class IssueRawMaterial extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            work_order:'',
            work_order_no:'',
            Show_focus:false,
            documentTypeList: '',
            isModalVisible:false,
            loading:true,
            isModalVisibleDocnum:false,
            WorkOrderNo:'',
            selectedDocumentTypeId:'',
            progressText:'loading...'

        }

    }

    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', async() => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
             this.getDocumentTypeList() 
             var loginData = await AsyncStorage.getItem('loginData');

            if (loginData) {
                loginData = JSON.parse(loginData);
            }
            console.log('loginData ', loginData.token);
            decoded = jwtDecode(loginData.token);
            console.log('decoded:', decoded)
        })
    }

    handleBackPress() {
        this.navigateBack();
        return true;
    }

    async navigateBack() {
        this.props.navigation.dispatch(resetAction)
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    onChangeText(text){
        if(text!=''){
            this.setState({Show_focus:true,work_order:text})
        }
        else{
            this.setState({Show_focus:false,work_order:text})
        }
    }

    onChangeWork_noText(text){
        this.setState({work_order_no:text})
    }

    async getDocumentTypeList() {
        var response = await APIService.execute('GET', APIService.URLBACKEND +  APIService.settinggetdocumenttypelist+'job_type=Issue RM', null)
        console.log("response : ", response)
        if (response.data.status_code === 200) {
            var temp = {}
            temp.id = 0
            temp.itemName = "Add Manually"
            var tempArr = response.data.data
            tempArr.push(temp)
            this.setState({ loading: false, documentTypeList: tempArr },()=>{
                console.log('temp:',tempArr,"data:",this.state.documentTypeList)
            })
        }
        else{
            this.setState({loading:false})
        }
    }

    toggleModalDocnum = () => {
        this.setState({ isModalVisibleDocnum: !this.state.isModalVisibleDocnum },async()=>{
            const body={}
            body.document_type = this.state.work_order?this.state.work_order:null
            body.company_id = decoded.company_id || null
            // body.document_type = 'invoice'
            // body.company_id = 120

            var response = await APIService.execute('POST', APIService.URL_ERP + APIService.documentgetdocumentbytype, body)
            console.log('response:', response)
            if (response.success) {
                this.setState({ Workorderno: response.data.data , },()=>{
                    console.log('this.Document', this.state.Workorderno)
                })
            }
        });
    };

    renderModalContent = () => {
        if (this.state.isModalVisibleDoctype || this.state.isModalVisibleDocnum) {
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

    async continue(){
        console.log("working continue  button")
        if(this.state.Show_focus){
            if(this.state.work_order){
                if(this.state.work_order_no || this.state.WorkOrderNo && this.state.WorkOrderNo.document_number){
                    this.props.navigation.navigate('IssueRawMaterialShowDetail',{ERP_status:this.state.Show_focus,work_order:this.state.work_order,work_order_no:this.state.work_order_no || this.state.WorkOrderNo && this.state.WorkOrderNo.document_number, selectedDocumentTypeId:this.state.selectedDocumentTypeId})
                }
                else{
                    ToastAndroid.show("Please Enter Work Order no", ToastAndroid.LONG, 25, 50);
                }
            }
            else{
                ToastAndroid.show("Please Select Work Order", ToastAndroid.LONG, 25, 50);
            }
        }else{
            ToastAndroid.show("Select Work Order", ToastAndroid.LONG, 25, 50);
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Headers isHome={false} label={'Issue Raw Material'} onBack={() => {this.props.navigation.goBack() || this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <View style={{ marginTop: hp('3%') }}>
                        <ActivityIndicator size={'large'} color='#1D3567' />
                    </View>
                </View>
            )
        }
        else {
            console.log("WorkOrderNo",this.state.WorkOrderNo)
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Headers isHome={false} label={'Issue Raw Material'} onBack={() => { this.props.navigation.goBack() ||  this.props.navigation.dispatch(resetAction)  }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'column', padding: wp('2%') }}>
                        <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                            <Text style={styles.productsdisable}>Work Order</Text>
                            <Text style={{ color: 'red' }}>*</Text>
                        </View>
                        <TouchableOpacity style={styles.selectBackgroundStyle} onPress={() => {  this.state.documentTypeList.length > 0 ? this.setState({ isModalVisible: !this.state.isModalVisible }) : ToastAndroid.show("No Document type list available", ToastAndroid.LONG, 25, 50); }}>
                            <Text style={styles.selectproducts}>{this.state.work_order ||"Select work order"}</Text>
                            <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                        </TouchableOpacity>
                        {this.state.work_order && this.state.work_order=='Add Manually'?
                        <View>
                        <View style={{ marginTop: hp('1%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                            <Text style={styles.productsdisable}>Work Order No.</Text>
                            <Text style={{ color: 'red' }}>*</Text>
                        </View>
                        <View style={styles.selectBackgroundStyle}>
                            <TextInput
                                numberOfLines={1}
                                underlineColorAndroid='transparent'
                                style={styles.textInputStyle}
                                value={this.state.work_order_no}
                                keyboardType='default'
                                placeholderTextColor='#636363'
                                onChangeText={(text) => this.onChangeWork_noText(text)}
                                placeholder={'Enter order number'}></TextInput>
                        </View></View>:this.state.work_order?
                            <View>
                            <View style={{ marginTop: hp('1%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.productsdisable}>Work Order No.</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>
                        
                            <TouchableOpacity style={{
                                width: wp('94%'),
                                height: wp('10%'),
                                // marginLeft: wp('5%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                flexDirection: 'row',
                                borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }} 
                            onPress={this.toggleModalDocnum}   >
                                <Text style={styles.selectproducts}>{this.state.WorkOrderNo? this.state.WorkOrderNo.document_number : "Select a Work Order No"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                            </TouchableOpacity></View>:null}
                        
                    </View>
                </ScrollView>
                <View style={{
                    flex: 1, position: 'absolute',
                    bottom: 0,
                }}>
                    <TouchableOpacity onPress={ () =>  this.continue() }>
                        <LinearGradient
                            colors={[color.gradientStartColor, color.gradientEndColor]}
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                            style={[styles.center, {
                                marginTop: hp('1%'),
                                width: wp('100.1%'),
                                height: hp('8%'),
                                borderTopLeftRadius: wp('2.5%'),
                                borderTopRightRadius: wp('2.5%'),
                            }]}>

                            <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={styles.buttonStart}>Continue</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {this.state.documentTypeList && this.state.documentTypeList.length > 0 ? (
                        <SearchableDropdown
                            title={'Select Document'}
                            data={this.state.documentTypeList}
                            onSelect={(selectedItem) => {
                                this.setState({ work_order: selectedItem.itemName, selectedDocumentTypeId: selectedItem.id, isModalVisible: false }, () => {
                                    console.log("id : ", this.state.selectedDocumentTypeId)
                                        this.setState({Show_focus:true})
                                })
                            }}
                            onCancel={() => { this.setState({ isModalVisible: false }) }}
                            isVisible={this.state.isModalVisible === true} />) : null}
                {this.state.Workorderno && this.state.Workorderno.length > 0 ? (
                        <Searchable
                            title={'Select Document'}
                            data={this.state.Workorderno}
                            onSelect={(selectedItem) => {
                                this.setState({ WorkOrderNo: selectedItem, isModalVisibleDocnum: false }, () => {
                                    console.log("id : ", this.state.selectedDocumentTypeId)
                                        this.setState({Show_focus:true})
                                })
                            }}
                            onCancel={() => { this.setState({ isModalVisibleDocnum: false }) }}
                            isVisible={this.state.isModalVisibleDocnum === true} />) : null}
            </View>
        )
    }
    }
}

export default withNavigation(IssueRawMaterial);

var styles = StyleSheet.create({
    items: {
        flex: 1,
        marginTop: hp('0.5%'),
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        color: color.gradientStartColor
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
    headerBold: {
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        color: '#000000'
    },
    textInputStyle: {
        width: wp('92%'),
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: color.gradientStartColor
    },
    textInputWorkOrder: {
        width: wp('62%'),
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: color.gradientStartColor
    },
    line: {
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        borderBottomColor: '#828EA5',
        borderBottomWidth: 0.7,
    },
    linearGradient: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
    },
    selectproducts: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    buttonStart: {
        fontSize: hp('2.5%'),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    productsdisable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectBackgroundStyle: {
        width: wp('94%'),
        height: wp('11%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
    }
});