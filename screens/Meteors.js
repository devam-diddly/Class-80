import React, { Component } from 'react';
import { Text, View,Alert,FlatList,ImageBackground,Image } from 'react-native';
import axios from "axios";

export default class MeteorScreen extends Component {
    constructor(){
        super()
        this.state = {
            meteors:{}
        }
    }
    getMeteors=()=>{
        axios.get("https://api.nasa.gov/neo/rest/v1/feed?api_key=hlZxZWny1JsBuzKzUFCi6q168J7F9VBZcWDhTF01")
        .then(response=>{
            this.setState({
                meteors:response.data.near_earth_objects
            })
            //console.log(this.state.meteors)

        })
        .catch(error=>{
            Alert.alert(error.message)
        })
    }

    renderItem=({item}) => {
        let meteor=item
        let bg_image,speed,size
        if (meteor.threat_score <= 30){
            bg_image=require("../assets/meteor_bg1.png")
            speed=require("../assets/meteor_speed3.gif")
            size=100
        }

        if (meteor.threat_score <= 75){
            bg_image=require("../assets/meteor_bg2.png")
            speed=require("../assets/meteor_speed2.gif")
            size=150
        }

        else {
            bg_image=require("../assets/meteor_bg3.png")
            speed=require("../assets/meteor_speed1.gif")
            size=200

        }

        return (
            <View>
                <ImageBackground source={bg_image} style={{flex:1,resizeMode:"cover"}}>
                    <Image source={speed} style={{width:size, height:size,alignSelf:"center "}}/>
                    <View>
                        <Text>
                            Name-{item.name}
                        </Text>
                        <Text>
                            closest to earth-{item.close_approach_data[0].close_approach_date_full}
                        </Text>
                        <Text>
                            minimum diameter-{item.estimated_diameter.kilometers.estimated_diameter_min}
                        </Text>
                        <Text>
                            maximum diameter-{item.estimated_diameter.kilometers.estimated_diameter_max}
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    componentDidMount(){
        this.getMeteors()
    }
    render() {

        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )
                } else {
                    let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => { return this.state.meteors[meteor_date] })
                    //console.log(meteor_arr)
                    let meteors = [].concat.apply([], meteor_arr);
                    meteors.forEach(function (element) { let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2 
                    let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000 
                    element.threat_score = threatScore; });
                    console.log(meteors)

                meteors.sort(function(a,b){
                    return b.threat_score - a.threat_score
                })
                meteors = meteors.slice(0,5)
                console.log(meteors)
        return (
            <View
                style={{
                    flex: 1,
                }}>
                <FlatList 
                data={meteors}
                horizontal={true}
                keyExtractor={(item,index) => index.toString()}
                renderItem={this.renderItem}
                />
            </View>
        )
            }
    }
}
