import react, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import CellView from './CellView'
import { Cell, Grid } from "../App"
import GridRow from './GridRow'

function setSelected(i, j) {
    console.log(i, j)
  }

export default function GridView(props) {
    
    return (
        <View style={{paddingTop: 50}}>
            {props.grid.printGrid().map((row, index) => {
                return <GridRow selected={props.selected} setSelected={props.setSelected} row={row} i={index} key={index}/>
            })}
            
        </View>
        
    )
}