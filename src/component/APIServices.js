var jwtDecode = require('jwt-decode');
import { AsyncStorage} from 'react-native';


export default class APIService {
  // test product list
  // static URLTEST = 'https://company-admin-backend-test.herokuapp.com/v1/'  // Test

  static URLTEST = 'https://company-admin-backend-test.herokuapp.com/v1/'  // Demo


  // test logitrack backend test

  static URLBACKEND = 'https://logitrack-backend-test.herokuapp.com/v1/' // Test

  static URL_ERP = 'https://logitrak-erp-system-test.herokuapp.com/v1/'

  // static URLBACKEND = 'https://3a17c902639f.ngrok.io/v1/' // local url


  // static URLBACKEND = 'https://logitrack-backend-demo.herokuapp.com/v1/' // Demo

  static URLUSER = 'https://logi-smart-backend-test.herokuapp.com/v1/'

//cancel job
static cancelJob = "stockTransfer/canceljob"

//delete scan
static deleteItem = "assignment/deletescan"

//QuickMove
static getSubLocationList = "quickmove/getsublocationlist"
static startQuickMoveJob = "quickmove/startquickmovejob"
static executeJob = "quickmove/excutequickmovejob"
static getQuickMoveSummary = "quickmove/getquickmovesummary"
static getExpandedData = "assignment/viewjobsummary"
static endQuickMoveJob = "quickmove/endquickmovejob"
static assignTags = "tag/assigntags"
static getAssignTags = "tag/getothertaglist"

//ProductReturn
static getDocumentTypeList = "productReturn/getdocumenttypelist"
static getRecipients = "productReturn/getrecipientlist"
static startProductReturnJob = "productReturn/startreturnjob"
static executeProductReturnJob = "productReturn/excutereturnjob"
static getReturnSubLocation = "productReturn/getlocationrecipient"
static getReturnSummary = "productReturn/getreturnsummary"
static endReturnJob = "productReturn/endreturnjob"
static getReturnReasons = "productReturn/getreturnreason"


//Stock count
static stockCountAvailability = "stockcount/stockcountavailability"
static startStockCountJob = "stockcount/startstockcount"
static stockCountSubLocations = "stockcount/getsublocationlist"
static executeStockcountJob = "stockcount/startstockcountscan"
static getStockcountList = "stockcount/getstockcountlist" // will get scanned items and total number of scans i.e. total_scans
static expandStockcountData = "stockcount/getstockcountlistdetails" // will get expanded data
static getStockcountSummary = "stockcount/getstockcountsummarydetails"
static endStockCountJob = "stockcount/endstockcountjob"

  //Issu Raw Material
  static executeissuermjob = "rowmaterial/executeissuermjob"
  static issuerermdelete = "rowmaterial/cancelissuermjob"
  static rawmaterialcheckscreen ="rowmaterial/checkvalidation?"

  //RMAssignment without check
  static startRMAssignmentJob = "rowmaterial/startrmassignmentwithoutcheck"
  static getjobdetails = "rowmaterial/getjobdetails"
  static getAssignSummary = "rowmaterial/getaggregationrmsummary"
  static getjobexecution =  "rowmaterial/rmjobexecution"
  static endAssignJob = "rowmaterial/endrmjobexecution"
  static cancelAssignJob = "rowmaterial/cancelrmjob"

  //RM Assignment with check
  static checkRMAssignment = "rowmaterial/startrmassignmentandmapjob"
  static RMCheckSequence = "rowmaterial/checkrmsequenceno"

  //First&Last
  static settinggetdocumenttypelist = "settings/getdocumenttypelist?"
  static documentgetdocumentbytype = "document/getdocumentbytype"

  //Dispatch
  static productcheckscreen = "productreturn/checkscreen?"

  //Forgotpassword

  static Forgotpassword = "users/forgotpassword"
  static Resetpassword = "users/resetpassword"


  static async execute(method, url, data) {
    var loginData = await AsyncStorage.getItem('loginData');

    if (loginData) {
      loginData = JSON.parse(loginData);
    }
    if (loginData) {
      var request = {};
      request.method = method;
      request.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + loginData.token
      };

      if (loginData.locale) {
        request.headers['Locale'] = loginData.locale;
      }

      if (request.method !== 'GET') {
        request.body = JSON.stringify(data);
      }
      // console.log('API Call = ', 'https://' + loginData.concernCode + '-test.maxxton.net' + url);
      // console.log('API Call = ', APIService.URLTEST + url);
      console.log('request', url, request)

      return fetch(url, request)
        .then(res => {
          console.log('res', res.json);
          return res.json();
        })
        .then((response) => {
          console.log('API Response = ', response);
          return {
            success: true,
            data: response
          }
        })
        .catch((error) => {
          console.log('API error = ', error);
          return error;
        })
    }
    else if(data && data.email_id || data.otp){
      var requestbody = {};
      requestbody.method = method;
      requestbody.headers = {
        'Content-Type': 'application/json'
      }
      if (requestbody.method == 'POST') {
        requestbody.body = JSON.stringify(data);
      }
      console.log('body:', requestbody, url)
      return fetch(url, requestbody)
      .then(res => {
        return res.json();
      })
      .then((response) => {
        console.log('API Response = ', response);
        return {
          data: response
        }
      })
      .catch((error) => {
        console.log('API error = ', error);
        return error;
      })
    }

  }
}