import react from 'react'
import { Text, View } from 'react-native'
import CellView from './CellView'

export default function GridRow(props) {
    return (
        <View style={{flexDirection: "row"}}>
            { props.row.map((cell, index) => {
            return <CellView grid={ props.grid } color={props.color} correctGrid={props.correctGrid} selected={props.selected} setSelected={props.setSelected} setEditable={props.setEditable} key={index} i={props.i} j={index} value={cell}/>
        })}
        </View>
        
    )
}