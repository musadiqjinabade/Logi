import {
    Text, View, StatusBar, StyleSheet, Linking, AsyncStorage, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator,
    AppState,
    Platform,
    PermissionsAndroid,
    BackHandler,
    DeviceEventEmitter,
    FlatList
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
import Sound from 'react-native-sound';
import DataWedgeIntents from 'react-native-datawedge-intents';
import React, { Component } from 'react';
import {
    ScanditModule,
    Barcode,
    ScanSettings
} from 'scandit-react-native';
import Headers from '../component/Headers'
import color from '../component/color';

const _ = require('lodash');

ScanditModule.setAppKey('AXZORj2nI0ZMHjyLexkWTD4mrkrjAEPrtXgCuecYbnjOFdU2d23g4BJzs00JbnSO9kZAtpNswn8ATLqojjZJ/zdz7cwHRaD3dxaoV/VDmq+bYuAxWjA/tTsxsMngOuBhZTdlDeMaFiuBYAOCQ3ldwMdCLOSZLmo1ltZ59+gN01VbmCtcFAiZKWwF4+5a5Hi1DQLxcGLgOtGJzGKs/rWsXKXKxTIazPt2z2VM+dK1y15HR9lI3RAKV5JWpoxKPIXrHij7fNep4cdwOWXnps4NQy7w4USWe9iWo7J/IC4IrmHAbz/QkOR1ZZiMOJmOF9ME9Ty3eMmIAEZSPIbcREpUmDwtMVJHcH02cMF1AExn1cdeinIWPNitXETQR0RCNfJJVwL3ktcUkqo9lmSySZHRdKNM87laMm11SqF60IX5koMGGADrVaw8yb2Zxvk1EHzaT6J+0gQmc50QbUt051D6yTlmGJkWUfRnRIHqqcFrWMNeL8fNbl0l3ewIOmDl06nddaTFqHKTVPR+LCugEXjN4xZvOIwA4RlBrXnvLcL10DuTN30mavL0FeqZ/v33s95D5yKIAmgGpIakYljrxoeuvb+OI8E3r7eBx2iJ6ycfXztY6q3kIqeL2Xva4bH23EmlvV1VAQ21iaiTc6eX5+9Q+3XJSDLPYHDKn1srwI2zzEx68IopPQUKQpui6hVIlbPTPBRwNNi1vgqu132Qp7k5zXlxt6NAisMHzeCIQgBOfaDjHDVwWFMcC6drp53LtQFVCru/gPAz2ttDocEZm0Rgr0reHrWups6jo4afQLzkhbLqQ5md4Hw=');

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'IssueRawMaterial' })],
});

class IssueRawMaterialScanningScreen extends Component {
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
            levels: false,
            seqnumber: {},
            locationId: null,
            locationName: '',
            deviceEventdata: '',
            jobId: '',
            receivedList: '',
            expanded: true,
            ERP_data: '',
            showCamera: false,
            assignment_mapping: '',
            DashboardRoute: false
        }
        this.scanHandler = (deviceEvent) => {
            if (this.state.deviceEventdata == '' || this.state.deviceEventdata == null) {
                this.setState({
                    deviceEventdata: deviceEvent.data
                }, () => {
                    this.scabByZebra(deviceEvent)
                })
            }
            else if (this.state.deviceEventdata != deviceEvent.data) {
                this.setState({
                    deviceEventdata: deviceEvent.data
                }, () => this.scabByZebra(deviceEvent))

            }
            // this.scabByZebra(deviceEvent)
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
        // var qrdata = qr[com.symbol.datawedge.data_string]

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

    async componentWillMount() {
        this.settings = new ScanSettings(); 
        this.settings.setSymbologyEnabled(Barcode.Symbology.DOTCODE, true); 
        this.settings.setSymbologyEnabled(Barcode.Symbology.QR, true);
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
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            })
        });
        this.setState({ DashboardRoute: false, model: true, props: this.props.navigation.state.params.item, ERP_data: this.props.navigation.state.params.body_detail, jobType: this.props.navigation.state.params.item != 'jobHistory' ? this.props.navigation.state.params.item.job_type : this.props.navigation.state.params.item.type, jobId: this.props.navigation.state.params.item != 'jobHistory' ? this.props.navigation.state.params.item.job_id : this.props.navigation.state.params.id });

        this.props.navigation.addListener('didFocus', (item) => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            this.getAssignmentsummary()
            this.setState({ DashboardRoute: false })
        });
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

    scabByZebra(session) {
        var sURL_Variables = session.data != null ? session.data.split('/')[3] : null
        // this.playSound()
        session.data != null ?
            this.setState({ data: session.data, delete: true, sURLVariables: sURL_Variables, seqnumber: { ...this.state.seqnumber, [sURL_Variables]: !this.state.seqnumber[sURL_Variables] } }, () => {
                this.Updatedata();
            }) : null

        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            // this.scanner.resumeScanning();
        }.bind(this), 5000)
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

    DashboardRoute() {
        this.setState({ DashboardRoute: true }, () => {
            this.refs.modal6.open()
        })
    }

    render() {
        const hgt = Dimensions.get("window").height
        const wdt = Dimensions.get("window").width
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1F3FD' }}>
                <Headers isHome={true} onBackHome={() => { this.DashboardRoute() }} label={'Issue Raw Material - ' + this.state.jobId || null} onBack={() => { this.refs.modal6.open() }} expanded={this.state.expanded} />
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
                                this.state.showCamera ? <QRCodeScanner
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
                                        height: this.state.Updatedata ?
                                            this.state.Updatedata === undefined || this.state.Updatedata.length === 0 ? hgt - wp('43%') : hgt - wp('103%') : hgt - wp('43%')
                                    }}  >
                                </QRCodeScanner> : null
                        }
                        {this.bottomrender()}
                    </ScrollView>
                    {this.state.Updatedata.length > 0 ?
                        <View style={{
                            flex: 1, position: 'absolute',
                            bottom: 0, flexDirection: 'row',
                        }}>
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
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('IssueRawMaterialScanningItemsScreen', { item: this.state.jobId, url: this.state.seqnumber, jobhistroy: this.props.navigation.state.params.item }) }}>
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
                {this.renderModalContent()}
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                    backdropPressToClose={false}  >
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
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"showDetails"} swipeArea={20}
                    backdropPressToClose={true} >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('85%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <Text style={{ fontFamily: 'Montserrat-Bold', color: '#1D3567', textAlign: 'center', marginBottom: hp('2%'), fontSize: 16 }}>Messages</Text>
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
            </Container>
        );
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
            this.setState({ Updatedata: scan.data.data.rm_availability, assignment_mapping: responseData, job_detail: scan.data.data.job_detail })
            for (let i = 0; i < scan.data.data.sequence_ids.length; i++) {
                var seqfull = scan.data.data.sequence_ids[i].sequence_number
                // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
                this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
            }

        }
    }

    async Updatedata() {
        var body = {}
        body.job_id = this.state.jobId || null
        body.sequence_number = this.state.sURLVariables
        body.workoder_type = this.state.job_detail.document_type.toString() || '0'
        body.workorder_no = this.state.job_detail.document_no || null
        var executeissuermjob = await APIService.execute('POST', APIService.URLBACKEND + APIService.executeissuermjob, body)
        console.log("executeissuermjob:", executeissuermjob)

        if (executeissuermjob.data.status == 200) {
            ToastAndroid.show(executeissuermjob.data.data.message, ToastAndroid.LONG, 25, 50);
            this.getAssignmentsummary()
        }

        else if (executeissuermjob.data.status == 400) {
            if (executeissuermjob.data.message == "Validation failed" && executeissuermjob.data.data.error.length > 0) {
                this.setState({ ShowData: executeissuermjob.data.data.error }, () => {
                    this.refs.showDetails.open()
                })
            }
            else if (executeissuermjob.data.message) {
                ToastAndroid.show(executeissuermjob.data.message, ToastAndroid.LONG, 25, 50);
            }
        }
        else {
            ToastAndroid.show(executeissuermjob.data.message, ToastAndroid.LONG, 25, 50);
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

    onSuccess = e => {
        Linking

        if (e.data.match(new RegExp('/')) !== null) {
            if (this.state.delete) {
                this.setState({ data: e });
                var sURLVariables = e.data.split('/')[3]
                this.playSound()
                this.setState({ data: e, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                    setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                    this.Updatedata();
                })
            } else {
                var sURL_Variables = e.data.split('/')[3]
                this.playSound()
                this.setState({ data: e, delete: true, sURLVariables: sURL_Variables, seqnumber: { ...this.state.seqnumber, [sURL_Variables]: !this.state.seqnumber[sURL_Variables] } }, () => {
                    setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                    this.Updatedata();
                })
            }
        }
        else {
            if (this.state.delete) {
                this.setState({ data: e });
                var URLVariables = ''
                URLVariables = e.data
                this.playSound()
                this.setState({ data: e, delete: true, sURLVariables: URLVariables, seqnumber: { ...this.state.seqnumber, [URLVariables]: !this.state.seqnumber[URLVariables] } }, () => {
                    setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                    this.Updatedata();
                })
            } else {
                var QR_Variable = ''
                if (e.data.match(new RegExp('/')) !== null) {
                    QR_Variable = e.data.split('/')[3]
                } else {
                    QR_Variable = e.data
                }
                this.playSound()

                this.setState({ data: e, delete: true, sURLVariables: QR_Variable, seqnumber: { ...this.state.seqnumber, [QR_Variable]: !this.state.seqnumber[QR_Variable] } }, () => {
                    setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                    this.Updatedata();
                })
            }
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

    async cancelJob() {
        this.refs.modal6.close()
        var data = {}
        data.job_id = this.state.jobId
        var cancelJobresponse = await APIService.execute('POST', APIService.URLBACKEND + APIService.issuerermdelete, data)
        if (cancelJobresponse.data.status == 200) {
            ToastAndroid.show(cancelJobresponse.data.data.message, ToastAndroid.LONG, 25, 50);
            if (this.state.DashboardRoute) {
                this.props.navigation.navigate('Dashboard')
            }
            else {
                this.props.navigation.dispatch(resetAction)
            }
        }
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
        const fontSize = 11
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#F1F3FD' }}>
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
                                <Text style={{ margin: 2, color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>{this.state.assignment_mapping ? this.state.assignment_mapping.length : '0'}</Text>
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
                                    onPress={() => this.props.navigation.navigate('IssueCheckValidation', { data: this.state.jobId })}>
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
                                onPress={() => this.state.assignment_mapping.length == 0 ? ToastAndroid.show("There is no Item to Delete.", ToastAndroid.LONG, 25, 50) : this.state.assignment_mapping.length === 0 ? ToastAndroid.show("There is no Item to Delete.", ToastAndroid.LONG, 25, 50) : this.props.navigation.navigate('IssueRawMaterialDelete', { item: this.state.seqnumber, jobId: this.state.jobId, jobType: this.state.jobType, jobhistroy: this.props.navigation.state.params.item })}
                            >
                                <SvgUri width="15" height="15" fill={"#FFFFFF"} svgXmlData={svgImages.qr_code} style={{ marginRight: wp('1%'), resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }} />
                                <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center', color: '#fff' }}>Remove</Text>
                            </TouchableOpacity>
                        </View> 
                        <View style={{ marginTop: hp('2%') }} />
                        <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%') }}>
                            <View style={{ marginTop: hp('1%') }} />
                            <View style={{ marginTop: hp('0.5%'), flexDirection: 'row' }}>
                                <FlatList
                                    extraData={this.state.assignment_mapping}
                                    data={this.state.assignment_mapping}
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
                                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff', justifyContent: 'flex-start',alignSelf: 'center' }}>{item.level_name} :</Text>
                                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5, justifyContent: 'flex-start',alignSelf: 'center' }}>{item.sequence_number || '---'}</Text>
                                                    {item.level_id == 0 ? <Text numberOfLines={1} style={{flex:1, fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5,alignSelf: 'center' }}>- {item.rm_name || '---'}</Text> : null}
                                                    {item.ishighlighted?<SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.warningflag} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} />:null}
                                                </View>
                                                {item.level_id >= 2 ? this.plusimages(item) : null}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    keyExtractor={item => item.sequence_number}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
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


export default withNavigation(IssueRawMaterialScanningScreen);
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
        color: '#1D3567',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    header: {
        fontFamily: 'Montserrat-Regular',
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
    scanheader: {
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        fontSize: 16,
        marginLeft: wp('2%'),
        color: '#636363'
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
});
