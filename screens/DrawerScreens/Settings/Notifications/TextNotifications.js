import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Switch,
  AsyncStorage
} from 'react-native';
import {Icon} from 'native-base'
import { Constants, Notifications, Permissions } from 'expo';

const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';

export default class TextNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: null,
      isSwitchOnT: false,
    }
    this._handleToggleSwitch = this._handleToggleSwitch.bind(this);
  }
  static navigationOptions ={
    drawerIcon: (tintColor) =>(
      <Icon name="sitemap" type="FontAwesome" style={{fontSize:24, color:tintColor }}/>
    )
  }

  componentDidMount(){
    AsyncStorage.getItem('isSwitchOnT').then((value) =>
      this.setState({isSwitchOnT: JSON.parse(value)}));
    console.log(this.state.isSwitchOnT);
    //this.registerForPushNotifications();
    //Notifications.addListener(this.handleNotification);

  }

  _handleToggleSwitch = (value) => {
    //onValueChange of the switch this function will be called
    AsyncStorage.setItem('isSwitchOnT', JSON.stringify(value));
    this.setState({ isSwitchOnT: value });
  }

  render() {
    console.log(this.state.isSwitchOnT);
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../../assets/blue.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />

          <View style={styles.label}>
          <Text>
            <Text style={styles.labeltxt}>TEXT NOTIFICATIONS </Text>
          </Text>
          <View style={styles.switchContainer}>
            <Switch
              value={this.state.isSwitchOnT}
              onValueChange = {this._handleToggleSwitch}

            />
          </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  switchContainer:{
    padding: 10,
    paddingTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  header:{
    fontSize:24,
    color: "#000",
    paddingBottom: 10,
    marginBottom:40,
    borderBottomColor: '#199187',
    borderBottomWidth: 1,
  },
  textinput: {
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 40,
    marginBottom: 30,
    color: "#000",
  },
  label: {
    alignSelf: 'stretch',
    paddingTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labeltxt:{
    fontSize: 22,
    color: 'white',
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(69,85,117,0.7)',
  },
  imageContainer: {
      resizeMode:'cover',
      flex:1,
  }
});
