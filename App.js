import React from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native'

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
  }
})

const formatNumber = (number) => `0${number}`.slice(-2)

const getRemainingTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = time - minutes * 60
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds)}
}

export default class App extends React.Component {
  state = {
    remainingSeconds: 5,
    isRunning: false
  }

  interval = null

  componentDidUpdate(prevProp, prevState) {
    if(this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0)
      this.stop()
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval)
  }  

  start = () => {
    this.setState(start => ({
      remainingSeconds: start.remainingSeconds - 1,
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

  render() {
    const { remainingSeconds, isRunning } = this.state
    const { minutes, seconds } = getRemainingTime(remainingSeconds)

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content'/>
        <Text style={styles.time}>{`${minutes}:${seconds}`}</Text>
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

