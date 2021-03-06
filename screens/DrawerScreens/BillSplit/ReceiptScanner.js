import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ListView,
  FlatList,
  Dimensions,
  ImageBackground,
  Platform,
  Button,
} from "react-native";
import { Header, Left, Right, Icon } from "native-base";
import { Camera, Permissions } from "expo";
import ImagePicker from 'react-native-image-picker';
//import RNTesseractOcr from 'react-native-tesseract-ocr';

import RNTextDetector from "react-native-text-detector";
import ButtonComponent from "../../../components/ButtonComponent";

let { width, height } = Dimensions.get("window");


const imagePickerOptions ={
  quality: 1.0,
  storageOptions: {
    skipBackup: true,
  },
};
const tessOptions ={
  whitelist: null,
  blacklist: null
};


export default class ReceiptScanner extends React.Component {
  static navigationOptions = {
    drawerIcon: tintColor => (
      <Icon
        name="camera"
        type="FontAwesome"
        style={{ fontSize: width/15.625, color: tintColor }}
      />
    )
  };
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      path: null,
      imageProperties: null,
      data: null,
      imageSource: null,
      text:'',
      photo:null,
    };
  this.selectImage = this.selectImage.bind(this);
  }

  selectImage(){

    ImagePicker.showImagePicker(imagePickerOptions, (response)=>
    {
      console.log('Response =',response);
      if(response.didCancel){
        console.log('User cancelled image picker');
      }
      else if(!response.didCancel){
        const source = {uri:response.uri};
        this.setState({imageSource:source});
        // this.extractText(response.path);
      }
    });
  }
  handleChoosePhoto =() => {
    const{data} =this.state;
    const options ={
      noData: true
    };
    ImagePicker.launchImageLibrary(options,response=>{
      console.log("response",response);
      if(!response.didcCancel){
        const source = {uri: response.uri};
        this.setState({
          imageSource:source,
          path:response.uri,
          data:response,
          imageProperties: {height: response.height, width: response.width},
        });

      }

    });
  };
  // extractText(imgPath){
  //   const tessOptions = {
  //     whitelist: null,
  //     blacklist: '1234567890\'!"#$%&/()={}[]+*-_:;<>'
  //   };

  //   RNTesseractOcr.recognize(imgPath, lang, tessOptions)
  //   .then((result) => {
  //     this.setState({ ocrResult: result });
  //     console.log("OCR Result: ", result);
  //   })
  //   .catch((err) => {
  //     console.log("OCR Error: ", err);
  //   })
  //   .done();
  // }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  press = async () => {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      this.setState({
        path: data.uri,
        data: data,
        imageProperties: {height: data.height, width: data.width},
      });
    }
  };

  mapVisionRespToScreen = (visionResp, imageProperties) => {
    const IMAGE_TO_SCREEN_Y = height / imageProperties.height;
    const IMAGE_TO_SCREEN_X = width / imageProperties.width;

    return visionResp.map(item => {
      return {
        ...item,
        position: {
          width: item.bounding.width * IMAGE_TO_SCREEN_X,
          left: item.bounding.left * IMAGE_TO_SCREEN_X,
          height: item.bounding.height * IMAGE_TO_SCREEN_Y,
          top: item.bounding.top * IMAGE_TO_SCREEN_Y
        }
      };
    });
  };

  processImage =async() =>{
    const{imageProperties} = this.state;
    const{data} =this.state;
    const visionResp = await RNTextDetector.detectFromUri(data.uri);
    console.log('visionResp',visionResp);
    if(!(visionResp && visionResp.length >0)){
      throw "unmatched";
    }
    this.setState({
      visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
    });
  };
  renderImage() {
    return (
      <View>
        <Image source={{ uri: this.state.path }} style={styles.preview} />
        <View style={styles.buttonContainer}>
          <ButtonComponent
            containerStyle={styles.cancel}
            onPress={() => this.setState({ path: null })}
            text="Cancel"
            disabled={false}
            primary={true}
          />
           <ButtonComponent
            containerStyle={styles.scan}
            onPress={this.processImage.bind(this)}
            text="Scan Receipt"
            disabled={false}
            primary={false}
          />
        </View>
      </View>
    );
  }
  renderNothing(){

  }

  renderCamera() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: -width / 2 + (width/10),
                  left: -width / 2 + (width/8),
                  right: -width / 2 + (width/8),
                  bottom: -width / 2 + (width/4),

                  borderWidth: width / 2,
                  borderColor: "rgb(32,53,70)",
                  opacity: 0.9
                }}
              />
              <View style ={{position:'absolute', flex:1, alignItems: "center", justifyContent:"center"}}>
      {/* {photo&&(<Image
        source={{uri:photo.uri}}
        style={{width:300,height:300}}

      />)} */}
                      {this.state.path ? this.renderImage(): this.renderNothing() }

      <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
     </View>

              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
                onPress={this.press.bind(this)}
              >
                <Image
                  style={{ width: width/6.25, height: width/6.25, marginBottom: width/37.5 }}
                  source={require("../../../assets/capture.png")}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }

  render() {
    // const {imageSource} = this.state;
    const {photo} =this.state;



    return (


      <View style={styles.container}>

        {this.state.path ? this.renderImage() : this.renderCamera()}
        <Text>{this.state.text}</Text>
      </View>

    );

    //  return(


  //  )

    // return(
    //   <View style={{flex:1}}>
    //     <TouchableOpacity onPress={this.handleChoosePhoto}>
    //       <View >
    //       {
    //         photo === null
    //         ? <Text> Tap me!</Text>
    //         : <Image style={styles.preview} source={photo}/>
    //       }
    //       </View>
    //     </TouchableOpacity>
    //     <Text>{this.state.text}</Text>
    //   </View>
    // );
  }
}

ReceiptScanner.navigationOptions ={
  title: 'Scan Your Receipt',

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#000"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: width/75,
    color: "#000",
    padding: width/37.5,
    margin: width/9.375
  },
  cancel: {
    position: "absolute",
    left: width/75,
    top: width/75,
    backgroundColor: "transparent",
    color: "#FFF",
    fontWeight: "600",
    fontSize: width/22.0588
  },
  scan:{
    color: "#FFF",
    marginLeft:50,
  },
  imageContainer: {
    resizeMode: "cover",
    flex: 1
  },
  buttonContainer: {
    width: width / 3,
    flex: 0,
    backgroundColor: "transparent",
    position: "absolute"
  }
});
