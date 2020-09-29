/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Splash from "./src/Splash/Splash";
import Login from "./src/Login/Login";
import Dashboard from "./src/Dashboard/Dashboard";
import Shipperlevel from "./src/Dashboard/shipperlevel";
import Highlevel from "./src/Dashboard/Highlevel";
import Assign from "./src/Assign/Assign";
import All from "./src/Assign/All/All";
import FirstandLast from "./src/Assign/FirstandLast/FirstandLast";
import Movestock from "./src/Movestock/Movestock";
import StockMovement from "./src/Movestock/StockMovement";
import MoveScanproduct from "./src/Movestock/MoveScanproduct"
import MoveScanSummary from "./src/Movestock/MoveScanSummary"
import Profile from "./src/Profile/Profile";
import Scanproduct from "./src/Assign/All/Scanproduct";
import SKUlevel from "./src/Dashboard/SKUlevel";
import EditProduct from "./src/Assign/All/EditProduct";
import ScanSummary from "./src/Assign/All/ScanSummary";
import Productsdetail from "./src/Assign/All/Productsdetail";
import LinkScanproduct from "./src/Link&Map/LinkScanproduct";
import LinkScanSummary from "./src/Link&Map/LinkScanSummary"
import Deletebyscan from "./src/Link&Map/deletebyscan"
import JobHistory from "./src/JobHistory/JobHistory";
import Truck from "./src/JobHistory/Truck";
import AuditScanProduct from "./src/Auditor/AuditScanProduct";
// import AuditPhoto from "./src/Auditor/AuditPhoto"
import Scanner from "./src/Assign/FirstandLast/Scanner";
import DashScanner from "./src/Dashboard/DashScanner"
import ScanCheck from "./src/Dashboard/ScanCheck"
import Assignment from "./src/JobHistory/Assignment"
import ReceiveStock from "./src/ReceiveStock/ReceiveStock"
import LinkMap from "./src/Link&Map/LinkMap"
import ReceiveScanStock from "./src/ReceiveStock/ReceiveScanStock"
import RecieveScanSummary from "./src/ReceiveStock/ReceiveScanSummary"
// import RNDataWedgeIntentDemo from '../Dashboard/dwdemo';
import ProductDetails from "./src/Dashboard/ProductDetails"
import ScanMove from "./src//Dashboard/ScanMove"
import Scanassign from "./src/Assign/All/Assignment/Scanassign"
import ProductAssign from "./src/Assign/All/Assignment/ProductAssign"
import AssignSummary from "./src/Assign/All/Assignment/AssignSummary";
import MainStack from "./src/Rightsidebar/MainStack";
import Attribute from "./src/AddDetails/Attribute";
import ScanAttribute from "./src/AddDetails/ScanAttribute"
import AttributeScanningItemsScreen from "./src/AddDetails/AttributeScanningItemsScreen"
import AttributeScanningDetailScreen from "./src/AddDetails/AttributeScanningDetailScreen"
import FirstLastAttribute from "./src/AddDetails/FirstLastAttribute"
import ProductReturn from "./src/ProductReturn/ProductReturn";
import ProductReturnScanningScreen from './src/ProductReturn/ProductReturnScanningScreen';
import ProductReturnScanningItemsScreen from './src/ProductReturn/ProductReturnScanningItemsScreen';
import ProductReturnScanningDetailScreen from './src/ProductReturn/ProductReturnScanningDetailScreen';
import PairIdscreen from './src/PairID/PairIdscreen';
import PairIdScanningScreen from './src/PairID/PairIdScanningScreen';
import PairIdScanningItemsScreen from './src/PairID/PairIdScanningItemsScreen'
import LinkScanDetailScreen from './src/Link&Map/LinkScanDetailScreen';
import SearchableTags from './src/Link&Map/SearchableTags'
import QuickMove from './src/QuickMove/QuickMove';
import QuickMoveScanningScreen from './src/QuickMove/QuickMoveScanningScreen';
import QuickMoveScanningItemsScreen from './src/QuickMove/QuickMoveScanningItemsScreen';
import QuickMoveScanningDetailScreen from './src/QuickMove/QuickMoveScanningDetailScreen';
import IssueRawMaterial from './src/IssueRM/IssueRawMaterial';
import IssueRawMaterialScanningScreen from './src/IssueRM/IssueRawMaterialScanningScreen';
import IssueRawMaterialScanningItemsScreen from './src/IssueRM/IssueRawMaterialScanningItemsScreen';
import IssueRawMaterialShowDetail from './src/IssueRM/IssueRawMaterialShowDetail';
import DispatchStockDetailsScreen from './src/Movestock/DispatchStockDetailsScreen';
import ReceiveStockDetailsScreen from './src/ReceiveStock/ReceiveStockDetailsScreen';
import Deaggregate from './src/De-aggregate/Deaggregate';
import DeaggregateScanningScreen from './src/De-aggregate/DeaggregateScanningScreen';
import Reaggregate from './src/De-aggregate/Reaggregate';
import ReaggregateItemsScreen from './src/De-aggregate/ReaggregateItemsScreen';
import DeaggregateItemsScreen from './src/De-aggregate/DeaggregateItemsScreen';
import DeaggregateDetailScreen from './src/De-aggregate/DeaggregateDetailScreen';
import ReaggregateDetailScreen from './src/De-aggregate/ReaggregateDetailScreen';
import StockCount from './src/StockCount/StockCount';
import StockCountScanningScreen from './src/StockCount/StockCountScanningScreen';
import StockCountItemsScreen from './src/StockCount/StockCountItemsScreen';
import StockCountDetailScreen from './src/StockCount/StockCountDetailScreen';

//Aggregation Raw material
import RMScanproduct from './src/Link&Map/RMScanproduct';
import RMScanSummary from './src/Link&Map/RMScanSummary';
import RMDeletebyscan from './src/Link&Map/RMDeletebyscan';

// Issue Raw Material
import RawMaterialList from './src/IssueRM/RawMaterialList'
import IssueRawMaterialDelete from './src/IssueRM/IssueRawMaterialDelete'

//productReturn
import SearchableReturnReasons from './src/ProductReturn/SearchableReturnReasons'
//RMAssignment
import RMAssign from './src/Assign/All/RMAssign/RMAssign'
import RMNotCheckScanningScreen from './src/Assign/All/RMAssign/RMNotCheckScanningScreen'
import RMNotCheckScanItemsScreen from './src/Assign/All/RMAssign/RMNotCheckScanItemsScreen'
// check
import RMCheckScanningScreen from './src/Assign/All/RMAssign/RMCheckScanningScreen'
import RMCheckScanItemsScreen from './src/Assign/All/RMAssign/RMCheckScanItemsScreen'
import RMCheckProductAssign from './src/Assign/All/RMAssign/RMCheckProductAssign'
import RMSKUScandetails from './src/Dashboard/RMSKUScandetails';
import SKUlevelRawMaterial from './src/Dashboard/SKUlevelRawMaterial'
import HighLevelRawMaterial from './src/Dashboard/HighLevelRawMaterial'
import ShipperLevelRawMaterial from './src/Dashboard/ShipperLevelRawMaterial'
import ProductDetailsRawMaterial from './src/Dashboard/ProductDetailsRawMaterial'
import ScanMoveRawMaterial from './src/Dashboard/ScanMoveRawMaterial'
import DispatchCheckValidation from './src/Movestock/DispatchCheckValidation';
import IssueCheckValidation from './src/IssueRM/IssueCheckValidation';
import ProductReturnCheckValidation from './src/ProductReturn/ProductReturnCheckValidation'
import AssignmentDetailScreen from './src/Assign/All/Assignment/AssignmentDetailScreen'
import Forgotpassword from './src/Login/Forgotpassword';

const MainNavigator = createStackNavigator({
  Splash: { screen: Splash },
  Login: { screen: Login },
  Dashboard: {  screen: Dashboard },
  Shipperlevel: { screen: Shipperlevel },
  Highlevel: { screen: Highlevel },
  Assign: { screen: Assign },
  All: { screen: All },
  FirstandLast: { screen: FirstandLast},
  Movestock: { screen: Movestock},
  Profile: { screen: Profile},
  Scanproduct: { screen: Scanproduct},
  EditProduct: { screen: EditProduct},
  ScanSummary: { screen: ScanSummary},
  Productsdetail: { screen: Productsdetail},
  StockMovement: { screen: StockMovement},
  SKUlevel: { screen: SKUlevel},
  MoveScanproduct: { screen: MoveScanproduct},
  MoveScanSummary: { screen: MoveScanSummary},
  LinkScanproduct: {  screen: LinkScanproduct},
  JobHistory: { screen: JobHistory},
  Truck: { screen: Truck},
  AuditScanProduct: { screen: AuditScanProduct},
  Scanner: { screen: Scanner},
  DashScanner: { screen: DashScanner},
  ScanCheck: { screen: ScanCheck},
  LinkScanSummary: { screen: LinkScanSummary},
  Deletebyscan: { screen: Deletebyscan},
  Assignment: { screen: Assignment},
  ReceiveStock: { screen: ReceiveStock},
  LinkMap: { screen: LinkMap},
  ReceiveScanStock: { screen: ReceiveScanStock},
  RecieveScanSummary: { screen: RecieveScanSummary},
  ProductDetails: { screen: ProductDetails},
  ScanMove: { screen: ScanMove},
  Scanassign: { screen: Scanassign},
  ProductAssign: { screen: ProductAssign },
  AssignSummary: { screen: AssignSummary },
  MainStack: { screen: MainStack },
  Attribute: { screen: Attribute },
  ScanAttribute: { screen: ScanAttribute },
  AttributeScanningItemsScreen: { screen: AttributeScanningItemsScreen },
  AttributeScanningDetailScreen: { screen: AttributeScanningDetailScreen },
  FirstLastAttribute: { screen: FirstLastAttribute },
  ProductReturn: { screen: ProductReturn },
  ProductReturnScanningScreen: { screen: ProductReturnScanningScreen },
  ProductReturnScanningItemsScreen: { screen: ProductReturnScanningItemsScreen },
  ProductReturnScanningDetailScreen: { screen: ProductReturnScanningDetailScreen },
  PairIdscreen: { screen: PairIdscreen },
  PairIdScanningScreen: { screen: PairIdScanningScreen },
  PairIdScanningItemsScreen: { screen: PairIdScanningItemsScreen },
  LinkScanDetailScreen: { screen: LinkScanDetailScreen },
  SearchableTags: { screen: SearchableTags },
  QuickMove: { screen: QuickMove },
  QuickMoveScanningScreen: { screen: QuickMoveScanningScreen },
  QuickMoveScanningItemsScreen: { screen: QuickMoveScanningItemsScreen },
  QuickMoveScanningDetailScreen: { screen: QuickMoveScanningDetailScreen },
  IssueRawMaterial: { screen: IssueRawMaterial },
  IssueRawMaterialScanningScreen: { screen: IssueRawMaterialScanningScreen },
  IssueRawMaterialScanningItemsScreen: { screen: IssueRawMaterialScanningItemsScreen },
  IssueRawMaterialShowDetail: { screen: IssueRawMaterialShowDetail},
  RawMaterialList:{ screen: RawMaterialList},
  DispatchStockDetailsScreen: { screen: DispatchStockDetailsScreen },
  ReceiveStockDetailsScreen: { screen: ReceiveStockDetailsScreen },
  Deaggregate: { screen: Deaggregate },
  DeaggregateScanningScreen: { screen: DeaggregateScanningScreen },
  Reaggregate: { screen: Reaggregate },
  ReaggregateItemsScreen: { screen: ReaggregateItemsScreen },
  DeaggregateItemsScreen: { screen: DeaggregateItemsScreen },
  DeaggregateDetailScreen : { screen : DeaggregateDetailScreen },
  ReaggregateDetailScreen : { screen : ReaggregateDetailScreen },
  StockCount: { screen: StockCount },
  StockCountScanningScreen: { screen: StockCountScanningScreen },
  StockCountItemsScreen : { screen : StockCountItemsScreen },
  StockCountDetailScreen : { screen : StockCountDetailScreen },
  RMScanproduct:{ screen: RMScanproduct},
  RMScanSummary:{ screen: RMScanSummary},
  RMDeletebyscan:{ screen: RMDeletebyscan},
  SearchableReturnReasons: { screen: SearchableReturnReasons },
  IssueRawMaterialDelete:{ screen: IssueRawMaterialDelete},
  RMAssign:{screen: RMAssign},
  RMNotCheckScanningScreen:{ screen:RMNotCheckScanningScreen},
  RMNotCheckScanItemsScreen:{ screen:RMNotCheckScanItemsScreen},
  RMCheckScanningScreen:{ screen : RMCheckScanningScreen},
  RMCheckScanItemsScreen: {screen: RMCheckScanItemsScreen},
  RMCheckProductAssign:{ screen: RMCheckProductAssign},
  RMSKUScandetails:{ screen: RMSKUScandetails},
  SKUlevelRawMaterial: { screen: SKUlevelRawMaterial },
  HighLevelRawMaterial: { screen: HighLevelRawMaterial },
  ShipperLevelRawMaterial: { screen: ShipperLevelRawMaterial },
  ProductDetailsRawMaterial: { screen: ProductDetailsRawMaterial },
  ScanMoveRawMaterial: { screen: ScanMoveRawMaterial },
  DispatchCheckValidation: { screen: DispatchCheckValidation},
  IssueCheckValidation:{ screen: IssueCheckValidation},
  ProductReturnCheckValidation:{ screen: ProductReturnCheckValidation},
  AssignmentDetailScreen:{ screen: AssignmentDetailScreen},
  Forgotpassword:{ screen: Forgotpassword}

});

const App = createAppContainer(MainNavigator);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
