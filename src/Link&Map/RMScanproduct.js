import {
    Text, View, FlatList, StatusBar, StyleSheet, Linking, AsyncStorage, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator,
    AppState,
    Platform,
    PermissionsAndroid,
    BackHandler, DeviceEventEmitter
} from 'react-native';
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
import Headers from '../component/Headers';
import color from '../component/color';
import Sound from 'react-native-sound';
import DataWedgeIntents from 'react-native-datawedge-intents';
import React, { Component } from 'react';
import {
    ScanditModule,
    Barcode,
    ScanSettings
} from 'scandit-react-native';
const _ = require('lodash');

// const color = [
//     {
//         id: 10,
//         color: '#E13B4F'
//     },
//     {
//         id: 9,
//         color: '#F5A623'
//     },
//     {
//         id: 8,
//         color: '#8B572A'
//     },
//     {
//         id: 7,
//         color: '#417505'
//     },
//     {
//         id: 6,
//         color: '#7ED321'
//     },
//     {
//         id: 5,
//         color: '#B325D0'
//     },
//     {
//         id: 4,
//         color: '#F76D9D'
//     },
//     {
//         id: 3,
//         color: '#4A90E2'
//     },
//     {
//         id: 2,
//         color: '#50E3C2'
//     },
//     {
//         id: 1,
//         color: '#97D3EB'
//     }
// ]


ScanditModule.setAppKey('AXZORj2nI0ZMHjyLexkWTD4mrkrjAEPrtXgCuecYbnjOFdU2d23g4BJzs00JbnSO9kZAtpNswn8ATLqojjZJ/zdz7cwHRaD3dxaoV/VDmq+bYuAxWjA/tTsxsMngOuBhZTdlDeMaFiuBYAOCQ3ldwMdCLOSZLmo1ltZ59+gN01VbmCtcFAiZKWwF4+5a5Hi1DQLxcGLgOtGJzGKs/rWsXKXKxTIazPt2z2VM+dK1y15HR9lI3RAKV5JWpoxKPIXrHij7fNep4cdwOWXnps4NQy7w4USWe9iWo7J/IC4IrmHAbz/QkOR1ZZiMOJmOF9ME9Ty3eMmIAEZSPIbcREpUmDwtMVJHcH02cMF1AExn1cdeinIWPNitXETQR0RCNfJJVwL3ktcUkqo9lmSySZHRdKNM87laMm11SqF60IX5koMGGADrVaw8yb2Zxvk1EHzaT6J+0gQmc50QbUt051D6yTlmGJkWUfRnRIHqqcFrWMNeL8fNbl0l3ewIOmDl06nddaTFqHKTVPR+LCugEXjN4xZvOIwA4RlBrXnvLcL10DuTN30mavL0FeqZ/v33s95D5yKIAmgGpIakYljrxoeuvb+OI8E3r7eBx2iJ6ycfXztY6q3kIqeL2Xva4bH23EmlvV1VAQ21iaiTc6eX5+9Q+3XJSDLPYHDKn1srwI2zzEx68IopPQUKQpui6hVIlbPTPBRwNNi1vgqu132Qp7k5zXlxt6NAisMHzeCIQgBOfaDjHDVwWFMcC6drp53LtQFVCru/gPAz2ttDocEZm0Rgr0reHrWups6jo4afQLzkhbLqQ5md4Hw=');

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'LinkMap' })],
});

class RMScanproduct extends Component {
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
            seqnumber: {},
            Updatedata: '',
            message: '',
            job_detail: '',
            levels: false,
            locationId: null,
            locationName: '',
            higherLevel: null,
            count: 0,
            deviceEventdata: '',
            Scannedarray: '',
            jobId: '',
            receivedList: '',
            expanded: true,
            DashboardRoute:false
        }

        this.scanHandler = (deviceEvent) => {
            console.log('device event', deviceEvent, this.state.deviceEventdata);
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
        console.log("Sending Command: " + extraName + ", " + JSON.stringify(extraValue));
        var broadcastExtras = {};
        broadcastExtras[extraName] = extraValue;
        broadcastExtras["SEND_RESULT"] = this.sendCommandResult;
        DataWedgeIntents.sendBroadcastWithExtras({
            action: "com.symbol.datawedge.api.ACTION",
            extras: broadcastExtras
        });
    }

    async componentWillMount() {
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
        this.settings.getSymbologySettings(Barcode.Symbology.DOTCODE, true)
            .activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

        this.settings.highDensityModeEnabled = true;
        this.settings.beep = true;
        this.settings.vibrate = true;
        // this.settings.getSymbologySettings = true;
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



    async componentDidMount() {
        var model = await AsyncStorage.getItem('deviceModel')
        this.setState({
            deviceModel: model,
            DashboardRoute:false,
            jobId: this.props.navigation.state.params.item != 'jobHistory' ? this.props.navigation.state.params.item : this.props.navigation.state.params.id,
            jobType: this.props.navigation.state.params.item != 'jobHistory' ? this.props.navigation.state.params.type : this.props.navigation.state.params.type,
        })

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            // this.scanner.resumeScanning();
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            this.setState({seqnumber:{},DashboardRoute:false},()=>{
                this.reloadData()

            })
        })
        var levelresponse = await APIService.execute('GET', APIService.URLBACKEND + 'genrateId/getlevel', null)
        var higherLevel = _.maxBy(levelresponse.data.data, 'level_id')
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });

        if(this.props.navigation.state.params.item != 'jobHistory') {
            this.setState({ model: true, props: this.props.navigation.state.params.item, higherLevel: higherLevel.id, sURLVariables: this.props.navigation.state.params.sURLVariables  }, () => {
                console.log("prop data:", this.state.props, this.state.sURLVariables)
                this.RawMaterialMappingJob();
            });

            var body={}
            body.job_id= this.state.jobId
            body.job_type= this.state.jobType
            var jobtype= await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/changejobtype', body)
            console.log("jobtype:",jobtype)
            if(jobtype.data.status==200){
                    this.setState({jobType:'RM_Aggregation'})
            }
            else{
                this.setState({jobType:'RM_Aggregation'})
            }
        }

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
        this.focusListener.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        AppState.removeEventListener('change', this._handleAppStateChange);
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }



    _handleAppStateChange = async (nextAppState) => {
        if (nextAppState.match(/inactive|background/)) {
            this.scanner.stopScanning();
        } else {
            this.checkForCameraPermission();
        }

    }

    scabByZebra(session) {
        var sURLVariables = session.data != null ? session.data.split('/')[3] : null
        // this.playSound()
        session.data != null ?
            this.setState({ data: session.data, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                this.RawMaterialMappingJob();
            }) : null

        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            // this.scanner.resumeScanning();
        }.bind(this), 5000)
    }

    async checkForCameraPermission() {
        const hasPermission = await this.hasCameraPermission();
        if (hasPermission) {
            this.cameraPermissionGranted();
        } else {
            await this.requestCameraPermission();
        }
    }

    renderModalContent = () => {
        if (this.state.scannerload) {
            return (
                <View style={styles.overlay}>
                    <ActivityIndicator color="#1D3567" size="large" />
                    {/* <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#1D3567' }}>{this.state.progressText}</Text> */}
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

    async getPrevioussummary(jobId) {

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
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers isHome={true} onBackHome={() => { this.DashboardRoute() }}  label={this.state.job_detail ? "RM Aggregate - " + this.state.job_detail.job_id : 'RM Aggregate'} onBack={() => { this.refs.modal6.open() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={{
                    flex: 1,
                    flexDirection: 'column'
                }}>
                    <NavigationEvents
                        onDidFocus={() => this.setState({ showCamera: true })}
                        onWillBlur={() => this.setState({ showCamera: false })}
                    />
                    <ScrollView style={{ flex: 1, backgroundColor: '#F1F3FD' }}>
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

                                this.state.showCamera?<QRCodeScanner
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
                                        height: this.state.model || this.state.delete ? this.state.Updatedata ?

                                            this.state.Updatedata === undefined ? null : hgt - wp('103%') : hgt - wp('45%') : hgt - wp('22.1%')
                                    }}
                                >
                                </QRCodeScanner>:null
                        }

                        {this.bottomrender()}



                    </ScrollView>
                    {this.state.Updatedata ?

                        this.state.Updatedata === undefined || this.state.Updatedata.length === 0 ? null :

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3FD', }}>
                                <TouchableOpacity onPress={async () => { this.refs.modal6.open() }}
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
                                <TouchableOpacity
                                    onPress={() => {
                                        this.refs.modal6.close()
                                        // var level = _.maxBy(this.state.Updatedata, 'level_id')
                                        // var maxlevel = _.find(this.state.Updatedata, function (o) {
                                        //     return o.parent_sequence_number == null && o.level_id != level.level_id
                                        // });
                                        // if (maxlevel == undefined) {
                                        // AsyncStorage.setItem('mappingId', this.state.jobId);
                                        // var scannedData = _.map(this.state.Updatedata, 'sequence_number')
                                        this.props.navigation.navigate('RMScanSummary', { item: this.state.jobId, url: this.state.seqnumber, jobhistroy: this.props.navigation.state.params.item, jobType:this.state.jobType })
                                        // }
                                        // else {
                                        //     ToastAndroid.show("You need to scan upto higher level", ToastAndroid.LONG, 25, 50);
                                        // }
                                    }}>
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
                            </View> : null}

                </View>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                    backdropPressToClose={true}  >
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
                                    }}
                                >
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567', textAlign: 'center' }}>Cancel job</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
                {this.renderModalContent()}

            </Container>

        );

    }




    onScan(session) {
        // this.scanner.pauseScanning();
        if (this.state.delete) {
            this.setState({ data: session.newlyRecognizedCodes[0].data, start: true });
            var data = session.newlyRecognizedCodes[0].data;

            var sURLVariables = data.split('/')[3]
            this.playSound()

            this.setState({ data: session.newlyRecognizedCodes[0].data, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                this.Updatedata();
            })


        } else {
            var sURL_Variables = session.newlyRecognizedCodes[0].data.split('/')[3]
            this.playSound()

            this.setState({ data: session.newlyRecognizedCodes[0].data, delete: true, sURLVariables: sURL_Variables, seqnumber: { ...this.state.seqnumber, [sURL_Variables]: !this.state.seqnumber[sURL_Variables] } }, () => {
                console.log("sURLVariables", this.state.seqnumber)
                this.Updatedata();
            })
        }
        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            this.scanner.resumeScanning();
        }.bind(this), 5000)
    }

    async reloadData() {
        var scan = await APIService.execute('GET', APIService.URLBACKEND + 'rowmaterial/getaggregationrmsummary?mapping_id=' + this.state.jobId + '&job_type=' + this.state.jobType, null)
        var seqnumber = []
        // if (this.props.navigation.state.params.item == 'jobHistory') {
        if (scan.data.data.sequence_ids != null || scan.data.data.sequence_ids.length > 0) {
            for (let i = 0; i < scan.data.data.sequence_ids.length; i++) {
                var seqfull = scan.data.data.sequence_ids[i].sequence_number
                // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
                this.setState({ model: true,seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
            }
        }
        // }

        console.log('sequence check:',scan.data.data.sequence_ids)
        if (seqnumber.length > 0) {
            var responseData = _.map(scan.data.data.assignment_mapping, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })

            this.setState({model: true,
                job_detail: scan.data.data.job_detail[0], Updatedata: responseData,
                // seqnumber: { ...this.state.seqnumber, [seqnumber]: !this.state.seqnumber[seqnumber] } 
            }, () => {
                // var levels1=[]
                // levels1.push(this.state.Updatedata)
                // for(i=0; i<levels1.length; i++){
                if (scan.data.data.assignment_mapping.length > 0 ? this.state.Updatedata[0].level_id == 2 : false) {
                    this.setState({ levels: true })
                }
                // }


            })
        }
        else {
            var response = _.map(scan.data.data.assignment_mapping, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })
            this.setState({ model: true,job_detail: scan.data.data.job_detail[0], Updatedata: response }, () => {
                // var levels1=[]
                // levels1.push(this.state.Updatedata)
                // for(i=0; i<levels1.length; i++){
                if (scan.data.data.assignment_mapping.length > 0 ? this.state.Updatedata[0].level_id == 2 : false) {
                    this.setState({ levels: true })
                }
                // }


            })
        }
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
                if( x.level_id < item.level_id && x.parent_sequence_number==null){
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

    async RawMaterialMappingJob(){

        var data = {}
        data.mapping_id = this.state.jobId
        data.sequence_number = this.state.sURLVariables
        data.location_id = this.state.locationId
        data.location_name = this.state.locationName
        AsyncStorage.getItem('mappingId').then(async (value) => {
            if (this.state.jobId != value) {
                var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/rmmappingjob', data)
                console.log('ram mapping', Updatedata)
                this.setState({ message: Updatedata.data.message, count: this.state.count + 1 }, () => {
                    if (Updatedata.data.status == 200) {
                        ToastAndroid.show(this.state.message, ToastAndroid.LONG, 25, 50);
                        this.reloadData();

                    } else if (Updatedata.data.status == 400 && this.state.message) {
                        ToastAndroid.show(this.state.message, ToastAndroid.LONG, 25, 50);
                    } else if (Updatedata.data.status == 400) {
                        ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
                    }
                })
            }
        })

    }

    async Updatedata() {
        var data = {}
        // data.mapping_id = this.state.props.data.data.mapping_id
        // data.mapping_id = this.state.jobId
        // data.sequence_number = this.state.sURLVariables
        data.location_id = this.state.locationId
        // data.location_name = this.state.locationName
        // var deletedSeq;
        // AsyncStorage.getItem('deletedSequencenum').then(async (value) => {
        //     console.log('deletedseq val', value)
        //     deletedSeq = value
        // })
        
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/checkscreen', data)
        console.log("status check:",Updatedata)
            if (Updatedata.data.status == 200) {
                // this.reloadData();
                this.RawMaterialMappingJob()
            } else if (Updatedata.data.status == 400 && this.state.message) {
                ToastAndroid.show(this.state.message, ToastAndroid.LONG, 25, 50);
            } else if (Updatedata.data.status == 400) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
            }
           
    }

    async getMappingsummary() {
        var scan = await APIService.execute('GET', APIService.URLBACKEND + 'mapping/getmappingsummary?mapping_id=' + this.state.jobId, null)
        var responseData = _.map(scan.data.data.assignment_mapping, (item) => {
            return {
                ...item,
                mode: 'Collapsed'
            }
        })

        this.setState({ job_detail: scan.data.data.job_detail[0], Updatedata: responseData })
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

    onSuccess = async(e) => {
        Linking
        if(e.data.match(new RegExp('/'))!==null){
            // ToastAndroid.show("Please scan Raw material products", ToastAndroid.LONG, 25, 50);
            var sURLVariables = ''
            sURLVariables = e.data.split('/')[3]
            var compareseqnum = _.keys(this.state.seqnumber)
            var check_sequence = false
            if (compareseqnum.length > 0) {
                check_sequence = _.find(compareseqnum, function (seq) {
                    return sURLVariables === seq;
                })
            }

            if (check_sequence) {
                ToastAndroid.show("Can Not Map the QR Twice in a Same Job.", ToastAndroid.LONG, 25, 50);

            }
            else {
                var body = {}
                body.sequence_number = sURLVariables
                var check_Product = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/checkscreen', body)
                console.log("body for check:", check_Product)
                if (check_Product.data.status == 200) {
                    if (check_Product.data.data.qr_staus == "Blank" || check_Product.data.data.RMScreen) {
                        this.playSound()

                        this.setState({ data: e, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                            setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                            this.RawMaterialMappingJob();

                        })
                    }
                    else {
                        ToastAndroid.show("Please Scan Raw Material Products", ToastAndroid.LONG, 25, 50);
                    }
                }
            }

        }
        else{
            if (this.state.delete) {
                this.setState({ data: e });
                var URLVariables = ''
                if (e.data.match(new RegExp('/')) !== null) {
                    URLVariables = e.data.split('/')[3]
                } else {
                    URLVariables = e.data
                }
                var compare = _.keys(this.state.seqnumber)
                var checksequence = false
                if (compare.length > 0) {
                    checksequence = _.find(compare, function (seq) {
                        return URLVariables === seq;
                    })
                }
                if (checksequence) {
                    ToastAndroid.show("Can Not map the QR Twice in a Same Job.", ToastAndroid.LONG, 25, 50);
                }
                else {
                    this.playSound()
                    this.setState({ data: e, delete: true, sURLVariables: URLVariables, seqnumber: { ...this.state.seqnumber, [URLVariables]: !this.state.seqnumber[URLVariables] } }, () => {
                        setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                        this.RawMaterialMappingJob();
                    })
                }
            } else {
                var sURL_Variables = ''
                if(e.data.match(new RegExp('/'))!==null){
                    sURL_Variables = e.data.split('/')[3]
                }else{
                    sURL_Variables = e.data
                }
                var compareno = _.keys(this.state.seqnumber)
                var checkseq = false
                if (compareno.length > 0) {
                    checkseq = _.find(compareno, function (seq) {
                        return URLVariables === seq;
                    })
                }
                if (checkseq) {
                    ToastAndroid.show("Can Not Map the QR Twice in a Same Job.", ToastAndroid.LONG, 25, 50);
                }
                else {
                    this.playSound()
        
                    this.setState({ data: e, delete: true, sURLVariables: sURL_Variables, seqnumber: { ...this.state.seqnumber, [sURL_Variables]: !this.state.seqnumber[sURL_Variables] } }, () => {
                        setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                        this.RawMaterialMappingJob();
                    })
                }
            }
        }
    };



    async cancelJob() {
        this.refs.modal6.close()
        var data = {}
        data.job_id = this.state.jobId
        var cancelJobresponse = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/cancelrmjob', data)
        if (cancelJobresponse.data.status == 200) {
            ToastAndroid.show("Job Cancel Successfully", ToastAndroid.LONG, 25, 50);
            // this.props.navigation.navigate('LinkMap')
            if(this.state.DashboardRoute){
                this.props.navigation.navigate('Dashboard')
            }
            else{
                this.props.navigation.dispatch(resetAction)
            }               
        }
    }

    async expandReceivedata(seqnum, index) {
        console.log("before push :", index,this.state.Updatedata)

        var url = APIService.URLBACKEND + 'rowmaterial/getaggregationrmsummary?mapping_id=' + this.state.jobId + '&sequence_number=' + seqnum + '&job_type='+ this.state.jobType;
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

        if (scan.data.data != null && responseData!=null) {
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

    bottomrender = () => {
        console.log("upda:",this.state.Updatedata)
        const fontSize = 11
        if (this.state.model) {
            return (
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3FD' }}>
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
                        onPress={() => this.state.Updatedata.length == 0 ? ToastAndroid.show("There is no item to delete.", ToastAndroid.LONG, 25, 50) : this.state.Updatedata.length === 0 ? ToastAndroid.show("There is no item to delete.", ToastAndroid.LONG, 25, 50)  : this.props.navigation.navigate('RMDeletebyscan', { item: this.state.seqnumber, jobId: this.state.jobId, jobType: this.state.jobType, jobhistroy: this.props.navigation.state.params.item })}>                                                               
                            <SvgUri width="15" height="15" fill={"#FFFFFF"} svgXmlData={svgImages.qr_code} style={{ marginRight: wp('1%'), resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }} />
                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center', color: '#fff' }}>Remove</Text>
                        </TouchableOpacity>
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
                                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff', justifyContent: 'flex-start',alignSelf: 'center', }}>{item.level_name} :</Text>
                                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5, justifyContent: 'flex-start',alignSelf: 'center', }}>{item.sequence_number || '---'}</Text>
                                                    {item.level_id == 0 ? <Text numberOfLines={1} style={{flex:1, fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5,justifyContent: 'center',alignSelf: 'center' }}>- {item.rm_name|| '---'}</Text> : null}
                                                </View>
                                                {item.level_id >= 2 ? this.plusimages(item) : null}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                //  keyExtractor={item => item.assignment_mapping_id}
                                />
                            </View> : null}
                </View>
            )
        }
        else {
            null
        }
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


export default withNavigation(RMScanproduct);
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
        // backgroundColor: "#F5FCFF"
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
});
