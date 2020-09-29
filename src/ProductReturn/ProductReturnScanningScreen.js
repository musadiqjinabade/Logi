import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, StyleSheet, Linking, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator, AppState, Platform, PermissionsAndroid, BackHandler, DeviceEventEmitter, AsyncStorage } from 'react-native';
import { withNavigation, NavigationActions, StackActions, NavigationEvents } from 'react-navigation';
import { Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import QRCodeScanner from "react-native-qrcode-scanner";
import svgImages from '../Images/images';
import * as Animatable from "react-native-animatable";
import Modal from 'react-native-modalbox';
import APIService from '../component/APIServices';
import Sound from 'react-native-sound';
import color from '../component/color';
import DataWedgeIntents from 'react-native-datawedge-intents';
const _ = require('lodash');
import { ScanditModule, Barcode, ScanSettings } from 'scandit-react-native';
import Headers from '../component/Headers';
import SearchableDropdown from '../Assign/All/searchablebleDropdown';

ScanditModule.setAppKey('AXZORj2nI0ZMHjyLexkWTD4mrkrjAEPrtXgCuecYbnjOFdU2d23g4BJzs00JbnSO9kZAtpNswn8ATLqojjZJ/zdz7cwHRaD3dxaoV/VDmq+bYuAxWjA/tTsxsMngOuBhZTdlDeMaFiuBYAOCQ3ldwMdCLOSZLmo1ltZ59+gN01VbmCtcFAiZKWwF4+5a5Hi1DQLxcGLgOtGJzGKs/rWsXKXKxTIazPt2z2VM+dK1y15HR9lI3RAKV5JWpoxKPIXrHij7fNep4cdwOWXnps4NQy7w4USWe9iWo7J/IC4IrmHAbz/QkOR1ZZiMOJmOF9ME9Ty3eMmIAEZSPIbcREpUmDwtMVJHcH02cMF1AExn1cdeinIWPNitXETQR0RCNfJJVwL3ktcUkqo9lmSySZHRdKNM87laMm11SqF60IX5koMGGADrVaw8yb2Zxvk1EHzaT6J+0gQmc50QbUt051D6yTlmGJkWUfRnRIHqqcFrWMNeL8fNbl0l3ewIOmDl06nddaTFqHKTVPR+LCugEXjN4xZvOIwA4RlBrXnvLcL10DuTN30mavL0FeqZ/v33s95D5yKIAmgGpIakYljrxoeuvb+OI8E3r7eBx2iJ6ycfXztY6q3kIqeL2Xva4bH23EmlvV1VAQ21iaiTc6eX5+9Q+3XJSDLPYHDKn1srwI2zzEx68IopPQUKQpui6hVIlbPTPBRwNNi1vgqu132Qp7k5zXlxt6NAisMHzeCIQgBOfaDjHDVwWFMcC6drp53LtQFVCru/gPAz2ttDocEZm0Rgr0reHrWups6jo4afQLzkhbLqQ5md4Hw=');
const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'ProductReturn' })],
});
const resetAction1 = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});
class ProductReturnScanningScreen extends Component {
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
            Updatedata: '',
            message: '',
            job_detail: '',
            dispatch: '',
            seqnumber: {},
            locationName: '',
            deviceEventdata: '',
            jobId: '',
            locationId: '',
            expanded: true,
            locationData: '',
            isModalVisible: false,
            selectedSublocationName: '',
            selectedSublocationId: '',
            isHomePressed: false,
            ShowData: ''
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
        var qr = JSON.stringify(intent.RESULT_INFO)
        console.log('Result', qr);
        // var qrdata = qr[com.symbol.datawedge.data_string]
        // console.log('qrcode',qrdata)
        if (intent.hasOwnProperty('RESULT_INFO')) {
            var commandResult = intent.RESULT + " (" +
                intent.COMMAND.substring(intent.COMMAND.lastIndexOf('.') + 1, intent.COMMAND.length) + ")";// + JSON.stringify(intent.RESULT_INFO);
            this.commandReceived(commandResult.toLowerCase());
        }

        if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_VERSION_INFO')) {
            //  The version has been returned (DW 6.3 or higher).  Includes the DW version along with other subsystem versions e.g MX  
            var versionInfo = intent['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO'];
            console.log('Version Info: ' + JSON.stringify(versionInfo));
            var datawedgeVersion = versionInfo['DATAWEDGE'];
            console.log("Datawedge version: " + datawedgeVersion);


        }
        else if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS')) {
            //  Return from our request to enumerate the available scanners
            // var enumeratedScannersObj = intent['com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS'];
            // this.enumerateScanners(enumeratedScannersObj);
        }
        else if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE')) {
            //  Return from our request to obtain the active profile
            // var activeProfileObj = intent['com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'];
            // this.activeProfile(activeProfileObj);
        }
        else if (!intent.hasOwnProperty('RESULT_INFO')) {
            //  A barcode has been scanned
            console.log('inside Result info', intent);
            // this.barcodeScanned(intent, new Date().toLocaleString());
        }
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


    async componentDidMount() {
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });
        var model = await AsyncStorage.getItem('deviceModel')
        this.setState({
            model: true, dispatch: this.props.navigation.state.params.item1,
            props: this.props.navigation.state.params.item != 'jobHistory' ? this.props.navigation.state.params.item : this.props.navigation.state.params.stockDetails,
            deviceModel: model,
            recipient_id: this.props.navigation.state.params.item != 'jobHistory' ? this.props.navigation.state.params.item.recipient_id : this.props.navigation.state.params.recipient_id,
            jobId: this.props.navigation.state.params.item != 'jobHistory' ? this.props.navigation.state.params.item.jobid : this.props.navigation.state.params.id,
        }, () => {
            console.log("prop data:", this.state.props, this.state.dispatch)
        });
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            this.getSubLocation();
            this.getReceivesummary();
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

    scabByZebra(session) {
        console.log('session.data', session.data)
        var sURLVariables = session.data != null ? session.data.split('/')[3] : null
        console.log("sURLVariables:", sURLVariables);
        // this.playSound()
        if (session.data != null) {
            this.setState({ data: session.data, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                console.log("seq number", this.state.seqnumber)
                if (this.state.selectedSublocationId) {
                    this.Updatedata();
                }
                else {
                    ToastAndroid.show("Select Sub Location", ToastAndroid.LONG, 25, 50);
                }
            })
        }


        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            // this.scanner.resumeScanning();
        }.bind(this), 5000)
    }


    async Updatedata() {
        var data = {}

        data.return_id = this.state.jobId
        data.sequence_number = this.state.sURLVariables
        data.sub_location_id = this.state.selectedSublocationId
        data.location_name = this.state.locationName
        data.location_from = this.state.locationId

        console.log("data : ", data)
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + APIService.executeProductReturnJob, data)
        if (Updatedata.data.status_code === 200) {
            ToastAndroid.show(Updatedata.data.data.message, ToastAndroid.LONG, 25, 50);
            this.getReceivesummary();
        }
        else if (Updatedata.data.status_code === 400) {
            if (Updatedata.data.message == "Validation failed" && Updatedata.data.data.error.length > 0) {
                this.setState({ ShowData: Updatedata.data.data.error }, () => {
                    this.refs.showDetails.open()
                })
            }
            else if (Updatedata.data.message) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);

            }
        }
        else {
            ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
        }
    }

    async getSubLocation() {
        var response = await APIService.execute('GET', APIService.URLBACKEND + APIService.getSubLocationList + '?parent_location_id=' + this.state.locationId, null)
        console.log("response : ", response)
        this.setState({ locationData: response.data.data })
    }

    async getReceivesummary() {
        this.setState({ scannerload: true })
        var scan = await APIService.execute('GET', APIService.URLBACKEND + APIService.getReturnSummary + '?return_id=' + this.state.jobId + "&sequence_number=null&location_id=null", null)
        console.log("scan.data : ", scan.data)
        if (scan.data.status_code !== 400) {
            this.setState({ scannerload: false })
            this.setState({ Updatedata: scan.data.data.stockdetails, job_detail: scan.data.data.stockdetails[0] }, () => {
                var seqnumber = []
                if (scan.data.data.sequence_ids != null || scan.data.data.sequence_ids.length > 0) {
                    for (let i = 0; i < scan.data.data.sequence_ids.length; i++) {
                        var seqfull = scan.data.data.sequence_ids[i].sequence_number
                        // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
                        this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
                    }
                }
                console.log("scan.data.data.sequence_ids : ", scan.data.data.sequence_ids)
                console.log("seq : ", this.state.seqnumber)

                if (seqnumber.length > 0) {
                    const responseData = _.map(scan.data.data.assignment_mapping, (item) => {
                        return {
                            ...item,
                            mode: 'Collapsed'
                        }
                    })

                    this.setState({
                        job_detail: scan.data.data.stockdetails[0], Updatedata: responseData,
                    }, () => {
                        if (scan.data.data.assignment_mapping.length > 0 ? this.state.Updatedata[0].level_id == 2 : false) {
                            this.setState({ levels: true })
                        }
                    })
                }
                else {
                    const responseData = _.map(scan.data.data.assignment_mapping, (item) => {
                        return {
                            ...item,
                            mode: 'Collapsed'
                        }
                    })
                    this.setState({ job_detail: scan.data.data.stockdetails[0], Updatedata: responseData }, () => {
                        if (scan.data.data.assignment_mapping.length > 0 ? this.state.Updatedata[0].level_id == 2 : false) {
                            this.setState({ levels: true })
                        }
                    })
                }

            })
        }
        else {
            this.setState({ Updatedata: '', scannerload: false })
            ToastAndroid.show(scan.data.message, ToastAndroid.LONG, 25, 50);
        }
    }

    checkLevel(item, index) {
        var responseData = _.map(this.state.Updatedata, (data) => {
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
                    var responseData1 = _.map(array, (data, indexes) => {
                        if (data.assignment_mapping_id != item.assignment_mapping_id && data.level_id == item.level_id) {
                            return {
                                ...data,
                                mode: data.mode = 'Collapsed'
                            }
                        }
                        else if (data.assignment_mapping_id == item.assignment_mapping_id) {
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
                    this.setState({ Updatedata: responseData1 })
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
        console.log("before push :", index, this.state.Updatedata)

        var url = APIService.URLBACKEND + APIService.getExpandedData + '?job_id=' + this.state.jobId + '&sequence_number=' + seqnum + '&job_type=Return';
        var scan = await APIService.execute('GET', url, null)
        var i;
        if (scan.data.data != null) {
            var responseData = _.map(scan.data.data, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })
        }

        if (scan.data.data != null) {
            for (i = 0; i < responseData.length; i++) {
                // this.state.receivedList.push(scan.data.data.assignment_mapping[i])
                this.state.Updatedata.splice(index + 1, 0, responseData[i])
            }
        }
        console.log("after push update:", index, this.state.Updatedata)

        var uniq = _.uniqBy(this.state.Updatedata, 'sequence_number')
        console.log("sequence_number uniq:", uniq)

        this.setState({ Updatedata: uniq }, () => {
            console.log("update:", this.state.Updatedata)
        })

        if (this.props.navigation.state.params.item == 'jobHistory') {
            for (let i = 0; i < scan.data.data.length; i++) {
                var seqfull = scan.data.data[i].sequence_number
                // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
                this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
            }
        }

    }



    async cancelJob() {
        this.refs.modal6.close()
        var data = {}
        data.job_type = "Return"
        data.job_id = this.state.jobId
        data.location_name = this.state.locationName
        var cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + APIService.cancelJob, data)
        console.log('cancelJobresponse', cancelJobresponse);
        if (cancelJobresponse.data.status_code == 200) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            this.state.isHomePressed ? this.props.navigation.dispatch(resetAction1) :
                this.props.navigation.dispatch(resetAction)
        }
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

    onScan(session) {
        this.scanner.pauseScanning();
        if (this.state.delete) {
            this.setState({ data: session.newlyRecognizedCodes[0].data });
            var sURLVariables = session.newlyRecognizedCodes[0].data.split('/')[3]
            this.playSound()
            this.setState({ data: session.newlyRecognizedCodes[0].data, delete: true, sURLVariables: sURLVariables }, () => {
                if (this.state.selectedSublocationId) {
                    this.Updatedata();
                }
                else {
                    ToastAndroid.show("Select Sub Location", ToastAndroid.LONG, 25, 50);
                }

            })


        } else {
            var sURLVariables = session.newlyRecognizedCodes[0].data.split('/')[3]
            this.playSound()
            this.setState({ data: session.newlyRecognizedCodes[0].data, delete: true, sURLVariables: sURLVariables }, () => {
                if (this.state.selectedSublocationId) {
                    this.Updatedata();
                }
                else {
                    ToastAndroid.show("Select Sub Location", ToastAndroid.LONG, 25, 50);
                }
            })
        }
        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            this.scanner.resumeScanning();
        }.bind(this), 5000)
    };

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


    onSuccess = e => {
        Linking
        // console.log("item link scan:",e)
        if (this.state.delete) {
            this.setState({ data: e });
            console.log("delete:true:", e)

            var sURLVariables = e.data.split('/')[3]
            console.log("sURLVariables:", sURLVariables);
            this.playSound()

            this.setState({ data: e, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                console.log("item link scan:", e)
                setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                if (this.state.selectedSublocationId) {
                    this.Updatedata();
                }
                else {
                    ToastAndroid.show("Select Sub Location", ToastAndroid.LONG, 25, 50);
                }

            })


        } else {
            var sURLVariables = e.data.split('/')[3]
            console.log("sURLVariables:", sURLVariables);
            this.playSound()

            this.setState({ data: e, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                console.log("item link scan:", e)
                setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                if (this.state.selectedSublocationId) {
                    this.Updatedata();
                }
                else {
                    ToastAndroid.show("Select Sub Location", ToastAndroid.LONG, 25, 50);
                }
            })
        }
    };


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

    marginlevel(item) {
        if (item.level_id == 1) {
            if ((item.level_id == 1 && item.child_count == 0 && item.mode == 'Collapsed') || (item.level_id == 1 && item.parent_sequence_number === null)) {
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



    bottomrender = () => {
        const fontSize = 11
        if (this.state.model) {
            return (
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>

                    <ScrollView>
                        <View style={{ flex: 1, flexDirection: 'column', paddingLeft: wp('2%'), paddingRight: wp('2%'), marginBottom: hp('10%') }}>
                            <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                                <View style={{
                                    flexDirection: 'row', width: wp('30%'), height: hp('5%'), shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    borderRadius: 34,
                                    margin: wp('2%'),
                                    elevation: 4,
                                    backgroundColor: '#65CA8F', justifyContent: 'center', alignItems: 'center',
                                }}>
                                    <Text style={{ margin: 2, color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>Total Scan:</Text>
                                    <Text style={{ margin: 2, color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>{this.state.Updatedata ? this.state.Updatedata.length : '0'}</Text>
                                </View>
                                {this.state.job_detail && this.state.job_detail.document_type!=0  ?
                                    <TouchableOpacity style={{
                                        flexDirection: 'row', width: wp('30%'), height: hp('5%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        borderRadius: 34,
                                        margin: wp('2%'),
                                        elevation: 4,
                                        backgroundColor: '#65CA8F', justifyContent: 'center', alignItems: 'center',
                                    }}
                                        onPress={() => this.props.navigation.navigate('ProductReturnCheckValidation', { data: this.state.jobId, job_detail: this.state.job_detail })}>
                                        {/* <SvgUri width="15" height="15" fill={"#FFFFFF"} svgXmlData={svgImages.qr_code} style={{ marginRight: wp('1%'), resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }} /> */}
                                        <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center', color: '#fff' }}>Check</Text>
                                    </TouchableOpacity> : null}

                                <TouchableOpacity style={{
                                    flexDirection: 'row', width: wp('30%'), height: hp('5%'), shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    borderRadius: 34,
                                    margin: wp('2%'),
                                    elevation: 4,
                                    backgroundColor: '#FE3547', justifyContent: 'center', alignItems: 'center',
                                }}
                                    onPress={() => this.state.Updatedata.length === 0 ? alert("There is no item to delete.") : this.props.navigation.navigate('Deletebyscan', { item: this.state.seqnumber, jobId: this.state.jobId, jobType: "Return", jobhistroy: this.props.navigation.state.params.item })}>
                                    <SvgUri width="15" height="15" fill={"#FFFFFF"} svgXmlData={svgImages.qr_code} style={{ marginRight: wp('1%'), resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }} />
                                    <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center', color: '#fff' }}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: hp('1%') }} />
                            <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.header}>Sub Location</Text>
                            </View>
                            <TouchableOpacity style={styles.selectBackgroundStyle} onPress={() => { this.state.locationData && this.state.locationData.length > 0 ? this.setState({ isModalVisible: !this.state.isModalVisible }) : ToastAndroid.show("No Sub Location Available", ToastAndroid.LONG, 25, 50); }}>
                                <Text style={styles.selectSubLocation}>{this.state.selectedSublocationName || "Select Sub Location"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />

                            </TouchableOpacity>
                            <View style={{ marginTop: hp('1%') }} />

                            {
                                this.state.Updatedata ?
                                    this.state.Updatedata === undefined || this.state.Updatedata.length === 0 ? null :

                                        <View style={{
                                            flex: 1, marginTop: hp('2%')
                                        }}>
                                            <FlatList
                                                extraData={this.state.Updatedata}
                                                data={this.state.Updatedata}
                                                renderItem={({ item, index }) => {
                                                    console.log("item : ", item); return (
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            backgroundColor: item.level_id >= 2 ? color.gradientEndColor : '#4A90E2',
                                                            shadowOpacity: 0.8,
                                                            height: wp('8%'),
                                                            shadowColor: '#CECECE',
                                                            shadowRadius: 3, elevation: 2, borderRadius: 5,
                                                            margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginVertical: hp('0.5%'), marginLeft: this.marginlevel(item)
                                                        }}>
                                                            <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
                                                                flexDirection: 'row', borderRadius: 5,
                                                                margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center',
                                                            }} >
                                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff',justifyContent: 'flex-start' }}>{item.level_name} :</Text>
                                                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5, justifyContent: 'flex-start' }}>{item.sequence_number || '---'}</Text>
                                                                    {item.level_id == 1 ? <Text numberOfLines={1} style={{flex:1, fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5 }}>- {item.product_name || '---'}</Text> : null}
                                                                    {item.ishighlighted?<SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.warningflag} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} />:null}
                                                                </View>

                                                                {item.level_id >= 2 ? this.plusimages(item) : null}
                                                            </TouchableOpacity>
                                                        </View>

                                                    )
                                                }}
                                            />
                                        </View> : null

                            }



                        </View>
                    </ScrollView>

                </View>
            )

        }
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

    navigateToDashboard() {
        this.setState({ isHomePressed: true })
        this.refs.modal6.open()
    }

    navigateToDashboard() {
        this.setState({ isHomePressed: true })
        this.refs.modal6.open()
    }


    render() {
        const hgt = Dimensions.get("window").height
        // wdt = Dimensions.get("window").width

        return (
            <Container style={{ flex: 1, backgroundColor: 'white' }}>
                <Headers onBackHome={() => { this.navigateToDashboard() }} isHome={true} label={'Product Return - ' + this.state.jobId} onBack={() => { this.refs.modal6.open() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={{
                    flex: 1,
                    flexDirection: 'column'
                }}>
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
                                this.state.showCamera ?
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
                                            height: hgt - wp('103%')
                                        }}
                                    >
                                    </QRCodeScanner> : null
                        }
                        {this.bottomrender()}

                    </ScrollView>

                    {this.state.Updatedata ?

                        this.state.Updatedata === undefined || this.state.Updatedata.length === 0 ? null :
                            <View style={{ flex: 1 }}>
                                <View style={{
                                    flex: 1, position: 'absolute',
                                    bottom: 0, flexDirection: 'row'
                                }}>

                                    <TouchableOpacity onPress={async () => { this.refs.modal6.open() }}
                                        style={[styles.center, {
                                            marginTop: hp('1%'),
                                            width: wp('50.5%'),
                                            height: hp('8%'),
                                            borderTopLeftRadius: wp('2.5%'),
                                            backgroundColor: '#FFFFFF',
                                            borderWidth: 0.2
                                        }]}>

                                        <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                            <Text style={styles.buttonCancel}>Cancel</Text>
                                        </View>

                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { this.state.Updatedata.length !== 0 ? this.props.navigation.navigate('ProductReturnScanningItemsScreen', { item: this.state.jobId, url: this.state.seqnumber, jobhistroy: this.props.navigation.state.params.item }) : alert("There is no item to delete.") }}>
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

                                            <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                                <Text style={styles.buttonStart}>Continue</Text>
                                            </View>

                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View> : null}


                </View>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <TouchableOpacity style={{ width: wp('10%'), height: hp('5%'), justifyContent: 'center', alignSelf: 'flex-end', alignItems: 'flex-end' }} onPress={() => { this.refs.modal6.close() }} >
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
                                        this.refs.modal6.close()
                                        this.state.isHomePressed ? this.props.navigation.dispatch(resetAction1) :
                                            this.props.navigation.dispatch(resetAction)
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
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"showDetails"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('85%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <Text style={{
                                fontFamily: 'Montserrat-Bold', color: '#1D3567', textAlign: 'center', marginBottom: hp('2%'), fontSize: 16
                            }}>Messages</Text>
                            <FlatList
                                extraData={this.state.ShowData}
                                data={this.state.ShowData}
                                renderItem={({ item, index }) => {
                                    console.log("item : ", item); return (
                                        <View style={{ flexDirection: 'column', marginLeft: wp('6%') }}>
                                            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ fontFamily: 'Montserrat-Bold', color: '#1D3567', textAlign: 'center' }}>{index + 1}: </Text>
                                                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', textAlign: 'center' }}>{item.message}</Text>
                                            </View>
                                        </View>
                                    )
                                }} />
                            <TouchableOpacity style={{
                                justifyContent: 'center', alignSelf: 'center', width: wp('40%'), flexDirection: 'row', shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                borderRadius: 34,
                                marginTop: hp('2%'),
                                elevation: 4,
                                backgroundColor: '#65CA8F',
                                marginBottom: hp('1%')
                            }}
                                onPress={() => {
                                    this.refs.showDetails.close()
                                }}>
                                <Text style={{ justifyContent: 'center', alignSelf: 'center', fontFamily: 'Montserrat-Bold', fontSize: 14, color: '#fff', marginHorizontal: wp('10%'), marginVertical: hp('2%') }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                {this.state.locationData && this.state.locationData.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Sub Location'}
                        data={this.state.locationData}
                        onSelect={(selectedItem) => {
                            this.setState({ selectedSublocationName: selectedItem.itemName, selectedSublocationId: selectedItem.id, isModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisible: false }) }}
                        isVisible={this.state.isModalVisible === true} />) : null}
            </Container>

        );
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

export default withNavigation(ProductReturnScanningScreen);

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
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
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
    buttonStart: {
        fontSize: wp('5%'),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    buttonCancel: {
        fontSize: wp('5%'),
        color: '#000000',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectBackgroundStyle: {
        height: wp('10%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
    },
    header: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectSubLocation: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    },
});