import React from 'react'
import { StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar, 
  Picker, 
  Platform,
  Vibration
} from 'react-native'
import { Audio } from 'expo'

const { width, height } = Dimensions.get('window')
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d3440',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 64,
    color: '#f8f0ee'
  },
  button: {
    marginTop: 30,
    borderWidth: 15,
    borderColor: '#28BFDB',
    borderRadius: width / 2,
    width: width / 2,
    height: width / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonStop: {
    borderColor: '#ef424c'
  },
  buttonText: {
    fontSize: 48,
    color: '#28BFDB'
  },
  buttonTextStop: {
    color: '#ef424c'
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        marginLeft: 10,
        color: '#f8f0ee',
        backgroundColor: '#2d3440'
      }
    })
  },
  pickerItem: {
    color: '#f8f0ee',
    fontSize: 28,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

const formatNumber = (number) => `0${number}`.slice(-2)

const getRemainingTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = time - minutes * 60
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds)}
}

const createArray = length => {
  const arr = []
  for(let i=0;i<length;i++) {
    arr.push(i.toString())
  }

  return arr
}

const AVAILABLE_MINUTES = createArray(60)
const AVAILABLE_SECONDS = createArray(60)

export default class App extends React.Component {
  state = {
    remainingSeconds: 5,
    isRunning: false,
    selectedMinutes: '4',
    selectedSeconds: '20'
  }

  interval = null

  playAudio = async () => {
    const sound = new Audio.Sound()
    try {
      await sound.loadAsync(require('./assets/timer.mp3'))
      await sound.playAsync()
    } catch (err) {
      console.err(err)
    }
  }

  async componentDidUpdate(prevProp, prevState) {
    if(this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0){
      Vibration.vibrate([0, 1000, 0]) 
      await this.playAudio()
      this.stop()
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval)
  }  

  start = () => {
    this.setState(state => ({
      remainingSeconds: parseInt(state.selectedMinutes, 10) * 60 + parseInt(state.selectedSeconds, 10),
      isRunning: true
    })) // instant update, and then set interval

    this.interval = setInterval(() => {
      this.setState(start => ({
        remainingSeconds: start.remainingSeconds - 1
      }))
    }, 1000)
  }

  stop = () => {
    clearInterval(this.interval)
    this.interval = null
    this.setState({
      remainingSeconds: 5,
      isRunning: false
    })
  }

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker} 
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={value => {
          this.setState({selectedMinutes: value})
        }}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map(value => (
          <Picker.Item key={value} label={value} value={value}/>
        ))}
      </Picker>
      <Text style={{fontSize: 21, color: '#f8f0ee'}}>minutes</Text>
      <Picker
        style={styles.picker} 
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedSeconds}
        onValueChange={value => {
          this.setState({selectedSeconds: value})
        }}
        mode="dropdown"
      >
        {AVAILABLE_SECONDS.map(value => (
          <Picker.Item key={value} label={value} value={value}/>
        ))}
      </Picker>
      <Text style={{fontSize: 21, color: '#f8f0ee'}}>seconds</Text>
    </View>
  )

  render() {
    const { remainingSeconds, isRunning } = this.state
    const { minutes, seconds } = getRemainingTime(remainingSeconds)

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content'/>
        {isRunning ? (
          <Text style={styles.time}>{`${minutes}:${seconds}`}</Text>
        ) : (
          this.renderPickers()
        )}
        {isRunning ? (
          <TouchableOpacity style={[styles.button, styles.buttonStop]} onPress={this.stop}>
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </TouchableOpacity>
          ) : (
          <TouchableOpacity style={styles.button} onPress={this.start}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          )}
      </View>
    )
  }
}

