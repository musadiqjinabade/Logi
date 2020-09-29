import {
    Text, View, StatusBar, StyleSheet, Linking, AsyncStorage, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator,
    TextInput,
    BackHandler,
    FlatList,
    Platform
} from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../../../Images/images';
import Modal from 'react-native-modalbox';
import APIService from '../../../component/APIServices';
import React, { Component } from 'react';
import Headers from '../../../component/Headers'
import color from '../../../component/color';

const _ = require('lodash');

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'PairIdScanningScreen' })],
});
class RMNotCheckScanItemsScreen extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            height: 40,
            username: '',
            newValue: '',
            products: '',
            isVisible: true,
            checked: false,
            progressText: 'Loading...',
            jobId: '',
            levels: false,
            loading: true,
            locationId: null,
            locationName: '',
            assignment_mapping: '',
            receivedList: '',
            expanded: true,
            product_details: '',
            packeing_details: '',
            Comment: '',
            job_type: '',
            Updatedata: '',
            packaging_details: '',
            loadingsave: false
        }

    }

    async componentDidMount() {
        var com = await AsyncStorage.getItem('comment');
        this.setState({ loading: true, newValue: com })
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            this.setState({ jobId: this.props.navigation.state.params.item, job_type: this.props.navigation.state.params.job_type, loading: true }, () => {
                this.ScanSummary()
            })

        });

    }

    async ScanSummary() {
        console.log("job_type", this.state.job_type)
        var scan = await APIService.execute('GET', APIService.URLBACKEND + APIService.getAssignSummary + '?mapping_id=' + this.state.jobId + '&job_type=' + this.state.job_type, null)
        if (scan.data.data) {

            var responseData = _.map(scan.data.data.assignment_mapping, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })
            this.setState({ job_detail: scan.data.data.job_detail[0], Updatedata: responseData, packaging_details: scan.data.data.packeing_details, product_details: scan.data.data.product_details, loading: false }, () => {
                if (responseData.length > 0 ? this.state.Updatedata[0].level_id == 2 : false) {
                    this.setState({ levels: true })
                }
            })

            if (scan.data.data.sequence_ids != null || scan.data.data.sequence_ids.length > 0) {
                for (let i = 0; i < scan.data.data.sequence_ids.length; i++) {
                    var seqfull = scan.data.data.sequence_ids[i].sequence_number
                    // seqnumber.push(responseData[i].sequence_number)
                    this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
                }
            }
        }
        this.setState({ loading: false })
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

    checkLevel(item, index) {
        var responseData = _.map(this.state.Updatedata, (data) => {
            if (data.sequence_number == item.sequence_number) {
                return {
                    ...data,
                    mode: data.mode === "Expanded" ? 'Collapsed' : 'Expanded'
                }
            }
            else {
                return { ...data }
            }
        })
        this.setState({
            Updatedata: responseData
        }, () => {
            var check = true

            var array = this.state.Updatedata.filter(function (x) {
                if (x.level_id < item.level_id) {
                    check = false
                }
                if (x.level_id < item.level_id && x.parent_sequence_number == null) {
                    return x
                }
                return x.level_id >= item.level_id
            });
            // var findIndex = array.findIndex(item.sequence_number)
            console.log('findIndex:', array)

            if (array) {
                if (item.mode == 'Collapsed') {
                    var responseData = _.map(array, (data, indexes) => {
                        if (data.sequence_number != item.sequence_number && data.level_id == item.level_id) {
                            return {
                                ...data,
                                mode: data.mode = 'Collapsed'
                            }
                        }
                        else if (data.sequence_number == item.sequence_number) {
                            if (item.mode == 'Collapsed') {
                                this.expandReceivedata(item.sequence_number, indexes)
                                console.log('working 1', indexes)

                            }
                            return { ...data }
                        }
                        else {
                            return { ...data }
                        }
                    })
                    this.setState({ Updatedata: responseData })
                }
                else {
                    this.setState({
                        Updatedata: array
                    })
                }
            }
            if (check) {
                this.expandReceivedata(item.sequence_number, index)
            }

        })
    }

    async expandReceivedata(seqnum, index) {
        var url = APIService.URLBACKEND + APIService.getAssignSummary + '?mapping_id=' + this.state.jobId + '&sequence_number=' + seqnum + '&job_type=' + this.state.job_type;
        var scan = await APIService.execute('GET', url, null)
        var i;
        if (scan.data.status == 200 && scan.data.data != null) {
            for (i = 0; i < scan.data.data.length; i++) {
                this.state.Updatedata.splice(index + 1, 0, scan.data.data[i])
            }
        }
        var uniq = _.uniqBy(this.state.Updatedata, 'sequence_number')
        this.setState({ Updatedata: uniq })
        if (this.props.navigation.state.params.item == 'jobHistory') {
            for (let i = 0; i < scan.data.data.length; i++) {
                var seqfull = scan.data.data[i].sequence_number
                // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
                this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
            }
        }
    }

    plusimages(item) {
        if (item.mode == "Expanded") {
            return (
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                    <SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.minus} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} />
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                    <SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.plus} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} />
                </View>
            )
        }
    }

    renderModalContent = () => {
        if (this.state.loading) {
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


    marginlevel(item) {
        if (item.level_id == 0) {
            if (item.level_id == 0 && item.parent_sequence_number == null) {
                return null;

            }
            else {
                console.log("leve id 1 false")

                return wp('7%')
            }
        }
        else if (item.level_id == 2) {
            if (item.level_id == 2 && item.parent_sequence_number == null) {
                console.log("leve id 2 true")
                return null
            }
            else {
                console.log("leve id 2 false")
                return wp('6%')

            }
        }
        else if (item.level_id == 3) {
            if (item.level_id == 3 && item.parent_sequence_number == null) {
                return null
            }
            else {
                return wp('4%')
            }
        }
        else {
            return null
        }
    }
    updateSize = (height) => {
        this.setState({
            height
        });
    }

    async save_complete() {
        this.setState({ loadingsave: true });
        this.refs.modal6.open()


    }

    conformationNo() {
        this.setState({ loadingsave: false });

        this.refs.modal6.close()
    }

    async conformation() {
        var data = {}
        data.job_id = this.state.jobId;
        data.comment = this.state.newValue;
        data.location_id = this.state.locationId
        this.refs.modal6.close()
        var scan = await APIService.execute('POST', APIService.URLBACKEND + APIService.endAssignJob, data)
        if (scan.data.status == 200) {
            AsyncStorage.setItem('comment','')
            ToastAndroid.show(scan.data.data.message, ToastAndroid.LONG, 25, 50);
            console.log('end details:', scan);
            AsyncStorage.setItem('mappingId', data.mapping_id);
            this.setState({ loadingsave: false });
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
            }))
        }
        else {
            ToastAndroid.show(scan.data.data.message, ToastAndroid.LONG, 25, 50);
        }
    }

    async cancelJob() {
        this.refs.redirectHome.close()
        var data = {}
        data.job_id = this.state.jobId || null
        var cancelJobresponse = await APIService.execute('POST', APIService.URLBACKEND + APIService.cancelAssignJob, data)
        if (cancelJobresponse.data.status == 200) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.navigate('Dashboard')
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Headers isHome={true} onBackHome={() => { this.refs.redirectHome.open() }} label={'Scan Each Item - ' + this.state.jobId} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: wp('2%') }}>
                        <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%'), justifyContent: 'space-between', flexDirection: 'row', marginTop: hp('1%') }}>
                            <Button onPress={() => { this.refs.modalComment.open() }} style={styles.buttonStyle}>
                                <Text style={styles.header} >+ Comment</Text>
                            </Button>
                            <Button style={styles.buttonStyle} onPress={() => { this.props.navigation.goBack() }}>
                                <Text style={styles.header} >+ Add</Text>
                            </Button>
                            <Button style={styles.buttonStyle}
                                onPress={() => this.props.navigation.navigate('RMDeletebyscan', { item: this.state.seqnumber, jobId: this.state.jobId, jobType: this.state.job_type, jobhistroy: this.props.navigation.state.params.jobhistroy })}>
                                <Text style={styles.header} >- Remove</Text>
                            </Button>
                        </View>
                        <View style={{ flex: 1, paddingLeft: wp('2%'), paddingRight: wp('2%'), marginTop: hp('1%') }}>
                            <Text style={styles.headerBold}>Packaging</Text>
                            <View style={{ flex: 1, width: wp('88%') }}>
                                <FlatList
                                    extraData={this.state.packaging_details}
                                    data={this.state.packaging_details}
                                    renderItem={({ item, index }) => (
                                        <View style={{ marginTop: hp('1%'), flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.packagingItems} >{item.pkg_name || '---'}</Text>
                                            <Text style={styles.packagingValue} >{item.Count || '---'}</Text>
                                        </View>
                                    )} />
                            </View>
                        </View>
                        <View style={styles.line} />
                        <View style={{ flex: 1, paddingLeft: wp('2%'), paddingRight: wp('2%'), marginTop: hp('1%') }}>
                            <Text style={styles.headerBold}>Products</Text>
                            <View style={{ flex: 1, width: wp('88%') }}>
                                <FlatList
                                    extraData={this.state.product_details}
                                    data={this.state.product_details}
                                    renderItem={({ item, index }) => (
                                        <View style={{ marginTop: hp('1%'), flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.packagingItems} >{item.product_name || '---'}</Text>
                                            <Text style={styles.packagingValue} >{item.Count || '---'}</Text>
                                        </View>
                                    )} />
                            </View>
                        </View>
                        <View style={styles.line} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={[styles.headerBold, { marginTop: hp('2%'), paddingLeft: wp('2%'), paddingRight: wp('2%') }]}>Items</Text>
                        </View>
                        {this.state.Updatedata ?
                            this.state.Updatedata === undefined || this.state.Updatedata.length === 0 ? null :
                                <View style={{
                                    flex: 1, marginTop: hp('2%'), paddingLeft: wp('2%'), paddingRight: wp('2%')
                                }}>
                                    <FlatList
                                        extraData={this.state.Updatedata}
                                        data={this.state.Updatedata}
                                        renderItem={({ item, index }) => (
                                            <View style={{
                                                flex: 1,
                                                width: wp('90%'),
                                                // padding: wp('1%'),
                                                flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start',
                                            }}>
                                                <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
                                                    flex: 1, flexDirection: 'row', backgroundColor: item.level_id >= 2 ? color.gradientEndColor : '#4A90E2',
                                                    shadowOpacity: item.level_id >= 2 ? 0.8 : null,
                                                    height: wp('8%'),
                                                    shadowColor: item.level_id >= 2 ? '#CECECE' : null,
                                                    shadowRadius: item.level_id >= 2 ? 3 : null, elevation: item.level_id >= 2 ? 2 : null, borderRadius: 5,
                                                    margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: this.marginlevel(item)
                                                }} >
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 11, color: '#ffffff', justifyContent: 'flex-start',alignSelf: 'center' }}>{item.level_name} :</Text>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 11, color: '#ffffff', marginLeft: 5, justifyContent: 'flex-start',alignSelf: 'center' }}>{item.sequence_number || '---'}</Text>
                                                        {item.level_id == 0 ? <Text numberOfLines={1} style={{flex:1, fontFamily: 'Montserrat-Regular', fontSize: 11, color: '#ffffff', marginLeft: 5 ,alignSelf: 'center'}}>- {item.rm_name || '---'}</Text> : null}
                                                    </View>
                                                    {item.level_id >= 2 ? this.plusimages(item) : null}
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    //  keyExtractor={item => item.assignment_mapping_id}
                                    />
                                </View> : null}
                    </View>
                </ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{
                        flex: 1, position: 'absolute',
                        bottom: 0, flexDirection: 'row'
                    }}>
                        <TouchableOpacity onPress={async () => { this.props.navigation.goBack() }}>
                            <View
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
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.save_complete()}>
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
                                {this.state.loadingsave === true ? (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ paddingRight: 10 }}>
                                            <ActivityIndicator size={'small'} color='#FFFFFF' />
                                        </View>
                                        <View>
                                            <Text style={styles.buttonStart}>Please Wait...</Text>
                                        </View>
                                    </View>
                                ) : (<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.buttonStart}>{'Finish'}</Text>
                                </View>)}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                    backdropPressToClose={false}  >
                    <ScrollView>
                        <View style={{ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <SvgUri width="55" height="55" svgXmlData={svgImages.checkmark} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: wp('4%') }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', padding: 5 }}>
                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#1D3567' }}>Confirmation</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', textAlign: 'center' }}>Are you sure that you want to complete this Job?</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', alignSelf: 'center', flex: 1, flexDirection: 'row', marginBottom: wp('2%') }}>
                                <TouchableOpacity
                                    onPress={() => this.conformation()}
                                    style={{
                                        width: wp('23%'), height: wp('10%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: wp('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#6AC259',
                                    }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Ok</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.conformationNo()}
                                    style={{
                                        width: wp('23%'), height: wp('10%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: wp('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                    }} >
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modalComment"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ height: hp('35%'), width: wp('90%'), backgroundColor: '#fff', borderRadius: 5 }} >
                            <View style={{ flex: 1, flexDirection: 'column', margin: wp('5%') }}>
                                <Text style={[styles.headerBold]}>Comment</Text>
                                <TextInput
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                    style={styles.batchstyle}
                                    keyboardType='default'
                                    placeholder={'Enter your comment here.'}
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Regular', fontSize: 20 }}
                                    onChangeText={(newValue) => this.setState({ newValue },async ()=>{ 
                                        await AsyncStorage.setItem('comment', '')
                                        await AsyncStorage.setItem('comment', newValue)
                                     })}
                                    multiline={true} value={this.state.newValue}
                                    onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)} ></TextInput>
                                <View style={{ flex: 1 }}>
                                    <View style={{
                                        flex: 1, position: 'absolute',
                                        bottom: 0, flexDirection: 'row'
                                    }}>
                                        <TouchableOpacity onPress={async () => { this.refs.modalComment.close() }}>
                                            <View
                                                style={[styles.center, {
                                                    marginTop: hp('1%'),
                                                    width: wp('40%'),
                                                    height: hp('6%'),

                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3,
                                                    elevation: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    borderWidth: 0.2
                                                }]}>
                                                <View style={{ height: hp('6%'), justifyContent: 'center', alignSelf: 'center' }}>
                                                    <Text style={styles.buttonCancel}>Cancel</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={async () => { this.refs.modalComment.close() }}>
                                            <LinearGradient
                                                colors={[color.gradientStartColor, color.gradientEndColor]}
                                                start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                                style={[styles.center, {
                                                    marginTop: hp('1%'),
                                                    width: wp('40%'),
                                                    height: hp('6%'),
                                                    borderWidth: 0.2,
                                                }]}>
                                                <View style={{ height: hp('6%'), justifyContent: 'center', alignSelf: 'center' }}>
                                                    <Text style={styles.buttonStart}>Add Comment</Text>
                                                </View>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"redirectHome"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <TouchableOpacity style={{ width: wp('10%'), height: hp('5%'), justifyContent: 'center', alignSelf: 'flex-end', alignItems: 'flex-end' }} onPress={() => { this.refs.redirectHome.close() }} >
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
            </View >
        )
    }
}

export default withNavigation(RMNotCheckScanItemsScreen);

var styles = StyleSheet.create({
    batchstyle: {
        textAlignVertical: 'top',
        marginTop: hp('1%'),
        height: hp('15%'),
        fontFamily: 'Montserrat-Regular',
        color: '#000000',
        fontSize: 14,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 5, alignItems: 'flex-start',
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modal1: {
        maxHeight: hp('40%'),
        minHeight: hp('40%')
    },
    buttonStyle: {
        borderRadius: 5,
        width: wp("30%"),
        height: hp('6%'),
        backgroundColor: color.gradientEndColor
    },
    headerBold: {
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        color: '#000000'
    },
    line: {
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        borderBottomColor: '#828EA5',
        borderBottomWidth: 0.7,
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
        color: '#000000',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    header: {
        fontSize: wp('3%'),
        flex: 1,
        color: '#ffffff',
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
    selectSubLocation: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    // scanItems: {
    //     fontFamily: 'Montserrat-Regular',
    //     justifyContent: 'flex-start',
    //     marginLeft: wp('2%'),
    //     color: '#636363'
    // },
    packagingItems: {
        paddingHorizontal: wp('2%'),
        flex: 1, justifyContent: 'center', alignItems: 'flex-start',
        color: '#000000',
        fontFamily: 'Montserrat-Regular',
    },
    packagingValue: {
        alignItems: 'flex-end',
        color: '#000000',
        fontFamily: 'Montserrat-Regular',
    },
    items: {
        marginTop: hp('0.5%'),
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    scanItems: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        marginHorizontal: wp('4%'),
        color: '#636363'
    },
    scanheader: {
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 16,
        marginHorizontal: wp('2%'),
        color: '#636363'
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
});