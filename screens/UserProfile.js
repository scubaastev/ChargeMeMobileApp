import React from 'react';
import {ActivityIndicator, AppRegistry, StyleSheet, Text, View, TouchableWithoutFeedback, SafeAreaView, StatusBar, TextInput, Button,Dimensions, Image, ImageBackground, TouchableOpacity, TouchableHighlight, Keyboard, DatePickerIOS, ScrollView} from 'react-native';
import {Header,Left,Right,Icon} from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {TextInputMask} from 'react-native-masked-text';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as firebase from 'firebase';


const{width} = Dimensions.get('window')

let usernameMessage = '';
let firstnameMessage = '';
let lastnameMessage = '';
let phoneMessage = '';


export default class UserProfile extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        email: '',
        firstname: '',
        lastname: '',
        birthday: '',
        profilePic: '',
        uid: '',
        loading: false,
        disable: true,
        showAlert: false
      };
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  //function that executes when page loads
  componentDidMount(){
    //clear out all error messages
    usernameMessage = '';
    firstnameMessage = '';
    lastnameMessage = '';
    phoneMessage = '';

    //disable buttons
    this.setState({disable: true});

    //get the current user
    var user = firebase.auth().currentUser;
    //get current user uid
    var uid = user.uid;

    //if there is a user logged in
    if (user != null) {
      //grab user's info
      this.setState({
        email : user.email,
        profilePic : user.photoUrl,
        uid: uid
      })
    }

    firebase.database().ref('users/'+uid).once("value", snapshot => {
      //query firebase for other user attributes
       this.setState({
         firstname : snapshot.val().firstName,
         lastname : snapshot.val().lastName,
         phone : snapshot.val().phone,
         username : snapshot.val().username,
         birthday : snapshot.val().birthday
       })
    });
  }

  handleUsername(value){
    //clear out any existing errors
    usernameMessage = '';
    //enable buttons
    this.setState({disable: false});
    //update username
    this.setState({username: value});
  }

  handleFirstName(value){
    //clear out any existing errors
    firstnameMessage = '';
    //enable buttons
    this.setState({disable: false});
    //update first name
    this.setState({firstname: value});
  }

  handleLastName(value){
    //clear out any existing errors
    lastnameMessage = '';
    //enable buttons
    this.setState({disable: false});
    //update last name
    this.setState({lastname: value});
  }

  handlePhone(){
    //clear out any existing errors
    phoneMessage = '';
    //get raw value of phone field
    value = this.phoneNum.getRawValue();
    //make sure phone number is correct length
    if(value.length < 11){
      phoneMessage = 'Invalid phone number'
    }
    //enable buttons
    this.setState({disable: false});
    //update phone
    this.setState({phone: value});
  }

  onUpdatePress(){

    //check that all fields have been filled out
    if(this.state.username == ''){
      usernameMessage = 'Please enter a username';
    }
    if(this.state.firstname == ''){
      firstnameMessage = 'Please enter a first name';
    }
    if(this.state.lastname == ''){
      lastnameMessage = 'Please enter a last name';
    }
    if(this.state.phone == ''){
      phoneMessage = 'Please enter a phone';
    }

    //force refresh
    this.forceUpdate();

    //check that there are no errors
    if(usernameMessage == '' && firstnameMessage == '' && lastnameMessage == '' && phoneMessage == '' ){
      //get user id
      var uid = firebase.auth().currentUser.uid;

      //format phone
       let unMask = this.phoneNum.getRawValue();


      //write user info
      firebase.database().ref('users/' + uid).set({
        username: this.state.username,
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        phone: unMask,
        birthday: this.state.birthday,
        email: this.state.email,
      });

      //show confirmation alert
      this.setState({showAlert: true});

      //disable the buttons again
      this.setState({disable: true});
    }
  }

  //function to decide whether to display login button or loading spin
  renderButtonOrLoading(){
    //if we are in a state of loading show loading spin
    if(this.state.loading){
      return (
        <View style={styles.buttonsContainer}>
            <ActivityIndicator size="large" color="#34c6de" />
        </View>
      )
    }
    //if not in state of loading show update and cancel buttons (buttons each bound to
    //thier own function
    const isDisabled  = this.state.disable;
    return (
        <View style={isDisabled?styles.disabled:styles.enabled}>
            <TouchableOpacity disabled = {isDisabled} style={styles.updateButton} onPress={this.onUpdatePress.bind(this)}>
              <Text style={styles.btntext}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled = {isDisabled} style={styles.cancelButton} onPress={this.componentDidMount.bind(this)}>
              <Text style={styles.btntext}>Cancel</Text>
            </TouchableOpacity>
        </View>
      )
  }

  render() {
    const showAlert  = this.state.showAlert;
    const username = this.state.username;
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../assets/blue.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />

          <KeyboardAwareScrollView contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between'
          }}>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit your information</Text>
          </View>

          <View style = {styles.infoContainer}>

            <Text style={styles.inputTitle}>Username</Text>
            <TextInput style={styles.input}
            placeholder="'john123'"
            value = {username}
            ref = "username"
            placeholderTextColor="rgba(255,255,255,0.8)"
            autoCorrect= {false}
            autoCapitalize = 'none'
            returnKeyType='next'
            onChangeText={(username) => this.handleUsername(username)}
            onSubmitEditing={()=> this.refs.email.focus()}
            />
            <Text style = {styles.errorMessage}>{usernameMessage}</Text>

            <Text style={styles.inputTitle}>First Name</Text>
            <TextInput style={styles.input}
            placeholder="'John'"
            defaultValue = {this.state.firstname}
            ref = "firstName"
            placeholderTextColor="rgba(255,255,255,0.8)"
            autoCorrect= {false}
            returnKeyType='next'
            onChangeText={(firstname) => this.handleFirstName(firstname)}
            onSubmitEditing={()=> this.refs.lastName.focus()}
            />
            <Text style = {styles.errorMessage}>{firstnameMessage}</Text>

            <Text style={styles.inputTitle}>Last Name</Text>
            <TextInput style={styles.input}
            placeholder="'Doe'"
            value = {this.state.lastname}
            ref = "lastName"
            placeholderTextColor="rgba(255,255,255,0.8)"
            autoCorrect= {false}
            returnKeyType='next'
            onChangeText={(lastname) => this.handleLastName(lastname)}
            />
            <Text style = {styles.errorMessage}>{lastnameMessage}</Text>

            <Text style={styles.inputTitle}>Phone Number</Text>
            <TextInputMask
            type={'custom'}
            options={
              {
                mask: '+1(999)999-9999',
                getRawValue: function(value,settings){
                  return value.replace(/\D/g,'');
                }
              }
            }
            ref = {(phone) => this.phoneNum = phone}
            value={this.state.phone}
            onChangeText= {() => this.handlePhone()}
            style={styles.input}
            placeholder="+1(###)###-####"
            placeholderTextColor="rgba(255,255,255,0.8)"
            keyboardType='numeric'
            returnKeyType='next'
            />
            <Text style = {styles.errorMessage}>{phoneMessage}</Text>

          </View>

          {this.renderButtonOrLoading()}

          <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Profile Updated"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Gotcha"
          confirmButtonColor='#34c6de'
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
        </KeyboardAwareScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      flexDirection: 'column',
    },
    inputBoxContainer:{
      flex:8,
    },
    imageContainer: {
        resizeMode:'cover',
        flex:1,
    },
    titleContainer:{
      justifyContent: 'flex-end',
      //alignItems: 'center',
      padding: 20,
      flex: 1,
      width: width,
    },
    disabled:{
      flex: 2,
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 5,
      opacity: 0.3,
    },
    enabled:{
      flex: 2,
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 5,
      opacity: 1,
    },
    infoContainer: {
      flex: 5,
      width: width,
      padding:20,
      justifyContent: 'center',
      alignContent: 'center',
    },
    errorMessage:{
      color: 'red',
    },
    header:{
      position:'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(69,85,117,0.7)',
    },
    logo: {
      flex: 1,
      resizeMode: 'contain',
    },
    input: {
      height:40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      color:'#fff',
      paddingHorizontal:10
    },
    title:{
      fontWeight: 'bold',
      color: '#fff',
      fontSize: 25,
      textAlign:'center',
    },
    inputTitle: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      marginTop: 10,
    },
    updateButton: {
      flex: 1,
      margin: 20,
      height: 50,
      alignContent: 'center',
      justifyContent: 'center',
      backgroundColor: '#34c6de',
    },
    cancelButton: {
      flex: 1,
      margin: 20,
      height: 50,
      alignContent: 'center',
      justifyContent: 'center',
      backgroundColor: '#ff7f50',
    },
    btntext:{
      textAlign: 'center',
      color: 'rgb(32,53,70)',
      fontWeight: 'bold',
      color: 'white',
      fontSize: 18,
    }
});
