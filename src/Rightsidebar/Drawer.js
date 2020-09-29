import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import {Dimensions} from 'react-native';

import Home from '../../App';
import Rightsidebar from '../Rightsidebar/Rightsidebar';

const Drawer = createDrawerNavigator(
    {
        drawer: Home
    },
    {
        contentComponent: Rightsidebar,
        drawerWidth: (Dimensions.get('window').width * 3/4),
        drawerPosition:'right',
        drawerLockMode: 'unlocked',
        
        // activeTintColor: '#e91e63',
        // inactiveBackgroundColor: '#e91e63'



    }
)

export default createAppContainer(Drawer);