import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, StyleSheet, Image, Animated, TouchableOpacity, Alert, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Right, Title, Toast, Header, CheckBox, Body, ListItem, Left, Icon } from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import Modal from 'react-native-modalbox';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import moment from "moment";
const _ = require('lodash');

var screen = Dimensions.get('window');

class JobHistory extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.onEndReachedCalledDuringMomentum = true;
        this.state = {
            selectedItems: [],
            data: '',
            page_no: 0,
            page_count: 50,
            progressText: 'Loading...',
            job: [],
            currentPage: 0,
            moreJob: [],
            loadingMoreJobs: false,
            jobType: '',
            jobStatus: '',
            jobId: '',
            locationId: null,
            locationName: '',
            expanded: true
        }
        this.count = 0;

    }

    async componentDidMount() {
        this.setState({ loading: true })
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });
        var token = await AsyncStorage.getItem('loginData');
        if (token) {
            token = JSON.parse(token);
        }
        var jwtDecode = require('jwt-decode');
        var decoded = jwtDecode(token.token);
        var start = await APIService.execute('GET', APIService.URLBACKEND + 'assignment/getalljobs?page_no=' + this.state.currentPage + '&page_count=25&sort_on=created_at&sort_by=desc&location_id=' + this.state.locationId + '&created_by=' + decoded.email, null)
        if (start.data.data.length > 0) {
            for (var i = 0; i < start.data.data.length; i++) {
                this.state.moreJob.push(start.data.data[i])
            }
        }
        this.setState({ data: start.data, loading: false }, () => {
            console.log('chunk', _.chunk(this.state.data.data, 10))
            console.log('data length one', this.state.data.length)
        })
    }

    onScrollHandler = () => {
        this.setState({
            page_no: this.state.page_no + 1
        },
            () => {
                console.log('inside scroll', this.state.page_no)
                this.fetchRecords(this.state.page_no);
            }
        );
    }

    fetchRecords(page) {
        var chunkedData = _.chunk(this.state.data, 10)[page]
        this.setState({ data: { ...this.state.data, ...chunkedData } }, () => console.log('data length', this.state.data.length))
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    updateSize = (height) => {
        this.setState({
            height
        });
    }

    conformationNo() {
        this.setState({ loading: false });
        this.refs.modal6.close();
    }

    continuewhereLeft(type, id, locationTo, stockDetails, recipient_id) {
        console.log('type', type)
        this.setState({ loading: false });
        this.refs.modal6.close();
        if (type == 'Aggregation') {
            this.props.navigation.navigate('LinkScanproduct', { item: 'jobHistory', id: id, type: type });
        }
        else if (type == 'RM_Aggregation') {
            this.props.navigation.navigate('RMScanproduct', { item: 'jobHistory', id: id, type: type });
        }
        else if (type == 'Dispatch') {
            this.props.navigation.navigate('MoveScanproduct', { item: 'jobHistory', id: id, type: type, locationTo: locationTo, stockDetails: stockDetails });
        }
        else if (type == 'Recieve') {
            this.props.navigation.navigate('ReceiveScanStock', { item: 'jobHistory', id: id, type: type });
        }
        else if (type == 'Assignment') {
            this.props.navigation.navigate('Scanassign', { item: 'jobHistory', id: id, type: type });
        }
        else if (type == 'Assignment & Aggregation') {
            this.props.navigation.navigate('Scanassign', { item: 'jobHistory', id: id, type: type });
        }
        else if (type == 'Quickmove') {
            this.props.navigation.navigate('QuickMoveScanningScreen', { item: 'jobHistory', id: id, type: type });
        }
        else if (type == 'Return') {
            this.props.navigation.navigate('ProductReturnScanningScreen', { item: 'jobHistory', id: id, type: type, recipient_id: recipient_id });
        }
        else if (type == 'Issue Raw Material') {
            this.props.navigation.navigate('IssueRawMaterialScanningScreen', { item: 'jobHistory', id: id, type: type });
        }
        else if (type == 'RM_Assignment' || type == 'RM_Assignment & Aggregation') {
            this.props.navigation.navigate('RMCheckScanningScreen', { item: 'jobHistory', id: id, type: type });
        }
        else if (type == 'Stockcount') {
            this.props.navigation.navigate('StockCountScanningScreen', { item: 'jobHistory', id: id, type: type });
        }

    }

    renderModalContent = () => {
        const fontSize = 11;
        if (this.state.loading) {
            return (
                <View style={styles.overlay}>
                    <ActivityIndicator color="#1D3567" size="large" />
                    <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#1D3567' }}>{this.state.progressText}</Text>
                </View>
            );
        }
        else if (this.state.moreJob.length < 1) {
            return (
                <View
                    style={{
                        flex: 1, shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowColor: '#CECECE',
                        shadowRadius: 3,
                        borderRadius: 5,
                        padding: widthPercentageToDP('2%'),
                        marginLeft: widthPercentageToDP('1%'),
                        marginTop: widthPercentageToDP('2%'),
                        marginRight: widthPercentageToDP('1%'),
                        marginBottom: widthPercentageToDP('4%'),
                        width: widthPercentageToDP('93%'),
                        height: widthPercentageToDP('40%'),
                        flexDirection: 'column',
                        elevation: 4,
                        backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                    }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                    }}>
                        <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize, }}>No Job Available </Text>
                    </View>
                </View>
            )
        }
        else {
            return null;
        }
    }

    async cancelJob() {
        var data = {}
        var requestbody = {}
        data.mapping_id = this.state.jobId
        requestbody.job_type = this.state.jobType
        requestbody.job_id = this.state.jobId
        requestbody.location_name = this.state.locationName

        var cancelJobresponse = ''
        if (this.state.jobType == 'Aggregation' || this.state.jobType == 'Assignment & Aggregation' || this.state.jobType == 'Assignment') {
            cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + 'mapping/canceljob', data)
        }
        else if (this.state.jobType == 'Dispatch' || this.state.jobType == 'Recieve') {
            cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + 'stockTransfer/canceljob', requestbody)
        }
        else if (this.state.jobType == 'Return' || this.state.jobType == 'Quickmove' || this.state.jobType == 'Stockcount') {
            var data = {}
            data.job_type = this.state.jobType
            data.job_id = this.state.jobId
            data.location_name = this.state.locationName
            cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + 'stockTransfer/canceljob', data)
        }
        else if (this.state.jobType == 'Issue Raw Material') {
            var data = {}
            data.job_id = this.state.jobId
            var Jobresponse = await APIService.execute('POST', APIService.URLBACKEND + APIService.issuerermdelete, data)
            console.log("cancelJobresponse", Jobresponse)
            if (Jobresponse.data.status == 200) {
                ToastAndroid.show(Jobresponse.data.data.message, ToastAndroid.LONG, 25, 50);
                this.props.navigation.goBack()
            }
        }
        else if (this.state.jobType == 'RM_Aggregation') {
            var data = {}
            data.job_id = this.state.jobId
            var response = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/cancelrmjob', data)
            console.log("cancelJobresponse", response)
            if (response.data.status == 200) {
                // ToastAndroid.show(response.data.data, ToastAndroid.LONG, 25, 50);
                ToastAndroid.show("Job Cancel Successfully", ToastAndroid.LONG, 25, 50);
                this.props.navigation.goBack()
            }
        }
        else if (this.state.jobType == 'RM_Assignment & Aggregation') {
            var data = {}
            data.job_id = this.state.jobId
            var cancelJob = await APIService.execute('POST', APIService.URLBACKEND + APIService.cancelAssignJob, data)
            this.setState({ scannerload: false })
            if (cancelJob.data.status == 200) {
                // ToastAndroid.show(response.data.data, ToastAndroid.LONG, 25, 50);
                ToastAndroid.show("Job Cancel Successfully", ToastAndroid.LONG, 25, 50);
                this.props.navigation.goBack()
            }
        }
        if (cancelJobresponse.data.status_code == 200) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.goBack()
        }
        else if (cancelJobresponse.data.status_code == 400) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
        }
    }

    async loadMoreJobs() {
        this.setState({
            loadingMoreJobs: true,
            currentPage: parseInt(this.state.currentPage) + 1
        }, async () => {
            var token = await AsyncStorage.getItem('loginData');
            if (token) {
                token = JSON.parse(token);
            }
            var jwtDecode = require('jwt-decode');
            var decoded = jwtDecode(token.token);
            var start = await APIService.execute('GET', APIService.URLBACKEND + 'assignment/getalljobs?page_no=' + this.state.currentPage + '&page_count=25&sort_on=created_at&sort_by=desc&created_by=' + decoded.email, null)
            if (start.data.data.length > 0) {
                for (var i = 0; i < start.data.data.length; i++) {
                    this.state.moreJob.push(start.data.data[i])
                }
                this.setState({
                    loadingMoreJobs: false
                })
            }
            else {
                this.setState({
                    loadingMoreJobs: false
                }, () => {
                    ToastAndroid.show("All Jobs Loaded", ToastAndroid.LONG, 25, 50);
                })
            }
        })
    }

    renderListFooter() {
        if (this.state.loadingMoreJobs) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, paddingTop: 20, paddingBottom: 20 }}>
                    <ActivityIndicator size={'large'} color='#1D3567' />
                </View>
            )
        }
        else {
            return null;
        }
    }

    showConfirmation(job, type, location_to, stockdetails, recipient_id) {
        this.setState({
            jobType: type,
            jobStatus: job.status,
            jobId: job.job_id ? job.job_id : job.stockdetails_id,
            locationTo: location_to,
            stockDetails: stockdetails,
            recipient_id: recipient_id
        }, () => {
            this.refs.modal6.open()
        })
        return (
            <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                backdropPressToClose={false}  >
                {/* <ScrollView> */}
                <View style={{ /*height: widthPercentageToDP('65%'),*/ width: widthPercentageToDP('80%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                    <SvgUri width="55" height="55" svgXmlData={svgImages.checkmark} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: widthPercentageToDP('4%') }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', padding: 5 }}>
                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#1D3567' }}>Confirmation</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignSelf: 'center', padding: 10 }}>
                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567' }}>Do you want to resume this job ?</Text>
                    </View>
                    <View style={{ justifyContent: 'space-between', alignSelf: 'center', flex: 1, flexDirection: 'row', marginBottom: widthPercentageToDP('8%'), marginTop: widthPercentageToDP('8%') }}>
                        <TouchableOpacity
                            onPress={() => this.continuewhereLeft(item.job_type)}
                            style={{
                                width: widthPercentageToDP('35%'), height: widthPercentageToDP('10%'), shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                margin: widthPercentageToDP('2%'),
                                shadowRadius: 3, justifyContent: 'center', alignSelf: 'center', alignItems: 'center',
                                borderRadius: 5,
                                flexDirection: 'column',
                                elevation: 4,
                                backgroundColor: '#6AC259'
                            }}>
                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Continue</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.cancelJob()}
                            style={{
                                width: widthPercentageToDP('35%'), height: widthPercentageToDP('10%'), shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                margin: widthPercentageToDP('2%'),
                                shadowRadius: 3, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: 'center',
                                borderRadius: 5,
                                flexDirection: 'column',
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                            }}  >
                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567' }}>Clear & Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    showAlert(status) {
        Alert.alert(
            "Message",
            "This job is already " + status + ".",
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

    render() {
        const { selectedItems, height, newValue } = this.state
        let newStyle = {
            height
        }
        const fontSize = 11;
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1F3FD' }}>
                <Headers label={"Job History"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3FD', paddingHorizontal: 8, marginTop: widthPercentageToDP('4%'), }}>
                        <FlatList
                            extraData={this.state.moreJob}
                            data={this.state.moreJob}
                            onEndReached={({ distanceFromEnd }) => {
                                this.loadMoreJobs();
                            }}
                            onEndThreshold={0.01}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => item.status == 'In-Progress' ? this.showConfirmation(item, item.job_type, item.location_to ? item.location_to : null, item.stock_details ? item.stock_details : null, item.recipient_id ? item.recipient_id : null) : this.showAlert(item.status)}
                                    style={{
                                        flex: 1, shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        borderRadius: 5,
                                        padding: widthPercentageToDP('2%'),
                                        marginLeft: widthPercentageToDP('1%'),
                                        marginTop: item.id == 1 ? widthPercentageToDP('2%') : null,
                                        marginRight: widthPercentageToDP('1%'),
                                        marginBottom: widthPercentageToDP('4%'),
                                        width: widthPercentageToDP('93%'),
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                                    }}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <View style={{ flex: 1, justifyContent: 'flex-start', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), flexDirection: 'column' }}>
                                            {/* <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{item.job_type == 'Dispatch' ? 'D' :  item.job_type == 'Recieve' ? 'R' : item.job_type == 'Assignment' ? 'A' : item.job_type == 'Assignment & Aggregation' ? 'A' : item.job_type == 'Aggregation' ? 'M' : item.job_type =='Issue Raw Material'?'I' : null}{' - '}{item.job_type == 'Dispatch' || item.job_type == 'Recieve' ? item.stockdetails_id : item.job_id || item.stockdetails_id}</Text> */}
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{item.job_type == 'Dispatch' ? 'D' : item.job_type == 'Recieve' ? 'R' : item.job_type == 'Assignment' ? 'A' : item.job_type == 'Assignment & Aggregation' ? 'A' : item.job_type == 'RM_Assignment' ? 'RM' : item.job_type == 'Aggregation' ? 'M' : item.job_type == 'Quickmove' ? 'Q' : item.job_type == 'Stockcount' ? 'S' : item.job_type == 'Return' ? 'R' : item.job_type == 'Issue Raw Material' ? 'I' : 'RM'}{' - '}{item.job_type == 'Dispatch' || item.job_type == 'Recieve' || item.job_type == 'Return' ? item.stockdetails_id : item.job_id || item.stockdetails_id}</Text>
                                        </View>
                                        <View style={{ width: widthPercentageToDP('29%'), height: widthPercentageToDP('7%'), marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: item.status == 'In-Progress' ? "#ECBA57" : item.status == 'Completed' ? "#6AC259" : "#F57369" }}>
                                            <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', fontSize: 10 }}>{item.status}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                                    }}>
                                        <Text style={{ justifyContent: 'flex-start', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), alignItems: 'flex-start', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>Job Type: {item.job_type || '---'}</Text>
                                    </View>
                                    <View style={{ width: widthPercentageToDP('85%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%') }} />
                                    <View style={{ width: widthPercentageToDP('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('1%') }}>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Created Date:</Text>
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{item.created_at ? moment(item.created_at).format('DD MMM YYYY') : '---'}</Text>
                                        </View>

                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Created by:</Text>
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{item.created_by || '---'}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: widthPercentageToDP('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('1%') }}>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Start Time:</Text>
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{item.start_time_unix ? moment.unix(item.start_time_unix).format('hh:mm a') : '---'}</Text>
                                        </View>

                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>End Time:</Text>
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{item.end_time_unix ? moment.unix(item.end_time_unix).format('hh:mm a') : '---'}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.job_id}
                        />
                    </View> 
                    <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                        backdropPressToClose={true}  >
                        {/* <ScrollView> */}
                        <View style={{ /*height: widthPercentageToDP('65%'),*/ width: widthPercentageToDP('80%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <SvgUri width="55" height="55" svgXmlData={svgImages.checkmark} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: widthPercentageToDP('4%') }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', padding: 5 }}>
                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#1D3567' }}>Confirmation</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignSelf: 'center', padding: 10 }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567' }}>Do you want to resume this job ?</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', alignSelf: 'center', flex: 1, flexDirection: 'row', marginBottom: widthPercentageToDP('8%'), marginTop: widthPercentageToDP('8%') }}>
                                <TouchableOpacity
                                    onPress={() => this.continuewhereLeft(this.state.jobType, this.state.jobId, this.state.locationId, this.state.stockDetails, this.state.recipient_id)}
                                    style={{
                                        width: widthPercentageToDP('35%'), height: widthPercentageToDP('10%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: widthPercentageToDP('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center', alignItems: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#6AC259'
                                    }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Continue</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.cancelJob()}
                                    style={{
                                        width: widthPercentageToDP('35%'), height: widthPercentageToDP('10%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: widthPercentageToDP('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                    }}  >
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567' }}>Clear & Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                {this.renderModalContent()}
                {this.renderListFooter()}
            </Container>
        )
    }
}

export default withNavigation(JobHistory);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
    },
    batchstyle: {
        paddingLeft: 6,
        flexDirection: 'row',
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: widthPercentageToDP('75%'),
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
    text: {
        textAlign: 'left',
        fontFamily: 'Montserrat-Bold',
        color: '#1D3567',
        margin: 5
    },
    textrow: {
        textAlign: 'left',
        color: '#1D3567',
        margin: 5,
        fontFamily: 'Montserrat-Regular',
    },
    row: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#EAF1FC',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
        flex: 1, paddingTop: 50
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
    },
    content: {
        backgroundColor: '#F1EFEE',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
        color: '#000',
        fontWeight: 'bold',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        fontFamily: 'avenir'
    },
    contentSubTitle: {
        fontSize: 16,
        marginBottom: 12,
        color: '#000',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        fontFamily: 'avenir'
    }
});