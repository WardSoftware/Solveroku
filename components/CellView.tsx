import react from 'react'
import { View, Text, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native'

export default function CellView(props) {

    return (
        <TouchableOpacity onPress={() => props.setSelected([props.i, props.j])} style={props.selected[0] == props.i && props.selected[1] == props.j ? style.selected : style.notSelected} >
            <View style={props.selected[0] == props.i && props.selected[1] == props.j ? style.selected : style.notSelected}>
                <Text>
                    {props.value != 0 ? props.value: ""}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    cellStyle: {
        backgroundColor: "#eeeeee", 
        borderWidth: 1, 
        width: 40, 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    selected: {
        backgroundColor: "#dadada", 
        borderWidth: 1, 
        width: 40, 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    notSelected: {
        backgroundColor: "#eeeeee", 
        borderWidth: 1, 
        width: 40, 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})