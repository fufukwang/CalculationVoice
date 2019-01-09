import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import Style from './Style';
import InputButton from './InputButton';
import {
  AdMobBanner,
  Audio
} from 'expo';
//import SoundPlayer from 'react-native-sound-player';
import { Analytics, PageHit } from 'expo-analytics';


const inputButtons = [
    [1, 2, 3, '/'],
    [4, 5, 6, '*'],
    [7, 8, 9, '-'],
    [0, '000', '=', '+'],
    ['c','ce']
];
const analytics = new Analytics('UA-126959035-1',{ cd: '發聲計算機' });



export default class ReactCalculator extends Component{
  constructor(props){
      super(props);

      this.initialState = {
          previousInputValue: 0,
          inputValue: 0,
          selectedSymbol: null
      };

      this.state = this.initialState;
      analytics.hit(new PageHit('發聲計算機'))
        .then(() => console.log("success"))
        .catch(e => console.log(e.message));
  }

  render(){
    return(
        <View style={Style.rootContainer}>
            <View style={Style.displayContainer}>
                <Text style={Style.displayText}>{this.state.inputValue}</Text>
            </View>
            <View style={Style.inputContainer}>
                {this._renderInputButtons()}
            </View>
            <AdMobBanner
  bannerSize="fullBanner"
  style={{ alignItems: 'center' }}
  adUnitID="ca-app-pub-1170862681371636/9449609682"
  testDeviceID="EMULATOR"
  onDidFailToReceiveAdWithError={this.bannerError} />
        </View>
        
    )
  }

  _renderInputButtons(){
      let views = inputButtons.map((row, idx) => {
          let inputRow = row.map((buttonVal, columnIdx) => {
              return <InputButton
                          value={buttonVal}
                          highlight={this.state.selectedSymbol === buttonVal}
                          onPress={this._onInputButtonPressed.bind(this, buttonVal)}
                          key={'butt-' + columnIdx} />;
          });

          return <View style={Style.inputRow} key={'row-' + idx}>{inputRow}</View>;
      });

      return views;

  }

  _onInputButtonPressed(input){
    switch (typeof input) {
      case 'number':
        return this._handleNumberInput(input);
      default:
        return this._handleStringInput(input);
    }

  }

  async _handleNumberInput(num){
    let inputValue = (this.state.inputValue * 10) + num;
    const soundObject = new Audio.Sound();
    try {
      var nowMp3 = require('./sound/1.mp3');
      switch(num){
        case 0: nowMp3 = require('./sound/0.mp3'); break;
        case 1: nowMp3 = require('./sound/1.mp3'); break;
        case 2: nowMp3 = require('./sound/2.mp3'); break;
        case 3: nowMp3 = require('./sound/3.mp3'); break;
        case 4: nowMp3 = require('./sound/4.mp3'); break;
        case 5: nowMp3 = require('./sound/5.mp3'); break;
        case 6: nowMp3 = require('./sound/6.mp3'); break;
        case 7: nowMp3 = require('./sound/7.mp3'); break;
        case 8: nowMp3 = require('./sound/8.mp3'); break;
        case 9: nowMp3 = require('./sound/9.mp3'); break;
      }
      
      await soundObject.loadAsync(nowMp3);
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
    this.setState({
      inputValue: inputValue
    });
  }

  async _handleStringInput(str){
    switch (str) {
      case '/':
      case '*':
      case '+':
      case '-':
        this.setState({
          selectedSymbol: str,
          previousInputValue: this.state.inputValue,
          inputValue: 0
        });
        break;      
      case '000':
        //let inputValue = (this.state.inputValue * 1000);
        this.setState({
          inputValue: (this.state.inputValue * 1000)
        });
        break;
      case '=':
        let symbol = this.state.selectedSymbol,
          inputValue = this.state.inputValue,
          previousInputValue = this.state.previousInputValue;
        if (!symbol) {return; }

        this.setState({
          previousInputValue: 0,
          inputValue: eval(previousInputValue + symbol + inputValue),
          selectedSymbol: null
        });
        break;

      case 'ce':
        this.setState(this.initialState);
        break;

      case 'c':
        this.setState({inputValue: 0});
        break;
    }
    const soundObject = new Audio.Sound();
    try {
      var nowMp3 = require('./sound/1.mp3');
      switch(str){
        case '000': nowMp3 = require('./sound/000.mp3'); break;
        case '+': nowMp3 = require('./sound/+.mp3'); break;
        case '-': nowMp3 = require('./sound/-.mp3'); break;
        case '*': nowMp3 = require('./sound/x.mp3'); break;
        case '/': nowMp3 = require('./sound/y.mp3'); break;
        case '=': nowMp3 = require('./sound/=.mp3'); break;
        case 'ce': nowMp3 = require('./sound/ce.mp3'); break;
        case 'c': nowMp3 = require('./sound/c.mp3'); break;
      }
      
      await soundObject.loadAsync(nowMp3);
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }
}
