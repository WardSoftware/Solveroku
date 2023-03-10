import react from 'react'
import { StyleSheet } from 'react-native'
import { Text, TouchableOpacity, View } from 'react-native'

export default function BottomRow(props) {
    return <View style={{flexDirection: "row"}}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => props.onPress(1)}><Text style={styles.textStyle}>1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => props.onPress(2)}><Text style={styles.textStyle}>2</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => props.onPress(3)}><Text style={styles.textStyle}>3</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => props.onPress(4)}><Text style={styles.textStyle}>4</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => props.onPress(5)}><Text style={styles.textStyle}>5</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => props.onPress(6)}><Text style={styles.textStyle}>6</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => props.onPress(7)}><Text style={styles.textStyle}>7</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => props.onPress(8)}><Text style={styles.textStyle}>8</Text></TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => props.onPress(9)}><Text style={styles.textStyle}>9</Text></TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    buttonStyle: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#f0f0f0",
        borderWidth: 1
    },
    textStyle: {
        fontSize: 25, 
        color: "#3172f5"
    }
})