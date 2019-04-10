import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  TextInput,
  Button,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {TextInputMask} from 'react-native-masked-text';
import AwesomeAlert from 'react-native-awesome-alerts';
import ButtonComponent from '../../../components/ButtonComponent'
import TextInputComponent from '../../../components/TextInputComponent'
import * as firebase from 'firebase';

const{width} = Dimensions.get('window')
let usernameEmpty = false;
let firstNameEmpty = false;
let lastNameEmpty = false;
let phoneEmpty = false;
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
    usernameEmpty = false;
    firstNameEmpty = false;
    lastNameEmpty = false;
    phoneEmpty = false;

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
    if(value == ''){
      usernameEmpty = true;
    }
    else{
      usernameEmpty = false;
    }
    //clear out any existing errors
    usernameMessage = '';
    //enable buttons
    this.setState({disable: false});
    //update username
    this.setState({username: value});
  }

  handleFirstName(value){
    if(value == ''){
      firstNameEmpty = true;
    }
    else{
      firstNameEmpty = false;
    }
    //clear out any existing errors
    firstnameMessage = '';
    //enable buttons
    this.setState({disable: false});
    //update first name
    this.setState({firstname: value});
  }

  handleLastName(value){
    if(value == ''){
      lastNameEmpty = true;
    }
    else{
      lastNameEmpty = false;
    }
    //clear out any existing errors
    lastnameMessage = '';
    //enable buttons
    this.setState({disable: false});
    //update last name
    this.setState({lastname: value});
  }

  handlePhone(){
    //get raw value of phone field
    value = this.phoneNum.getRawValue();

    if(value == ''){
      phoneEmpty = true;
    }
    else{
      phoneEmpty = false;
    }
    //clear out any existing errors
    phoneMessage = '';

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


  render() {
    const showAlert  = this.state.showAlert;
    const username = this.state.username;
    const isDisabled  = this.state.disable;
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('../../../assets/blue.jpg')} style={styles.imageContainer}>
          <View style={styles.overlay} />

          <KeyboardAwareScrollView contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between'
          }}>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit your information</Text>
          </View>

          <View style = {styles.infoContainer}>

            <View style={styles.nameContainer}>
              <View style={styles.nameInputContainer}>
                <TextInputComponent
                  empty={firstNameEmpty}
                  error={firstnameMessage}
                  placeholder="First Name"
                  defaultValue = {this.state.firstname}
                  returnKeyType='next'
                  onChangeText={(firstname) => this.handleFirstName(firstname)}
                  onSubmitEditing={()=> this.lastName.focus()}
                />
              </View>

                <View style={styles.nameInputContainer}>
                <TextInputComponent
                  empty={lastNameEmpty}
                  error={lastnameMessage}
                  placeholder="Last Name"
                  defaultValue = {this.state.lastname}
                  inputRef = {(input) => {this.lastName = input}}
                  returnKeyType='next'
                  onChangeText={(lastname) => this.handleLastName(lastname)}
                  onSubmitEditing={()=> this.username.focus()}
                />
              </View>
            </View>

            <TextInputComponent
              empty= {usernameEmpty}
              error= {usernameMessage}
              placeholder="Username"
              defaultValue = {username}
              inputRef = {(input) => {this.username = input}}
              autoCapitalize = 'none'
              returnKeyType='next'
              onChangeText={(username) => this.handleUsername(username)}
            />
            <Text/>

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
              style={[styles.input,{
                borderColor: phoneEmpty == true || phoneMessage != ''
                  ? 'red'
                  : '#35b0d2',
              }]}
              placeholder="Phone"
              placeholderTextColor="rgba(255,255,255,0.8)"
              keyboardType='numeric'
              returnKeyType='next'
            />
            <Text style = {styles.errorMessage}>{phoneMessage}</Text>

          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWidth}>
              <ButtonComponent
                text='UPDATE'
                onPress={this.onUpdatePress.bind(this)}
                disabled={isDisabled}
                primary={true}
              />
            </View>

            <View style={styles.buttonWidth}>
              <ButtonComponent
                text='CANCEL'
                onPress={this.componentDidMount.bind(this)}
                disabled={isDisabled}
                primary={false}
              />
            </View>
          </View>

          <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Profile Updated"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Gotcha"
          confirmButtonColor='#35b0d2'
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
      padding: 20,
      flex: 1,
      width: width,
    },
    buttonContainer:{
      flex: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
    },
    buttonWidth: {
      width: width/2.4,
    },
    infoContainer: {
      flex: 5,
      width: width,
      padding:20,
      justifyContent: 'center',
      alignContent: 'center',
    },
    nameContainer:{
      height: 64,
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      marginBottom: 5,
      paddingHorizontal:10,
      borderWidth: 2,
      borderRadius: 20,
    },
    nameInputContainer: {
      height:40,
      width: width/2.3,
    },
    title:{
      fontWeight: 'bold',
      color: '#fff',
      fontSize: 25,
      textAlign:'center',
    },
    inputTitle: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      marginTop: 10,
    },
});