import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, BackHandler, FlatList, AsyncStorage, ToastAndroid, ActivityIndicator } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color'
import APIService from '../component/APIServices';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'IssueRawMaterial' })],
});
class IssueRawMaterialShowDetail extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            ERP_status: false,
            work_order: '',
            work_order_no: '',
            RawMaterialDetails: '',
            SelectedRM: '',
            locationId: '',
            locationName: '',
            RM_ids: '',
            loading: false,
            selectedDocumentTypeId: ''
        }

    }

    async componentDidMount() {

        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });

        this.setState({ ERP_status: this.props.navigation.state.params.ERP_status ? 0 : 1, work_order: this.props.navigation.state.params.work_order, work_order_no: this.props.navigation.state.params.work_order_no, selectedDocumentTypeId: this.props.navigation.state.params.selectedDocumentTypeId }, () => {
            console.log("work order", this.state.work_order, 'selectedDocumentTypeId', this.state.selectedDocumentTypeId)
        })
        this.focusListener = this.props.navigation.addListener('didFocus', async () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            this.setState({ mapping_id: this.props.navigation.state.params.item }, async () => {
                var RawMaterildata = await AsyncStorage.getItem('RawMaterildata')
                console.log("tag:", RawMaterildata);
                var myArray = []
                if (RawMaterildata != null) {
                    myArray = JSON.parse(RawMaterildata)
                }
                this.setState({ RawMaterialDetails: myArray }, () => {
                    console.log('length:', this.state.RawMaterialDetails.length)
                })
                var SelectedRM = await AsyncStorage.getItem('RawMaterilSelected')
                var SelectedArray = []
                if (SelectedRM != null) {
                    SelectedArray = JSON.parse(SelectedRM)
                }
                this.setState({ SelectedRM: SelectedArray }, () => {
                    console.log('RawMaterilSelected:', this.state.SelectedRM)
                })

            })

        });
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

    async getRawmaterialList() {
        console.log("working continue  button")

        this.props.navigation.navigate('RawMaterialList', { item: this.state.SelectedRM })
    }
    Remove(item) {
        var array = [...this.state.SelectedRM];
        var index = array.indexOf(item)
        if (index !== -1) {
            array.splice(index, 1);
            console.log("array:", array);
            this.array = array;
            this.setState({ SelectedRM: array }, async () => {
                console.log("SelectedRM:", this.state.SelectedRM, this.state.RawMaterialDetails);
                var tag_data = [];
                for (let i = 0; i < this.state.SelectedRM.length; i++) {
                    for (let j = 0; j < this.state.RawMaterialDetails.length; j++) {
                        if (this.state.RawMaterialDetails[j].rm_name == this.state.SelectedRM[i]) {
                            //push data
                            tag_data.push(this.state.RawMaterialDetails[i])

                        }
                    }
                }
                this.setState({ RawMaterialDetails: tag_data })
                await AsyncStorage.removeItem('RawMaterildata');
                await AsyncStorage.removeItem('RawMaterilSelected');
                AsyncStorage.setItem('RawMaterildata', JSON.stringify(tag_data))
                AsyncStorage.setItem('RawMaterilSelected', JSON.stringify(this.state.SelectedRM))

            });
        }
    }

    async startJob() {
        console.log('selectedDocumentTypeId', this.state.selectedDocumentTypeId)
        this.setState({ loading: true })
        var RM_ids = []
        for (let i = 0; i < this.state.RawMaterialDetails.length; i++) {
            RM_ids.push(this.state.RawMaterialDetails[i].rm_id)
        }
        if (this.state.SelectedRM && RM_ids.length > 0 ? true : false) {
            var body = {}
            body.location_id = this.state.locationId || null
            body.issuerm_details = RM_ids
            body.document_type = this.state.work_order ? this.state.selectedDocumentTypeId : 0
            body.workorder_no = this.state.work_order_no
            var start_data = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/startissuermjob', body)
            console.log("start_data", start_data)
            if (start_data.data.status == 200) {
                this.setState({ loading: false })
                ToastAndroid.show(start_data.data.data.message, ToastAndroid.LONG, 25, 50);
                await AsyncStorage.removeItem('RawMaterildata');
                await AsyncStorage.removeItem('RawMaterilSelected');
                this.props.navigation.navigate('IssueRawMaterialScanningScreen', { item: start_data.data.data, body_detail: body })
            }
            else {
                this.setState({ loading: false })
                ToastAndroid.show(start_data.data.message, ToastAndroid.LONG, 25, 50);
            }
        }
        else {
            this.setState({ loading: false })
            ToastAndroid.show("Please Select Raw Material", ToastAndroid.LONG, 25, 50);
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Headers label={'Issue Raw Material'} onBack={() => { this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'column', padding: wp('2.8%') }}>
                        <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                            <Text style={styles.productsdisable}>Work Order</Text>
                        </View>
                        <View style={styles.selectBackgroundStyle} >
                            <Text style={styles.selectproducts}>{this.state.work_order || "--"}</Text>
                            {/* <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} /> */}
                        </View>
                        <View style={{ marginTop: hp('1%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                            <Text style={styles.productsdisable}>Work Order No.</Text>
                        </View>
                        <View style={styles.selectBackgroundStyle}>
                            <Text style={styles.textInputStyle}>{this.state.work_order_no || '---'}</Text>
                        </View>
                        <View style={{ marginTop: hp('1%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                            <Text style={styles.headerBold}>Raw Material </Text>
                            <Text style={{ color: 'red' }}>*</Text>
                        </View>
                        <View style={{ flexDirection: 'column', margin: wp('5%') }}>
                            {this.state.SelectedRM.length > 0 ?
                                <FlatList
                                    data={this.state.SelectedRM}
                                    // onEndThreshold={20}
                                    renderItem={({ item }) => {
                                        console.log("render,", item)
                                        return (
                                            <View style={{ flex: 1, flexDirection: 'row', marginVertical: hp('1%') }}>

                                                <Text style={[styles.items]}>{item}</Text>
                                                <TouchableOpacity style={{ justifyContent: 'flex-end', alignItems: 'center' }}
                                                    onPress={() => this.Remove(item)}
                                                >
                                                    <SvgUri width="18" height="18" svgXmlData={svgImages.close} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center' }} />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }} />
                                :
                                <View style={{ flex: 1, flexDirection: 'row', marginVertical: hp('1%') }}>
                                    <Text style={[styles.items]}>Raw Material Not Selected</Text>
                                </View>}
                        </View>
                        <TouchableOpacity style={[styles.selectBackgroundStyle, { marginTop: hp('2%') }]} onPress={() => this.getRawmaterialList()}>
                            <Text style={styles.selectproducts}>{this.state.SelectedRM.length > 0 ? this.state.SelectedRM.length + ' RM Selected' : "Select Raw Materials"}</Text>
                            <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={{
                    flex: 1, position: 'absolute',
                    bottom: 0, flexDirection: 'row',
                }}>
                    <TouchableOpacity onPress={async () => { this.props.navigation.goBack() }}
                        style={[styles.center, {
                            marginTop: hp('1%'),
                            width: wp('50.5%'),
                            height: hp('8%'),
                            borderTopLeftRadius: wp('2.5%'),
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowColor: '#CECECE',
                            shadowRadius: 3,
                            elevation: 4,
                            backgroundColor: '#FFFFFF',
                            borderWidth: 0.2
                        }]}>

                        <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                            <Text style={styles.buttonCancel}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={async () => this.startJob()}>
                        <LinearGradient
                            colors={[color.gradientStartColor, color.gradientEndColor]}
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                            style={[styles.center, {
                                marginTop: hp('1%'),
                                width: wp('50.5%'),
                                height: hp('8%'),
                                borderWidth: 0.2,
                                borderTopRightRadius: wp('2.5%'),
                            }]}>
                            {
                                this.state.loading === true ? (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ paddingRight: 10 }}>
                                            <ActivityIndicator size={'small'} color='#FFFFFF' />
                                        </View>
                                        <View>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Please Wait...</Text>
                                        </View>
                                    </View>
                                ) :
                                    (<View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                        <Text style={styles.buttonStart}>Start</Text>
                                    </View>)
                            }
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default withNavigation(IssueRawMaterialShowDetail);

var styles = StyleSheet.create({
    items: {
        flex: 1,
        marginTop: hp('0.5%'),
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        color: color.gradientStartColor
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
    buttonCancel: {
        fontSize: hp('2.5%'),
        color: '#1D3567',
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