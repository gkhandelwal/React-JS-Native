import React, { Component } from 'react';
import { StyleSheet,Alert,ActivityIndicator, AsyncStorage, Modal,TouchableHighlight } from 'react-native';
import  Camera from 'react-native-camera';
import BarcodeScanner from 'react-native-barcodescanner';
import { Container, Icon, View, DeckSwiper, Button,Card, CardItem, Thumbnail, Text, Content, Spinner } from 'native-base';
import Popup from 'react-native-popup';
//import Modal from 'react-native-modalbox';

const USER_REFERENCE = 'email';
var RData = {
  "old_api_id": null,
  "item_id": "51c38f3c97c3e6d3d972ef8d",
  "item_name": "Cereal For Baby, Rice, Stage 1",
  "leg_loc_id": null,
  "brand_id": "51db37c3176fe9790a8991f6",
  "brand_name": "Beech-Nut",
  "item_description": "Rice, Stage 1",
  "updated_at": "2014-11-24T20:24:24.000Z",
  "nf_ingredient_statement": "Rice Flour, Contains Less Than 1% of the Following: Sunflower Oil and Rice Bran Extract. Vitamins and Minerals: Tricalcium Phosphate, ascorbic Acid (Vitamin C), Electrolytic Iron, Zinc Sulfate, D-Alpha Tocopherol Acetate (Vitamin E), Niacinamide, Mixed Tocopherols, Mononitrate (Vitamin B1), Riboflavin (Vitamin B2), Pyridoxine Hydrochloride (Vitamin B6), Vitamin B12 and Folic Acid.",
  "nf_water_grams": null,
  "nf_calories": 60,
  "nf_calories_from_fat": 0,
  "nf_total_fat": null,
  "nf_saturated_fat": null,
  "nf_trans_fatty_acid": null,
  "nf_polyunsaturated_fat": null,
  "nf_monounsaturated_fat": null,
  "nf_cholesterol": null,
  "nf_sodium": null,
  "nf_total_carbohydrate": null,
  "nf_dietary_fiber": null,
  "nf_sugars": 0,
  "nf_protein": 1,
  "nf_vitamin_a_dv": 0,
  "nf_vitamin_c_dv": 25,
  "nf_calcium_dv": 25,
  "nf_iron_dv": 45,
  "nf_refuse_pct": null,
  "nf_servings_per_container": 7,
  "nf_serving_size_qty": 0.25,
  "nf_serving_size_unit": "cup",
  "nf_serving_weight_grams": 15,
  "allergen_contains_milk": null,
  "allergen_contains_eggs": null,
  "allergen_contains_fish": null,
  "allergen_contains_shellfish": null,
  "allergen_contains_tree_nuts": null,
  "allergen_contains_peanuts": null,
  "allergen_contains_wheat": null,
  "allergen_contains_soybeans": null,
  "allergen_contains_gluten": null,
  "usda_fields": null
};

var styles = StyleSheet.create({
                    camscanner: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    },
                      activity: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                  },

});


export default class FirstPageExample extends Component {
   constructor(props) {
        super(props);
        this.state = { inSideScanner:false, content: [], allergies: [], result: [], information: false, contentInfo: false, id : "", key: "" }
        this.onScanComplete = this.onScanComplete.bind(this);
        this.storeScanData = this.storeScanData.bind(this);
        this.fetchAllergies = this.fetchAllergies.bind(this);
        this.getAppKey = this.getAppKey.bind(this);
        this.contentInfo = this.contentInfo.bind(this);
        this.information = this.information.bind(this);
        this.closecontentInfo = this.closecontentInfo.bind(this);
        this.closeinformation = this.closeinformation.bind(this);


   }
   componentDidMount(){
       this.getAppKey();

   }

    componentWillMount(){
        this.fetchAllergies();
    }

    getAppKey(){
    var self = this;
    console.log("Inside getAppKey");
    fetch( "https://allergywatch.herokuapp.com/getKey/", {method: "GET",
          headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
              }
                                                         })
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData){
                self.setState({
                    id : responseData.appIdValue,
                    key: responseData.appKeyValue
                });
            }
            console.log("Response:" + responseData);
            console.log("ID:" + self.state.id);
            console.log("Key:"+ self.state.key);
        })
        .done();

}



    async fetchAllergies(){
                        try {
                        let email = await AsyncStorage.getItem(USER_REFERENCE);
                        console.log("Inside Getemail",email)
                        if(!email) {
                            this.redirect('login');
                        } else {
                            this.setState({email: email});
                             var self = this;
                             var url = "https://allergywatch.herokuapp.com/allergy/" + this.state.email;
                             fetch(url, {method: "GET"})
                            .then((response) => response.json())
                            .then((responseData) => {
                                 al = [];
                                 for(var i=0; i< responseData.allergy.length; i++){
                                    al.push(responseData.allergy[i].allergyName);
                                 }
                                 self.setState({allergies : al});

                                 console.log("Allergies: "+ self.state.allergies);
                                 console.log("Email: "+ self.state.email);

                            })
                            .done();
                        }
                  }
                catch(error) {
                      console.log("Something went wrong");
                  }

    }

    storeScanData(dataarr){
        console.log("insode storeScanData:"+ dataarr)
        var url='https://allergywatch.herokuapp.com/itemHistory/'
        fetch(url, {method: 'PUT',
             headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
             },
            body: JSON.stringify({
             email:this.state.email,
             itemName:dataarr[3],
             itemBrand:dataarr[2],
             itemId:dataarr[1],
             ingredient: dataarr[0]})})
           .then((responseJson) => {
              console.log(responseJson);
             })
           .catch((error) => {
               console.error(error);
             })
           .done;


    }




    onScanComplete(e){
        this.setState({inSideScanner:true});
        var scan_code = ""+e.data;
       // var scan_code = "52200004265"
        var self = this;

        var url = 'https://api.nutritionix.com/v1_1/item?upc=' + scan_code + '&appId='+ this.state.id + '&appKey=' + this.state.key;
        //var dummy = "https://glacial-tor-77897.herokuapp.com/banned-words";
        fetch(url, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {
            var nutrient = responseData.nf_ingredient_statement;
            var itemid = responseData.item_id;
            var brandname = responseData.brand_name;
            var itemname = responseData.item_name;
            if(nutrient){
                            dataarr=[];
                            dataarr.push(nutrient);
                            dataarr.push(itemid);
                            dataarr.push(brandname);
                            dataarr.push(itemname);
                            self.setState({
                                content: dataarr
                            })
                                console.log("The response is:"+ this.state.content)
                                if (!String.prototype.contains) {
                            String.prototype.contains = function(val) {
                                return this.indexOf(val) > -1
                            }
                        }

                        var arr = responseData.nf_ingredient_statement.split(',');
                        //console.log(arr);
                        //Appending item metadata according to parsed JSON
                         if(responseData.allergen_contains_milk){
                            arr.push("milk");
                        }

                        if(responseData.allergen_contains_eggs){
                            arr.push("eggs");
                        }

                        if(responseData.allergen_contains_fish){
                            arr.push("fish");
                        }

                        if(responseData.allergen_contains_shellfish){
                            arr.push("shellfish");
                        }

                        if(responseData.allergen_contains_tree_nuts){
                            arr.push("tree nuts");
                        }

                        if(responseData.allergen_contains_peanuts){
                            arr.push("peanuts");
                        }

                        if(responseData.allergen_contains_wheat){
                            arr.push("wheat");
                        }

                        if(responseData.allergen_contains_soybeans){
                            arr.push("soybeans");
                        }

                        if(responseData.allergen_contains_gluten){
                            arr.push("gluten");
                        }
                        result = [];
                        allergies = this.state.allergies;
                        for(var i=0; i< arr.length ; i++){
                            var aller = ''+arr[i];
                            for(var j=0; j<allergies.length; j++){
                                var nut = ''+allergies[j];
                                if(aller.toLowerCase().replace(/\s/g,'').contains(nut.toLowerCase())){
                                    if(result.indexOf(nut) == -1)
                                        result.push(nut);
                                }
                            }
                        }


                        if(result.length == 0){
                            this.contentInfo(arr);
                        }else{
                            this.information(arr,result);
                        }

                          this.storeScanData(dataarr);


            }else{

                       this.popup.tip({
                        content: ['Item not found!', 'Try another Item'],
                        btn: {
                            text: 'OK',
                            style: {
                                color: 'red'
                            },
                            callback: () => {
                                this.setState({inSideScanner:false})
                            },
                        },
                    });

            }
        })
        .done();
    }

    contentInfo(arr){
    this.setState({contentInfo: true, content: arr});
    }

    information(arr,result){
       this.setState({information: true, result: result, content: arr});
    }

    closecontentInfo(){
        this.setState({contentInfo: false, inSideScanner:false});
    }

    closeinformation(){
        this.setState({information: false, inSideScanner:false});
    }



    render() {
      var Button1 = <Button onPress={this.closecontentInfo} style={{position: "relative",top: 0,right: 0,width: 70,height: 30}}>Close</Button>;
      var Button2 = <Button onPress={this.closeinformation} style={{position: "relative",top: 0,right: 0,width: 70,height: 30}}>Close</Button>;
      var colorCollection = ['#00c497','#07157B','#FFC300', '#FF5733', '#581845']

        var show = [];
        if(this.state.inSideScanner){
            show.push(
                      <ActivityIndicator
                        key={'activityIndicator'}
                        animating={this.state.animating}
                        style={styles.centering}
                        size="large"
                          />
            );
        }else{
                    show.push(

                      <Camera
                        key={'camera-scanner'}
                        style={styles.camscanner}
                        onBarCodeRead={this.onScanComplete}
                        type={Camera.constants.Type.back}>
                    </Camera>

            );

        }
        console.log("Show"+show)
        console.log("Content " + this.state.content);
        return (
              <View>
                    {show}
              <Popup ref={popup => this.popup = popup }/>
              <Modal visible={this.state.contentInfo} onRequestClose={this.closecontentInfo} style={{justifyContent: 'center',
                        alignItems: 'center', height: 300}} position={"center"} >
              <Container>
              <Content>
              <Card style={{ backgroundColor: '#a3dbf6'}}>
                <CardItem style={{ backgroundColor: '#a3dbf6'}}>
                  <Icon name="md-checkmark-circle-outline" style={{ color: 'green' }} />
                  <Text>No Allergies</Text>
                  {Button1}
                </CardItem>
                <CardItem style={{ backgroundColor: '#a3dbf6'}}>
                    <Text>No Allergic Content Found</Text>
                </CardItem>
                <CardItem>
                  <Text>Nutrients:</Text>
                </CardItem>
              </Card>
              <Card dataArray={this.state.content}
                    renderRow={(theme) =>
                      <CardItem>
                          <Text>{theme}</Text>
                      </CardItem>
                  }>
              </Card>
              </Content>
              </Container>
              </Modal>

              <Modal visible={this.state.information} onRequestClose={this.closeinformation} style={{justifyContent: 'center',
                        alignItems: 'center', height: 300}} position={"center"} >
                <Container>
                <Content>
                <Card style={{ backgroundColor: '#a3dbf6'}}>
                  <CardItem style={{ backgroundColor: '#a3dbf6'}}>
                    <Icon name="md-close-circle" style={{ color: '#DD5044' }} />
                    <Text>WARNING</Text>
                    {Button2}
                  </CardItem>
                  <CardItem style={{ backgroundColor: '#a3dbf6'}}>
                      <Text>Allergic content found: </Text>
                      <View style={{flexDirection:'row', flexWrap: 'wrap', margin: 10, flex:1 , padding:10, overflow: 'scroll'}}>
                      {
                        this.state.result.map(function(item, index){
                           return (
                               <Button key={item} style={{padding:20, borderRadius:4,backgroundColor: colorCollection[index%5]}}>{item}</Button>
                           )
                         }.bind(this))
                       }
                       </View>
                  </CardItem>
                  <CardItem>
                    <Text>Nutrients:</Text>
                  </CardItem>
                </Card>
                <Card dataArray={this.state.content}
                      renderRow={(theme) =>
                        <CardItem>
                            <Text>{theme}</Text>
                        </CardItem>
                    }>
                </Card>
                </Content>
                </Container>
              </Modal>
              </View>
        );
    }
}
