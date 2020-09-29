import React, { Component } from 'react';
import {
    Text, View, FlatList, StatusBar, StyleSheet,Linking, AsyncStorage, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator, AppState,
    Platform,
    PermissionsAndroid,
    BackHandler,
    DeviceEventEmitter
} from 'react-native';
import { withNavigation, NavigationActions, StackActions, NavigationEvents } from 'react-navigation';
import { Container} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import QRCodeScanner from "react-native-qrcode-scanner";
import svgImages from '../Images/images';
import * as Animatable from "react-native-animatable";
import Modal from 'react-native-modalbox';
import APIService from '../component/APIServices';
import moment from "moment";
import Sound from 'react-native-sound';
import DataWedgeIntents from 'react-native-datawedge-intents';
import { ScanditModule,
    Barcode,
    ScanSettings
} from 'scandit-react-native';
import Headers from '../component/Headers';
import color from '../component/color';
import SearchableDropdown from '../Assign/All/searchablebleDropdown';



const _ = require('lodash');

ScanditModule.setAppKey('AXZORj2nI0ZMHjyLexkWTD4mrkrjAEPrtXgCuecYbnjOFdU2d23g4BJzs00JbnSO9kZAtpNswn8ATLqojjZJ/zdz7cwHRaD3dxaoV/VDmq+bYuAxWjA/tTsxsMngOuBhZTdlDeMaFiuBYAOCQ3ldwMdCLOSZLmo1ltZ59+gN01VbmCtcFAiZKWwF4+5a5Hi1DQLxcGLgOtGJzGKs/rWsXKXKxTIazPt2z2VM+dK1y15HR9lI3RAKV5JWpoxKPIXrHij7fNep4cdwOWXnps4NQy7w4USWe9iWo7J/IC4IrmHAbz/QkOR1ZZiMOJmOF9ME9Ty3eMmIAEZSPIbcREpUmDwtMVJHcH02cMF1AExn1cdeinIWPNitXETQR0RCNfJJVwL3ktcUkqo9lmSySZHRdKNM87laMm11SqF60IX5koMGGADrVaw8yb2Zxvk1EHzaT6J+0gQmc50QbUt051D6yTlmGJkWUfRnRIHqqcFrWMNeL8fNbl0l3ewIOmDl06nddaTFqHKTVPR+LCugEXjN4xZvOIwA4RlBrXnvLcL10DuTN30mavL0FeqZ/v33s95D5yKIAmgGpIakYljrxoeuvb+OI8E3r7eBx2iJ6ycfXztY6q3kIqeL2Xva4bH23EmlvV1VAQ21iaiTc6eX5+9Q+3XJSDLPYHDKn1srwI2zzEx68IopPQUKQpui6hVIlbPTPBRwNNi1vgqu132Qp7k5zXlxt6NAisMHzeCIQgBOfaDjHDVwWFMcC6drp53LtQFVCru/gPAz2ttDocEZm0Rgr0reHrWups6jo4afQLzkhbLqQ5md4Hw=');

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'ReceiveStock' })],
});
class ReceiveScanStock extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            focus: false,
            username: '',
            products: '',
            model: false,
            data: '',
            isVisible: true,
            checked: false,
            progressText: 'Loading...',
            delete: false,
            active: true,
            props: '',
            sURLVariables: '',
            receivedData: '',
            message: '',
            job_detail: '',
            levels: false,
            seqnumber: {},
            locationId: null,
            locationName: '',
            count: 0,
            receivedList: [],
            deviceEventdata: '',
            jobId: '',
            expanded: true,
            Sub_location:'',
            selected_location:''.count,
            showCamera:false,
            DashboardRoute:false
        }
        this.scanHandler = (deviceEvent) => {
            console.log('device event', deviceEvent);
            if (this.state.deviceEventdata == '' || this.state.deviceEventdata == null) {
                this.setState({
                    deviceEventdata: deviceEvent.data
                }, () => {
                    console.log('device event data', this.state.deviceEventdata)
                    this.scabByZebra(deviceEvent)
                })
            }
            else if (this.state.deviceEventdata != deviceEvent.data) {
                console.log('inside deviceevent else', this.state.deviceEventdata, deviceEvent.data)
                this.setState({
                    deviceEventdata: deviceEvent.data
                }, () => this.scabByZebra(deviceEvent))

            }
        };

        this.sendCommandResult = "false";
        // this.setDecoders();
        this.broadcastReceiverHandler = (intent) => {
            this.broadcastReceiver(intent);
        }
        DeviceEventEmitter.addListener('datawedge_broadcast_intent', this.broadcastReceiverHandler);
        DeviceEventEmitter.addListener('barcode_scan', this.scanHandler);
        this.registerBroadcastReceiver();
        this.determineVersion();

    }

    determineVersion() {
        // DataWedgeIntents.sendIntent(DataWedgeIntents.ACTION_SOFTSCANTRIGGER, DataWedgeIntents.START_SCANNING);
        this.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");
    }

    broadcastReceiver(intent) {
        //  Broadcast received
        console.log('Received Intent: ' + JSON.stringify(intent));
        
    }


    registerBroadcastReceiver() {
        DataWedgeIntents.registerBroadcastReceiver({
            filterActions: [
                'com.sepio_logitrack.ACTION',
                'com.symbol.datawedge.api.RESULT_ACTION'
            ],
            filterCategories: [
                'android.intent.category.DEFAULT'
            ]
        });
    }

    sendCommand(extraName, extraValue) {
        var broadcastExtras = {};
        broadcastExtras[extraName] = extraValue;
        broadcastExtras["SEND_RESULT"] = this.sendCommandResult;
        DataWedgeIntents.sendBroadcastWithExtras({
            action: "com.symbol.datawedge.api.ACTION",
            extras: broadcastExtras
        });
    }

    componentWillMount() {
        this.settings = new ScanSettings();
        // this.settings.setSymbologyEnabled(Barcode.Symbology.EAN13, true);
        this.settings.setSymbologyEnabled(Barcode.Symbology.DOTCODE, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.EAN8, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.UPCA, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.UPCE, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.CODE39, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.ITF, true);
        this.settings.setSymbologyEnabled(Barcode.Symbology.QR, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.DATA_MATRIX, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.CODE128, true);
        // this.settings.getSymbologySettings(Barcode.Symbology.CODE39)
        //     .activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        this.settings.highDensityModeEnabled = true;
        this.settings.beep = true;
        this.settings.vibrate = true;
    }

    isAndroidMarshmallowOrNewer() {
        return Platform.OS === 'android' && Platform.Version >= 23;
    }


    async hasCameraPermission() {
        if (this.isAndroidMarshmallowOrNewer()) {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            return granted;
        } else {
            return true;
        }
    }

    async requestCameraPermission() {
        if (this.isAndroidMarshmallowOrNewer()) {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Android Camera Permission has been granted.");
                    this.cameraPermissionGranted();
                } else {
                    console.log("Android Camera Permission has been denied - the app will shut itself down.");
                    this.cameraPermissionDenied();
                }
            } catch (err) {
                console.warn(err);
            }

        } else {

            this.cameraPermissionGranted();

        }

    }


    cameraPermissionDenied() {

        BackHandler.exitApp();
    }


    cameraPermissionGranted() {
        this.scanner.startScanning();
    }



    _handleAppStateChange = async (nextAppState) => {
        if (nextAppState.match(/inactive|background/)) {
            this.scanner.stopScanning();
        } else {
            this.checkForCameraPermission();
        }

    }

    async checkForCameraPermission() {
        const hasPermission = await this.hasCameraPermission();
        if (hasPermission) {
            this.cameraPermissionGranted();
        } else {
            await this.requestCameraPermission();
        }
    }

    async reloadData() {
        var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=' + this.state.jobId;
        console.log('url', url);
        var scan = await APIService.execute('GET', url, null)
        var i;
        this.setState({
            receivedData:[],receivedList:[]})
        if (scan.data.data.assignment_mapping != null) {
            var responseData = _.map(scan.data.data.assignment_mapping, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })
            for (i = 0; i < responseData.length; i++) {
                this.state.receivedList.push(responseData[i])
            }
        }

        // if (this.props.navigation.state.params.item == 'jobHistory'){
        if (scan.data.data.sequence_ids != null || scan.data.data.sequence_ids.length > 0) {
            for (let i = 0; i < scan.data.data.sequence_ids.length; i++) {
                var seqfull = scan.data.data.sequence_ids[i].sequence_number
                // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
                this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
            }
        }

        var uniq = _.uniqBy(this.state.receivedList, 'sequence_number')
        this.setState({
            receivedData: uniq, job_detail: scan.data.data.stockdetails[0], count: this.state.count + 1, model: true
        }, () => console.log('level wise data', this.state.receivedData))

    }

    async componentDidMount() {
         await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });
        var model = await AsyncStorage.getItem('deviceModel')
        this.setState({ DashboardRoute:false, model: true, props: this.props.navigation.state.params.item, deviceModel: model, jobId: this.props.navigation.state.params.item != 'jobHistory' ? this.props.navigation.state.params.item.recieve_id : this.props.navigation.state.params.id }, () => {
            console.log("prop data:", this.state.props)
        });
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            this.setState({DashboardRoute:false})
            this.reloadData()
        })

    }

    handleBackPress() {
        this.navigateBack();
        return true;
    }

    async navigateBack() {
        this.refs.modal6.open()
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        AppState.removeEventListener('change', this._handleAppStateChange);
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }


    // }

    scabByZebra(session) {
        console.log('session.data', session.data)
        var sURLVariables = session.data != null ? session.data.split('/')[3] : null
        console.log("sURLVariables:", sURLVariables);
        // this.playSound()
        session.data != null ?
            this.setState({ data: session.data, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                console.log("seq number", this.state.seqnumber)
                this.Updatedata();
            }) : null

        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            // this.scanner.resumeScanning();
        }.bind(this), 5000)
    }

    async Updatedata() {
        console.log('count', this.state.count);
        // if (this.state.count == 0) {
        var logintoken = await AsyncStorage.getItem('loginData');
        var decoded = ''
        if (logintoken) {
            logintoken = JSON.parse(logintoken);
            var jwtDecode = require('jwt-decode');
            decoded = jwtDecode(logintoken.token);
        }
        var data = {}
        data.recieve_id = this.state.jobId
        data.sequence_number = this.state.sURLVariables
        data.location_id = this.state.locationId
        data.location_name = this.state.locationName || null
        //selected_location
        data.sub_location_id = this.state.selected_location.id || null
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'stockTransfer/recievejob', data)
        ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 100);
        var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=' + this.state.jobId;
        console.log('url', url);
        var scan = await APIService.execute('GET', url, null)
        var i;

        if (scan.data.data.assignment_mapping != null) {
            var responseData = _.map(scan.data.data.assignment_mapping, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })
            for (i = 0; i < responseData.length; i++) {
                this.state.receivedList.push(responseData[i])
            }
        }

        // if (this.props.navigation.state.params.item == 'jobHistory'){
        if (scan.data.data.sequence_ids != null || scan.data.data.sequence_ids.length > 0) {
            for (let i = 0; i < scan.data.data.sequence_ids.length; i++) {
                var seqfull = scan.data.data.sequence_ids[i].sequence_number
                // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
                this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
            }
        }

        var uniq = _.uniqBy(this.state.receivedList, 'sequence_number')
        this.setState({
            receivedData: uniq, job_detail: scan.data.data.stockdetails[0], count: this.state.count + 1, model: true
        }, () => console.log('level wise data', this.state.receivedData))
        // }


        // this.setState({receivedData:responseData})
    }

    playSound() {
        const mySound = new Sound('beep_08.mp3', Sound.MAIN_BUNDLE, (e) => {
            if (e) {
                console.log('error', e);
            } else {
                console.log('duration', mySound.getDuration());
                mySound.play();
            }
        });
    }

    async cancelJob() {
        this.refs.modal6.close()
        var data = {}
        data.job_type = this.state.job_detail ? this.state.job_detail.job_type : "Recieve"
        data.job_id = this.state.jobId
        data.location_name = this.state.locationName
        var cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + 'stockTransfer/canceljob', data)
        if (cancelJobresponse.data.status_code == 200) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            if(this.state.DashboardRoute){
                this.props.navigation.navigate('Dashboard')
            }
            else{
                this.props.navigation.dispatch(resetAction)
            }          
        }
    }

    async getReceivedata() {
        var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=' + this.state.jobId;
        // var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=1022';
        var scan = await APIService.execute('GET', url, null)
        this.setState({ job_detail: scan.data.data.stockdetails[0], Updatedata: scan.data.data.assignment_mapping }, () => {
            // if (scan.data.data.assignment_mapping.length > 0 ? this.state.Updatedata[0].level_id == 2 : false) {
            //     console.log("levels1[i].level_id:", this.state.Updatedata[0].level_id)
            //     this.setState({ levels: true })
            // }
        })

    }

    async expandReceivedata(seqnum, index) {
        // var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=1079&sequence_number=' + seqnum;
        var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=' + this.state.jobId + '&sequence_number=' + seqnum;
        // var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=860&sequence_number=21023458099';
        var scan = await APIService.execute('GET', url, null)
        var i;
        var responseData = null
        if (scan.data.data.assignment_mapping != null) {
            responseData = _.map(scan.data.data.assignment_mapping, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })
        }

        if (responseData != null) {
            for (i = 0; i < responseData.length; i++) {
                // this.state.receivedList.push(scan.data.data.assignment_mapping[i])
                this.state.receivedData.splice(index + 1, 0, responseData[i])
            }
        }

        var uniq = _.uniqBy(this.state.receivedData, 'sequence_number')
        this.setState({ receivedData: uniq }, () => {
            console.log("update:", this.state.receivedData)
        })

        // if (this.props.navigation.state.params.item == 'jobHistory') {
        for (let i = 0; i < this.state.receivedData.length; i++) {
            var seqfull = this.state.receivedData[i].sequence_number
            // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
            this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
        }
        // }

    }

    onScan(session) {
        this.scanner.pauseScanning();
        if (this.state.delete) {
            this.setState({ data: session.newlyRecognizedCodes[0].data });
            var sURLVariables = session.newlyRecognizedCodes[0].data.split('/')[3]
            this.playSound()
            this.setState({ data: session.newlyRecognizedCodes[0].data, delete: true, sURLVariables: sURLVariables }, () => {
                this.Updatedata();
            })


        } else {
            var sURL_Variables = session.newlyRecognizedCodes[0].data.split('/')[3]
            this.playSound()
            this.setState({ data: session.newlyRecognizedCodes[0].data, delete: true, sURLVariables: sURL_Variables }, () => {
                this.Updatedata();
            })
        }
        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            this.scanner.resumeScanning();
        }.bind(this), 5000)
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible },async()=>{
            var response = await APIService.execute('GET', APIService.URLBACKEND + APIService.getSubLocationList + '?parent_location_id=' + this.state.locationId, null)
            console.log("reponse location:",response)
            this.setState({Sub_location:response.data.data},()=>{
                if(this.state.Sub_location.length==0){
                    this.setState({isModalVisible:false})
                    ToastAndroid.show('No Sub-location found. Please contact the administrator', ToastAndroid.LONG, 25, 50)
                }
            })

        });
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

    onSuccess = e => {
        Linking
        // console.log("item link scan:",e)
        if(this.state.selected_location){
            if (this.state.delete) {
                this.setState({ data: e });
                console.log("delete:true:", e)

                var sURLVariables = e.data.split('/')[3]
                console.log("sURLVariables:", sURLVariables);
                this.playSound()

                this.setState({ data: e, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                    console.log("item link scan:", e)
                    setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                    this.Updatedata();

                })


            } else {
                var sURL_Variables = e.data.split('/')[3]
                console.log("sURLVariables:", sURLVariables);
                this.playSound()

                this.setState({ data: e, delete: true, sURLVariables: sURL_Variables, seqnumber: { ...this.state.seqnumber, [sURL_Variables]: !this.state.seqnumber[sURL_Variables] } }, () => {
                    console.log("item link scan:", e)
                    setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                    this.Updatedata();
                })
            }
        }
        else{
            ToastAndroid.show('Please Select Sub Location', ToastAndroid.LONG, 25, 50);

        }
    };


   


    getLevelwisemargin(level) {
        if (level == 9) {
            return wp('1%')
        }
        else if (level == 8) {
            return wp('1.5%')
        }
        else if (level == 7) {
            return wp('2%')
        }
        else if (level == 6) {
            return wp('2.5%')
        }
        else if (level == 5) {
            return wp('3%')
        }
        else if (level == 4) {
            return wp('4%')
        }
        else if (level == 3) {
            return wp('5%')
        }
        else if (level == 2) {
            return wp('6%')
        }
        else if (level == 1) {
            return wp('7%')
        }
    }

    getLevelwisecolor(level) {
        if (level == 9) {
            return '#F5A623'
        }
        else if (level == 8) {
            return '#8B572A'
        }
        else if (level == 7) {
            return '#417505'
        }
        else if (level == 6) {
            return '#B325D0'
        }
        else if (level == 5) {
            return '#F76D9D'
        }
        else if (level == 4) {
            return '#33B4E4'
        }
        else if (level == 3) {
            return '#4A90E2'
        }
        else if (level == 2) {
            return '#50E3C2'
        }
        else if (level == 1) {
            return '#FFFFFF'
        }
    }


    


    renderJobdetails() {
        const fontSize = 11
        if (this.state.job_detail != '') {
            return (
                <View style={{
                    flex: 1, shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowColor: '#CECECE',
                    shadowRadius: 3,
                    borderRadius: 5,
                    // marginLeft: wp('4%'),
                    // marginRight: wp('4%'),
                    marginBottom: wp('4%'),
                    width: wp('94%'),
                    padding: wp('2%'),
                    flexDirection: 'column',
                    elevation: 4,
                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <View style={{ flex: 1, justifyContent: 'flex-start', marginLeft: wp('2%'), marginRight: wp('2%'), marginTop: wp('2%'), flexDirection: 'column' }}>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{this.state.jobId ? this.state.jobId : '---'}</Text>
                        </View>
                        <View style={{ width: wp('29%'), height: wp('5%'), marginLeft: wp('2%'), marginRight: wp('2%'), marginTop: wp('2%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#F3DDB6' }}>
                            <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>{this.state.job_detail ? this.state.job_detail.status : '---'}</Text>
                        </View>

                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                    }}>
                        <Text style={{ justifyContent: 'flex-start', marginLeft: wp('2%'), marginRight: wp('2%'), alignItems: 'flex-start', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize,}}>Job type: Receive</Text>
                    </View>
                    <View style={{ width: wp('86%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginLeft: wp('2%'), marginRight: wp('2%'), marginTop: wp('2%') }} />
                    <View style={{ width: wp('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: wp('2%'), marginLeft: wp('1%') }}>
                        <View style={{ flex: 1, width: wp('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: wp('1%') }}>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Created Date:</Text>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.job_detail ? moment(this.state.job_detail.created_at).format('DD MMM YYYY') : '---'}</Text>
                        </View>

                        <View style={{ flex: 1, width: wp('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: wp('1%') }}>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Created by:</Text>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.job_detail ? this.state.job_detail.created_by : '---'}</Text>
                        </View>
                    </View>
                </View>
            )
        }

    }



    renderScandetails() {
        const fontSize = 11
        if (this.state.model) {
            return (
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3FD' }}>
                    <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{
                            flexDirection: 'row', width: wp('30%'), height: wp('8%'), shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowColor: '#CECECE',
                            shadowRadius: 3,
                            borderRadius: 34,
                            marginLeft: wp('4%'),
                            marginBottom: wp('1%'),
                            elevation: 4,
                            backgroundColor: '#65CA8F', justifyContent: 'center', alignItems: 'center',
                        }}>
                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>Total Scan:</Text>
                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>{this.state.receivedData ? this.state.receivedData.length : '0'}</Text>
                        </View>

                        <TouchableOpacity style={{
                            flexDirection: 'row', width: wp('30%'), height: hp('5%'), shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowColor: '#CECECE',
                            shadowRadius: 3,
                            borderRadius: 34,
                            marginLeft: wp('4%'),
                            marginBottom: wp('1%'),
                            margin: wp('2%'),
                            elevation: 4,
                            backgroundColor: '#FE3547', justifyContent: 'center', alignItems: 'center',
                        }}
                        // onPress={() => this.props.navigation.navigate('LinkEditProduct')}
                        onPress={() => this.state.receivedData.length == 0 ? ToastAndroid.show("There is no Item to Delete.", ToastAndroid.LONG, 25, 50) : this.state.receivedData.length === 0 ? ToastAndroid.show("There is No Item to Delete.", ToastAndroid.LONG, 25, 50)  : this.props.navigation.navigate('Deletebyscan', { item: this.state.seqnumber, jobId: this.state.job_detail.job_id, jobType: this.state.job_detail.job_type, jobhistroy: this.props.navigation.state.params.item})}
                        >
                            <SvgUri width="15" height="15" fill={"#FFFFFF"} svgXmlData={svgImages.qr_code} style={{ marginRight: wp('1%'), resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }} />
                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center', color: '#fff' }}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{
                        width: wp('94%'),
                        height: wp('10%'),
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowColor: '#CECECE',
                        shadowRadius: 3,
                        marginTop:hp('2%'),
                        elevation: 4,
                        backgroundColor: '#FFFFFF',
                        flexDirection: 'row',
                        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                    }} onPress={this.toggleModal}>
                        <Text style={styles.Sublocation}>{this.state.selected_location?this.state.selected_location.itemName : "Select a Sub Location"}</Text>
                        <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                    </TouchableOpacity>
                    <View style={{ width: wp('91%'), marginTop: hp('2%'), }}>
                        <FlatList
                            extraData={this.state.receivedData}
                            data={this.state.receivedData}
                            renderItem={({ item, index }) => {
                                var checkLevel = false;
                                if (item.level_id > 1) {
                                    checkLevel = true
                                }

                                return (
                                    <View style={{
                                        flexDirection: 'row',
                                        backgroundColor: item.level_id >= 2 ? color.gradientEndColor : '#4A90E2',
                                        shadowOpacity: 0.8,
                                        height: wp('8%'),
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3, elevation: 2, borderRadius: 5,
                                        margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginVertical: hp('0.5%'), marginLeft:  this.marginlevel(item)
                                    }}>
                                        <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
                                            flexDirection: 'row', borderRadius: 5,
                                            margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center',
                                        }} >
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff', justifyContent: 'flex-start',alignSelf: 'center',  }}>{item.level_name} :</Text>
                                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5, justifyContent: 'flex-start',alignSelf: 'center',  }}>{item.sequence_number || '---'}</Text>
                                                {item.level_id == 1 ? <Text numberOfLines={1} style={{flex:1, fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5,alignSelf: 'center',  }}>- {item.product_name || '---'}</Text> : null}
                                            </View>

                                            {item.level_id >= 2 ? this.plusimages(item) : null}
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        //  keyExtractor={item => item.assignment_mapping_id}
                        />
                    </View>
                    {/* {
                        this.state.receivedData != '' ? <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: 'center' }}>
                            {this.renderLevelwisedata()}
                        </View> : null
                    } */}
                </View>
            )
        }
    }

    checkLevel(item, index) {
        console.log('Mode::',item.mode)
        var responseData = _.map(this.state.receivedData, (data) => {
            if (data.assignment_mapping_id == item.assignment_mapping_id) {
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
            receivedData: responseData
        }, () => {
            var check = true

            var array = this.state.receivedData.filter(function (x) {
                if (x.level_id < item.level_id) {
                    check = false
                }
                if( x.level_id < item.level_id && x.parent_sequence_number==null){
                    return x
                }
                return x.level_id >= item.level_id
            });
            // var findIndex = array.findIndex(item.sequence_number)
            console.log('findIndex:',array)

            if (array) {
                if (item.mode == 'Collapsed') {
                    var responseData = _.map(array, (data, indexes) => {
                        if (data.assignment_mapping_id != item.assignment_mapping_id && data.level_id == item.level_id) {
                            return {
                                ...data,
                                mode: data.mode = 'Collapsed'
                            }
                        }
                        else if (data.assignment_mapping_id == item.assignment_mapping_id) {
                            if (item.mode == 'Collapsed') {
                                this.expandReceivedata(item.sequence_number, indexes)
                                console.log('working 1',indexes)

                            }
                            return { ...data }
                        }
                        else {
                            return { ...data }
                        }
                    })
                    this.setState({ receivedData: responseData })
                }
                else {
                    this.setState({
                        receivedData: array
                    })
                }
            }
            if (check) {
                this.expandReceivedata(item.sequence_number, index)
            }

        })
    }

    renderLevelwisedata() {
        const fontSize = 11
        if (this.state.receivedData != null && _.isArray(this.state.receivedData)) {
            return (
                <View style={{
                    flex: 1, shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowColor: '#CECECE',
                    shadowRadius: 3,
                    borderRadius: 5,
                    marginBottom: wp('4%'),
                    width: wp('94%'),
                    padding: wp('2%'),
                    flexDirection: 'column',
                    elevation: 4,
                    backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                }}>

                    < FlatList
                        style={{
                            flex: 1
                        }
                        }
                        extraData={this.state.receivedData}
                        data={this.state.receivedData}
                        renderItem={({ item, index }) => (
                            <View style={{
                                flex: 1,
                                width: wp('90%'),
                                // padding: wp('1%'),
                                flexDirection: 'column',
                                justifyContent: 'flex-start', alignItems: 'flex-start', 
                            }}>
                                <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
                                    flex: 1, flexDirection: 'row', backgroundColor: item.level_id >= 2 ?  color.gradientEndColor : '#4A90E2',
                                    shadowOpacity: item.level_id >= 2 ? 0.8 : null,
                                    height: wp('8%'),
                                    shadowColor: item.level_id >= 2 ? '#CECECE' : null,
                                    shadowRadius: item.level_id >= 2 ? 3 : null, elevation: item.level_id >= 2 ? 2 : null, borderRadius: 5,
                                    margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: item.level_id == 1 ? wp('8%') : item.level_id == 2 ? wp('6%') : item.level_id == 3 ? wp('4%') : null
                                }} >
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff' }}>{item.level_name} :</Text>
                                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
                                            {item.level_id == 1 ? <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5 }}>- {item.product_name || '---'}</Text> : null}
                                        </View>
                                    {item.level_id >= 2 ? this.plusimages(item) : null}
                                </TouchableOpacity>
                            </View>
                        )
                        }
                        keyExtractor={item => item.sequence_number}
                    />

                    
                </View>

            )
        }
        else {
            return null;
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

    renderInfo() {
        const fontSize = 11
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3FD' }}>
                <View style={{
                    flex: 1, shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowColor: '#CECECE',
                    shadowRadius: 3,
                    borderRadius: 5,
                    // marginLeft: wp('4%'),
                    // marginRight: wp('4%'),
                    marginBottom: wp('4%'),
                    width: wp('94%'),
                    padding: wp('2%'),
                    flexDirection: 'column',
                    elevation: 4,
                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <View style={{ flex: 1, justifyContent: 'flex-start', marginLeft: wp('2%'), marginRight: wp('2%'), marginTop: wp('2%'), flexDirection: 'column' }}>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{this.state.jobId != '' ? this.state.jobId : '---'}</Text>
                        </View>
                        <View style={{ width: wp('29%'), height: wp('5%'), marginLeft: wp('2%'), marginRight: wp('2%'), marginTop: wp('2%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#F3DDB6' }}>
                            <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>{this.state.job_detail ? this.state.job_detail.status : '---'}</Text>
                        </View>

                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                    }}>
                        <Text style={{ justifyContent: 'flex-start', marginLeft: wp('2%'), marginRight: wp('2%'), alignItems: 'flex-start', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize, }}>Job type: Receive</Text>
                    </View>
                    <View style={{ width: wp('86%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginLeft: wp('2%'), marginRight: wp('2%'), marginTop: wp('2%') }} />
                    <View style={{ width: wp('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: wp('2%'), marginLeft: wp('1%') }}>
                        <View style={{ flex: 1, width: wp('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: wp('1%') }}>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Created Date:</Text>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.job_detail ? moment(this.state.job_detail.created_at).format('DD MMM YYYY') : '---'}</Text>
                        </View>

                        <View style={{ flex: 1, width: wp('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: wp('1%') }}>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Created by:</Text>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.job_detail ? this.state.job_detail.created_by : '---'}</Text>
                        </View>
                    </View>
                </View>

            </View>
        )
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


    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: wdt * -0.16
            },
            to: {
                [translationType]: fromValue
            }
        };
    }


    marginlevel(item){
        if(item.level_id == 1) { 
            if((item.level_id == 1 && item.child_count == 0 && item.mode == 'Collapsed') || (item.level_id == 1 && item.parent_sequence_number === null)){
                return null;

            }
            else{
                console.log("leve id 1 false")

                return wp('8%') 
            }
        }
        else if(item.level_id == 2){
            if(item.level_id == 2 && item.parent_sequence_number==null){
                console.log("leve id 2 true")
                return null
            }
            else{
                console.log("leve id 2 false")
                return wp('6%') 
                
            }
        }
        else if(item.level_id == 3 ) { 
            if(item.level_id == 3 && item.parent_sequence_number==null){
                return null
            }
            else{
                return wp('4%') 
            }
        }
        else{
            return null
        } 
    }

    DashboardRoute(){
        this.setState({DashboardRoute:true},()=>{
            this.refs.modal6.open()
        })
    }

    render() {
        const hgt = Dimensions.get("window").height
        const wdt = Dimensions.get("window").width
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1F3FD' }}>
                <Headers isHome={true} onBackHome={() => { this.DashboardRoute() }}  label={this.state.job_detail ? 'Receive Stock - ' + this.state.job_detail.stockdetails_id : 'Receive Stock'} onBack={() => { this.refs.modal6.open() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <NavigationEvents
                        onDidFocus={() => this.setState({ showCamera: true })}
                        onWillBlur={() => this.setState({ showCamera: false })}
                    />
                <ScrollView>
                    {
                        this.state.deviceModel == 'TC20' ?
                            <TouchableOpacity
                                onPress={() => this.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", 'TOGGLE_SCANNING')}
                                style={{
                                    flex: 1,
                                    height: wp('12%'),
                                    marginRight: wp('7%'),
                                    marginHorizontal: wp('6%'),
                                    marginTop: wp('2%'),
                                    marginBottom: wp('5%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#65CA8F',
                                    borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                }}>
                                <Text style={styles.btntext}>{'SCAN'}</Text>
                            </TouchableOpacity> :
                            this.state.showCamera?
                            <QRCodeScanner
                                onRead={this.onSuccess.bind(this)}
                                cornerOffsetSize={3}
                                showMarker={true}
                                reactivate={true}
                                reactivateTimeout={5000}
                                markerStyle={{
                                    borderWidth: 2,
                                    borderColor: '#1A6DD5',
                                    borderRadius: 4,
                                }}
                                // topContent={this.toprender()}
                                // bottomContent={this.bottomrender()}
                                customMarker={
                                    <View style={styles.rectangleContainer}>
                                        <View style={styles.topOverlay} />

                                        <View style={{ flexDirection: "row" }}>
                                            <View style={styles.leftAndRightOverlay} />

                                            <View style={styles.rectangle}>
                                                <View style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    height: 25,
                                                    width: 25,
                                                    borderColor: '#FFFFFF',
                                                    borderLeftWidth: 3,
                                                    borderTopWidth: 3,
                                                }} />
                                                <View style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    height: 25,
                                                    width: 25,
                                                    borderColor: '#FFFFFF',
                                                    borderLeftWidth: 3,
                                                    borderBottomWidth: 3,
                                                }} />

                                                <Animatable.View
                                                    style={styles.scanBar}
                                                    direction="alternate-reverse"
                                                    iterationCount="infinite"
                                                    duration={1800}
                                                    easing="linear"
                                                    animation={this.makeSlideOutTranslation(
                                                        "translateY",
                                                        wdt * -0.74
                                                    )}
                                                />
                                                <View style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    height: 25,
                                                    width: 25,
                                                    borderColor: '#FFFFFF',
                                                    borderRightWidth: 3,
                                                    borderTopWidth: 3,
                                                }} />
                                                <View style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                    height: 25,
                                                    width: 25,
                                                    borderColor: '#FFFFFF',
                                                    borderRightWidth: 3,
                                                    borderBottomWidth: 3,
                                                }} />
                                            </View>

                                            <View style={styles.leftAndRightOverlay} />
                                        </View>

                                        <View style={styles.bottomOverlay} />
                                    </View>
                                }

                                checkAndroid6Permissions={true}
                                ref={elem => {
                                    this.scanner = elem;
                                }}
                                cameraStyle={{
                                    height: this.state.model || this.state.delete ? this.state.receivedData ?
                                        this.state.receivedData === undefined || this.state.receivedData == [] ? hgt : hgt - wp('103%') : hgt - wp('18.1%') : hgt - wp('18.1%')
                                }}
                            >
                            </QRCodeScanner>:null

                    }

                    {this.renderScandetails()}





                    {/* <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center', marginBottom: wp('2%')
                    }}> */}


                    {/* </View> */}
                </ScrollView>
                {
                        this.state.receivedData != '' ?

                    <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                                <TouchableOpacity onPress={() => this.cancelJob()}>
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
                                <TouchableOpacity
                                    onPress={() => {
                                        this.refs.modal6.close()
                                        this.props.navigation.navigate('RecieveScanSummary', { item: this.state.jobId, url: this.state.seqnumber, jobhistroy: this.props.navigation.state.params.item })
                                    }}
                                >
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
                                            this.state.loadingsave === true ? (
                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ paddingRight: 10 }}>
                                                        <ActivityIndicator size={'small'} color='#FFFFFF' />
                                                    </View>
                                                    <View>
                                                        <Text style={styles.btntext}>Please Wait...</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={styles.btntext}>{'Continue'}</Text>
                                                    </View>
                                                )
                                        }
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View> : null
                    }
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                    backdropPressToClose={false}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                        <TouchableOpacity style={{ width: wp('10%'), height: hp('5%'), justifyContent: 'center', alignSelf: 'flex-end', alignItems: 'flex-end'}} onPress={() => { this.refs.modal6.close() }} >
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
                                        if (this.state.DashboardRoute) {
                                            this.refs.modal6.close()
                                            this.props.navigation.navigate('Dashboard')
                                        }
                                        else {
                                            this.refs.modal6.close()
                                            this.props.navigation.dispatch(resetAction)
                                        }
                                    }
                                    }
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
                                    }}
                                >
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567', textAlign: 'center' }}>Cancel job</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
                {this.state.Sub_location.length>0 ? (
                    <SearchableDropdown
                        title={'Select a Sub Location'}
                        data={this.state.Sub_location}
                        onSelect={(selectedItem) => {
                            this.setState({ selected_location: selectedItem, isModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisible: false }) }}
                        isVisible={this.state.isModalVisible === true} />) : null}
            </Container>

        )

    }
}

const overlayColor = "rgba(0,0,0,0.7)"; // this gives us a black color with a 50% transparency
const wdt = Dimensions.get("window").width

const rectDimensions = wdt * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = wdt * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "#1A6DD5";

const scanBarWidth = wdt * 0.56; // this is equivalent to 180 from a 393 device width
const scanBarHeight = wdt * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#22ff00";

const iconScanColor = "#FFFFFF";

export default withNavigation(ReceiveScanStock);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    btntext: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    btntextcancel: {
        color: '#000000',
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
    rectangleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },

    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        // borderWidth: rectBorderWidth,
        borderColor: rectBorderColor,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },

    topOverlay: {
        flex: 1,
        height: wdt,
        width: wdt,
        backgroundColor: overlayColor,
        justifyContent: "center",
        alignItems: "center"
    },

    bottomOverlay: {
        flex: 1,
        height: wdt,
        width: wdt,
        backgroundColor: overlayColor,
        // paddingBottom: wdt * 0.25
    },

    leftAndRightOverlay: {
        height: wdt * 0.65,
        width: wdt,
        backgroundColor: overlayColor
    },

    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        marginTop: wp('90%'),
        backgroundColor: scanBarColor
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
    buttonCancel: {
        fontSize: hp('2.5%'),
        color: '#000000',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    Sublocation:{
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    }
});