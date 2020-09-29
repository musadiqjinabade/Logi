import React, { Component } from 'react';
import { Text, View, StatusBar, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, BackHandler, FlatList, Dimensions, AsyncStorage, ActivityIndicator } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color';
import Modal from 'react-native-modalbox';
import APIService from '../component/APIServices';
const _ = require('lodash');

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'IssueRawMaterialScanningScreen' })],
});
class IssueRawMaterialScanningItemsScreen extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            locationId: '',
            locationName: '',
            assignment_mapping: '',
            Updatedata: '',
            job_detail: '',
            Comment: '',
            jobId: '',
            loadingfinish: false,
            loading: true
        }
    }

    async componentDidMount() {
        var com = await AsyncStorage.getItem('comment')
        this.focusListener = this.props.navigation.addListener('didFocus', async () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            await AsyncStorage.getItem('SelectedLocation').then((value) => {
                var location = JSON.parse(value);
                this.setState({
                    Comment: com,
                    locationId: location.id ? location.id : location.value,
                    locationName: location.itemName ? location.itemName : location.label
                })
            });
            this.setState({ jobId: this.props.navigation.state.params.item }, () => { this.getAssignmentsummary() })

        })
    }

    handleBackPress() {
        this.navigateBack();
        return true;
    }

    async getAssignmentsummary() {
        var body = {}
        body.job_id = this.state.jobId
        body.sequence_number = 0
        var scan = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/issuermsummary', body)
        console.log("scan:", scan)
        if (scan.data.status == 200) {
            var responseData = _.map(scan.data.data.assignment_mapping, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })
            this.setState({ Updatedata: scan.data.data.rm_availability, assignment_mapping: responseData, loading: false, job_detail: scan.data.data.job_detail })
            for (let i = 0; i < scan.data.data.sequence_ids.length; i++) {
                var seqfull = scan.data.data.sequence_ids[i].sequence_number
                // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
                this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
            }
        }
    }

    async navigateBack() {
        this.props.navigation.dispatch(resetAction)
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }


    checkLevel(item, index) {
        console.log("item:", item)
        var responseData = _.map(this.state.assignment_mapping, (data) => {
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
            assignment_mapping: responseData
        }, () => {
            var check = true
            var array = this.state.assignment_mapping.filter(function (x) {
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
                    this.setState({ assignment_mapping: responseData })
                }
                else {
                    this.setState({
                        assignment_mapping: array
                    })
                }
            }
            if (check) {
                this.expandReceivedata(item.sequence_number, index)
            }
        })
    }

    async expandReceivedata(seqnum, index) {
        var url = APIService.URLBACKEND + 'rowmaterial/issuermsummary';
        var body = {}
        body.job_id = this.state.jobId
        body.sequence_number = seqnum
        var scan = await APIService.execute('POST', url, body)
        var i;
        var responseData = []
        if (scan.data.data != null) {
            responseData = _.map(scan.data.data, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })
        }
        if (scan.data.status == 200 && scan.data.data != null) {
            for (i = 0; i < responseData.length; i++) {
                this.state.assignment_mapping.splice(index + 1, 0, responseData[i])
            }
        }
        var uniq = _.uniqBy(this.state.assignment_mapping, 'sequence_number')
        this.setState({ assignment_mapping: uniq })
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

    onChangeCommentText(Text) {
        this.setState({ Comment: Text },async ()=>{ 
            await AsyncStorage.setItem('comment', '')
            await AsyncStorage.setItem('comment', Text)
         })
    }

    async conformation() {
        this.setState({ loadingfinish: true })
        var body = {}
        body.job_id = this.state.jobId
        body.comment = this.state.Comment
        this.refs.modal6.close()
        var finish = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/endissuermjob', body)
        console.log("finish:", finish)
        if (finish.data.status == 200) {
            AsyncStorage.setItem('comment','')
            console.log("finish2:", finish)
            ToastAndroid.show(finish.data.data.message, ToastAndroid.LONG, 25, 50);
            this.setState({ loadingfinish: false });
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
            }))
        }
        else {
            this.setState({ loadingfinish: false });
            ToastAndroid.show(finish.data.data.message, ToastAndroid.LONG, 25, 50);
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

    conformationNo() {
        this.setState({ loadingfinish: false });

        this.refs.modal6.close()
    }

    marginlevel(item) {
        if (item.level_id == 0) {
            if (item.level_id == 0 && item.parent_sequence_number == null) {
                return null;
            }
            else {
                console.log("leve id 1 false")

                return wp('8%')
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

    async cancelJob() {
        this.refs.redirectHome.close()
        var data = {}
        data.job_id = this.state.jobId || null
        var cancelJobresponse = await APIService.execute('POST', APIService.URLBACKEND + APIService.issuerermdelete, data)
        if (cancelJobresponse.data.status == 200) {
            await AsyncStorage.setItem('comment','')
            ToastAndroid.show(cancelJobresponse.data.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.navigate('Dashboard')
        }
    }


    render() {
        var seq = this.props.navigation.state.params.url;
        const fontSize = 11
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Headers isHome={true} onBackHome={() => { this.refs.redirectHome.open() }} label={'Issue Raw Material - ' + this.state.jobId || null} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: wp('2%') }}>
                        <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%'), justifyContent: 'space-between', flexDirection: 'row', marginTop: hp('1%') }}>
                            <Button onPress={() => { this.refs.modalComment.open() }} style={styles.buttonStyle}>
                                <Text style={styles.header} >+ Comment</Text>
                            </Button>
                            <Button style={styles.buttonStyle}
                                onPress={() => this.props.navigation.goBack()}>
                                <Text style={styles.header} >+ Add</Text>
                            </Button>
                            <Button style={styles.buttonStyle}
                                onPress={() => this.props.navigation.navigate('IssueRawMaterialDelete', { item: seq, jobId: this.state.jobId, jobType: this.state.job_detail.job_type, jobhistroy: this.props.navigation.state.params.jobhistroy })}>
                                <Text style={styles.header} >- Remove</Text>
                            </Button>
                        </View>
                        <View style={{ marginTop: hp('2%') }} />
                        <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%'), marginBottom: hp('10%') }}>
                            <View style={{ marginTop: hp('1%') }} />
                            <Text style={styles.headerBold}>Raw Material</Text>
                            <View style={{ marginTop: hp('0.5%'), flexDirection: 'row' }}>
                                <FlatList
                                    extraData={this.state.Updatedata}
                                    data={this.state.Updatedata}
                                    renderItem={({ item }) => {
                                        console.log('data:', item[Object.keys(item)[0]])
                                        return (
                                            <View style={{
                                                flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%')
                                            }}>
                                                <View style={{ width: wp('90%'), marginHorizontal: wp('1%'), marginTop: wp('1%'), marginBottom: wp('4%') }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: wp('2%') }}>
                                                    <View style={{ flex: 1, flexDirection: 'row', width: wp('44%'), height: wp('6%'), justifyContent: 'flex-start', alignItems: 'center' }}>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567' }}>{Object.keys(item) || '---'}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', width: wp('10%'), height: wp('8%'), justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <SvgUri width="28" height="18"
                                                            fill={item[Object.keys(item)[0]] ? '#6AC259' : '#FF4500'}
                                                            svgXmlData={svgImages.success}
                                                            style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', marginLeft: wp('6%') }} />
                                                    </View>
                                                    {/* </View> */}
                                                </View>
                                            </View>
                                        )
                                    }}
                                // keyExtractor={item => item}
                                />
                            </View>
                            <View style={[styles.line, { marginTop: hp('2%') }]} />
                            <Text style={styles.headerBold}>Item</Text>
                            <View style={{ marginTop: hp('1%'), flexDirection: 'row' }}>
                                <FlatList
                                    extraData={this.state.assignment_mapping}
                                    data={this.state.assignment_mapping}
                                    renderItem={({ item, index }) => (
                                        <View style={{
                                            flex: 1,
                                            width: wp('90%'),
                                            flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'
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
                                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff', justifyContent: 'flex-start',alignSelf: 'center' }}>{item.level_name} :</Text>
                                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5, justifyContent: 'flex-start',alignSelf: 'center' }}>{item.sequence_number || '---'}</Text>
                                                    {item.level_id == 0 ? <Text numberOfLines={1} style={{ flex:1, fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5,alignSelf: 'center' }}>- {item.rm_name || '---'}</Text> : null}
                                                    {item.ishighlighted ? <SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.minus} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} /> : null}
                                                </View>
                                                {item.level_id >= 2 ? this.plusimages(item) : null}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                // keyExtractor={item => item}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
                    <TouchableOpacity onPress={async () => this.setState({ loadingfinish: true }, () => {
                        this.refs.modal6.open()
                    })}>
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
                                this.state.loadingfinish === true ? (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ paddingRight: 10 }}>
                                            <ActivityIndicator size={'small'} color='#FFFFFF' />
                                        </View>
                                        <View>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Please Wait...</Text>
                                        </View>
                                    </View>
                                ) : (
                                        <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                            <Text style={styles.buttonStart}>Finish</Text>
                                        </View>)}

                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                    backdropPressToClose={false}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
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
                                    value={this.state.Comment}
                                    keyboardType='default'
                                    onChangeText={(text) => this.onChangeCommentText(text)}
                                    placeholder={'Enter comment'} />
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
                                    }}  >
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

export default withNavigation(IssueRawMaterialScanningItemsScreen);

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
    scanItems: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    packagingItems: {
        flex: 1, justifyContent: 'center', alignItems: 'flex-start',
        color: '#000000',
        paddingHorizontal: wp('2%'),
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
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    }
});