import React from 'react';
import {createStackNavigator} from 'react-navigation';
import BillSplit from '../screens/BillSplit';
import SplitByItem from '../screens/SplitByItem';
import SplitEvenly from '../screens/SplitEvenly';
import FriendsList from '../screens/FriendsList';
import SelectFriend from '../screens/SelectFriend';

const BillSplitStack = createStackNavigator({

    BillSplit: { screen: BillSplit, navigationOptions: {header: null}},
    SplitByItem: { screen: SplitByItem},
    SplitEvenly: { screen: SplitEvenly},
    SelectFriend: {screen:SelectFriend},
  },
  {
       initialRouteName: 'BillSplit',
  }
);


export default BillSplitStack;