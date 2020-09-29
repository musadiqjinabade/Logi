import {
    Text, View, StatusBar, StyleSheet, Linking, AsyncStorage, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator, AppRegistry,
    AppState,
    Platform,
    PermissionsAndroid,
    BackHandler,
    DeviceEventEmitter
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container } from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import QRCodeScanner from "react-native-qrcode-scanner";
import * as Animatable from "react-native-animatable";
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import Sound from 'react-native-sound';
import ImagePicker from 'react-native-image-crop-picker';
import DataWedgeIntents from 'react-native-datawedge-intents';
import React, { Component } from 'react';
import {
    ScanditModule,
    Barcode,
    ScanSettings
} from 'scandit-react-native';

ScanditModule.setAppKey('AXZORj2nI0ZMHjyLexkWTD4mrkrjAEPrtXgCuecYbnjOFdU2d23g4BJzs00JbnSO9kZAtpNswn8ATLqojjZJ/zdz7cwHRaD3dxaoV/VDmq+bYuAxWjA/tTsxsMngOuBhZTdlDeMaFiuBYAOCQ3ldwMdCLOSZLmo1ltZ59+gN01VbmCtcFAiZKWwF4+5a5Hi1DQLxcGLgOtGJzGKs/rWsXKXKxTIazPt2z2VM+dK1y15HR9lI3RAKV5JWpoxKPIXrHij7fNep4cdwOWXnps4NQy7w4USWe9iWo7J/IC4IrmHAbz/QkOR1ZZiMOJmOF9ME9Ty3eMmIAEZSPIbcREpUmDwtMVJHcH02cMF1AExn1cdeinIWPNitXETQR0RCNfJJVwL3ktcUkqo9lmSySZHRdKNM87laMm11SqF60IX5koMGGADrVaw8yb2Zxvk1EHzaT6J+0gQmc50QbUt051D6yTlmGJkWUfRnRIHqqcFrWMNeL8fNbl0l3ewIOmDl06nddaTFqHKTVPR+LCugEXjN4xZvOIwA4RlBrXnvLcL10DuTN30mavL0FeqZ/v33s95D5yKIAmgGpIakYljrxoeuvb+OI8E3r7eBx2iJ6ycfXztY6q3kIqeL2Xva4bH23EmlvV1VAQ21iaiTc6eX5+9Q+3XJSDLPYHDKn1srwI2zzEx68IopPQUKQpui6hVIlbPTPBRwNNi1vgqu132Qp7k5zXlxt6NAisMHzeCIQgBOfaDjHDVwWFMcC6drp53LtQFVCru/gPAz2ttDocEZm0Rgr0reHrWups6jo4afQLzkhbLqQ5md4Hw=');

class ScanMove extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            focus: false,
            username: '',
            products: '',
            heightProduct: widthPercentageToDP('85%'),
            heightExpiry: widthPercentageToDP('85%'),
            heightmanufac: widthPercentageToDP('85%'),
            heightMRP: widthPercentageToDP('85%'),
            height: 40,
            newValue: '',
            model: false,
            data: '',
            isVisible: true,
            checked: false,
            capture: true,
            photo_data: [],
            flash: false,
            progressText: 'Loading...',
            seqnumber: {},
            expanded: true
        }
        this.scanHandler = (deviceEvent) => {

            console.log('device event', deviceEvent);
            this.scabByZebra(deviceEvent)
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

    updateSize = (height) => {
        this.setState({
            height: height
        });
    }

    updateSizeProduct = (height) => {
        this.setState({
            heightProduct: height
        });
    }

    updateSizeMRP = (height) => {
        this.setState({
            heightMRP: height
        });
    }

    updateSizemanufac = (height) => {
        this.setState({
            heightmanufac: height
        });
    }

    updateSizeExpiry = (height) => {
        this.setState({
            heightExpiry: height
        });
    }

    determineVersion() {
        // DataWedgeIntents.sendIntent(DataWedgeIntents.ACTION_SOFTSCANTRIGGER, DataWedgeIntents.START_SCANNING);
        this.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");
    }

    broadcastReceiver(intent) {
        console.log('Received Intent: ' + JSON.stringify(intent));
        var qr = JSON.stringify(intent.RESULT_INFO)
        console.log('Result', qr);
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
            var enumeratedScannersObj = intent['com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS'];
        }
        else if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE')) {
            var activeProfileObj = intent['com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'];
        }
        else if (!intent.hasOwnProperty('RESULT_INFO')) {
            console.log('inside Result info', intent);
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
        console.log("Sending Command: " + extraName + ", " + JSON.stringify(extraValue));
        var broadcastExtras = {};
        broadcastExtras[extraName] = extraValue;
        broadcastExtras["SEND_RESULT"] = this.sendCommandResult;
        DataWedgeIntents.sendBroadcastWithExtras({
            action: "com.symbol.datawedge.api.ACTION",
            extras: broadcastExtras
        });
    }

    scabByZebra(session) {
        console.log('session.data', session.data)
        var sURLVariables = session.data != null ? session.data.split('/')[3] : null
        console.log("sURLVariables:", sURLVariables);
        // this.playSound()
        session.data != null ?
            this.setState({ data: session.data, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                console.log("sURLVariables", this.state.seqnumber)
                this.Updatedata();
            }) : null

        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            // this.scanner.resumeScanning();
        }.bind(this), 5000)
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

    async saveandcomplete() {
        var data = {}
        data.sequence_number = this.state.sURLVariables
        data.level_type_id = this.state.audit_data.level_id
        data.product_id = this.state.audit_data.level_id
        data.image_url = ''
        data.comment = this.state.newValue
        data.assignment_mapping_id = this.state.audit_data.assignment_mapping_id
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'audit/saveauditdetail', data)
        if (Updatedata.data.status_code == 200) {
            this.setState({ model: !this.state.model }, () => {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
            })
        }
        else if (Updatedata.data.status_code == 400) {
            ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);

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
        this.setState({ model: true, props: this.props.navigation.state.params.item, deviceModel: model }, () => {
            console.log("prop data:", this.state.props)
        });
    }

    upload() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: false,
            mediaType: 'photo',
            compressImageQuality: 0.7
        }).then(async response => {
            console.log('link response:', response)
            this.setState({ url: response })
        });
    }

    componentWillUnmount() {
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

    render() {
        const { selectedItems, timePassed } = this.state
        const hgt = Dimensions.get("window").height
        const wdt = Dimensions.get("window").width
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={"Scan each QR code"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={{
                    flex: 1,
                    flexDirection: 'column'
                }}>
                    <ScrollView>
                        {
                            this.state.deviceModel == 'TC20' ?
                                <TouchableOpacity
                                    onPress={() => this.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", 'TOGGLE_SCANNING')}
                                    style={{
                                        flex: 1,
                                        height: widthPercentageToDP('12%'),
                                        marginRight: widthPercentageToDP('7%'),
                                        marginHorizontal: widthPercentageToDP('6%'),
                                        marginTop: widthPercentageToDP('2%'),
                                        marginBottom: widthPercentageToDP('5%'),
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
                                        height: this.state.model || this.state.delete ? this.state.Updatedata ?
                                            this.state.Updatedata === undefined || this.state.Updatedata == [] ? hgt : hgt - widthPercentageToDP('103%') : hgt - widthPercentageToDP('18.1%') : hgt - widthPercentageToDP('18.1%')
                                    }}  >
                                </QRCodeScanner>
                        }
                    </ScrollView>
                </View>
                {this.renderModalContent()}
            </Container>
        );
    }

    async Updatedata() {
        var logintoken = await AsyncStorage.getItem('loginData');
        var decoded = ''
        if (logintoken) {
            logintoken = JSON.parse(logintoken);
            var jwtDecode = require('jwt-decode');
            decoded = jwtDecode(logintoken.token);
        }
        var data = {}
        // data.mapping_id = this.state.props.data.data.mapping_id
        data.sequence_number = this.state.props
        data.parent_sequence_number = this.state.sURLVariables
        // data.location_id = decoded.location_id[0];
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/scanandmove', data)
        this.setState({ message: Updatedata.data.data.message }, () => {
            if (Updatedata.data.status_code == 200) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
                this.props.navigation.goBack()
            } else if (Updatedata.data.status_code == 400 && this.state.message) {
                ToastAndroid.show(this.state.message, ToastAndroid.LONG, 25, 50);
            } else if (Updatedata.data.status_code == 400) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
            }
        })
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
        if (this.state.delete) {
            this.setState({ data: e });
            var sURLVariables = e.data.split('/')[3]
            this.playSound()

            this.setState({ data: e, delete: true, sURLVariables: sURLVariables }, () => {
                setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                this.Updatedata();
            })
        } else {
            var sURLVariables = e.data.split('/')[3]
            this.playSound()
            this.setState({ data: e, delete: true, sURLVariables: sURLVariables }, () => {
                setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                this.Updatedata();
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


export default withNavigation(ScanMove);
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
        marginTop: widthPercentageToDP('90%'),
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
    }
});



