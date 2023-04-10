import react from 'react'
import { StyleSheet } from 'react-native'
import { Text, TouchableOpacity, View } from 'react-native'

export default function BottomRow(props) {

    function getValids() {
        var counts = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let i of props.grid.grid) {
            for (let j of i) {
                counts[j.getValue() - 1] += 1
            }
        }
        var truths = [];
        for (let i of counts) {
            if (i == 9) {
                truths.push(true)
            } else {
                truths.push(false)
            }
        }
        return truths
    }

    const styles = StyleSheet.create({
        buttonStyle: {
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "#f0f0f0",
            borderWidth: 1,
            opacity: props.disabled ? 0.5 : 1
        },
        textStyle: {
            fontSize: 25, 
            color: "#3172f5"
        }
    })

    return <View style={{flexDirection: "row"}}>
        {getValids().map((elem, i) => {
            if (!elem) {
                return <TouchableOpacity disabled={props.disabled} style={styles.buttonStyle} onPress={() => props.onPress(i+1)} key={i}><Text style={styles.textStyle}>{i+1}</Text></TouchableOpacity>
            } else {
                return <TouchableOpacity disabled={true} style={{...styles.buttonStyle, opacity: 0.5}} onPress={() => props.onPress(i+1)} key={i}><Text style={styles.textStyle}>{i+1}</Text></TouchableOpacity>
            }
        })}
        {/* <TouchableOpacity disabled={props.disabled} style={styles.buttonStyle} onPress={() => props.onPress(2)}><Text style={styles.textStyle}>2</Text></TouchableOpacity>
        <TouchableOpacity disabled={props.disabled} style={styles.buttonStyle} onPress={() => props.onPress(3)}><Text style={styles.textStyle}>3</Text></TouchableOpacity>
        <TouchableOpacity disabled={props.disabled} style={styles.buttonStyle} onPress={() => props.onPress(4)}><Text style={styles.textStyle}>4</Text></TouchableOpacity>
        <TouchableOpacity disabled={props.disabled} style={styles.buttonStyle} onPress={() => props.onPress(5)}><Text style={styles.textStyle}>5</Text></TouchableOpacity>
        <TouchableOpacity disabled={props.disabled} style={styles.buttonStyle} onPress={() => props.onPress(6)}><Text style={styles.textStyle}>6</Text></TouchableOpacity>
        <TouchableOpacity disabled={props.disabled} style={styles.buttonStyle} onPress={() => props.onPress(7)}><Text style={styles.textStyle}>7</Text></TouchableOpacity>
        <TouchableOpacity disabled={props.disabled} style={styles.buttonStyle} onPress={() => props.onPress(8)}><Text style={styles.textStyle}>8</Text></TouchableOpacity>
        <TouchableOpacity disabled={props.disabled} style={styles.buttonStyle} onPress={() => props.onPress(9)}><Text style={styles.textStyle}>9</Text></TouchableOpacity> */}
    </View>
}