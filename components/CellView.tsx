import react from 'react'
import { ProgressViewIOSComponent, Touchable, TouchableWithoutFeedback } from 'react-native'
import { View, Text, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native'


export default function CellView(props) {
    const selectedbox = (selected, i, j) => {
        var sel_i = selected[0]
        var sel_j = selected[1]
        
        var rowIndices
        var colIndices

        if (sel_i >= 0 && sel_i < 3)
          rowIndices = [0, 1, 2]
        else
          if (sel_i >= 3 && sel_i < 6)
            rowIndices = [3, 4, 5]
          else
            rowIndices = [6, 7, 8]
      
        if (sel_j >= 0 && sel_j < 3)
          colIndices = [0, 1, 2]
        else
          if (sel_j >= 3 && sel_j < 6)
            colIndices = [3, 4, 5]
          else
            colIndices = [6, 7, 8]
        
        
        
        if (rowIndices.includes(i) && colIndices.includes(j)) {
            return true
        }
        return false
    
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
                props.setSelected([props.i, props.j])
                props.setEditable(!(props.grid.grid[props.i][props.j].getFixed()))
                props.color
            }} style={ style(props.color, selectedbox, props.grid, props.correctGrid, props.selected, props.i, props.j).style } >
            <View style={style(props.color, selectedbox, props.grid, props.correctGrid, props.selected, props.i, props.j).style}>
                <View style={style(props.color, selectedbox, props.grid, props.correctGrid, props.selected, props.i, props.j)}>
                    <Text style={text(props.grid, props.correctGrid, props.i, props.j).style}>
                        {props.value != 0 ? props.value : ""}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const text = (grid, correctGrid, i, j) => {
    if (grid.grid[i][j].getValue() == correctGrid.grid[i][j].getValue()) {
        var textCol = "#066bb8"
    } else {
        var textCol = "#b3090f"
    }

    if (grid.grid[i][j].getFixed()) {
        var textCol = "black"
    }
    
    return StyleSheet.create({
        style: {
            fontSize: 30,
            color: textCol
        }
    })
}

const style = (color: string[], selectedBox, grid, correctGrid, selected, i, j) => {
    // console.log(color)
    var borderWidthRight = 1
    var borderWidthBottom = 1

    if (i == 2 || i == 5) {
        borderWidthBottom = 2
    }
    if (j == 2 || j == 5) {
        borderWidthRight = 2
    }

    if (selected[0] == i && selected[1] == j || grid.grid[i][j].getValue() == grid.grid[selected[0]][selected[1]].getValue()) {
        var backgroundColor = color[2]
    } else {
        if (i == selected[0] || selected[1] == j || selectedBox(selected, i, j)) {
            var backgroundColor = color[1]
        } else {
            var backgroundColor = color[0]
        }
    }

    if (grid.grid[selected[0]][selected[1]].getValue() == 0) {
        if (selected[0] == i && selected[1] == j) {
            var backgroundColor = color[1]
        } else {
            var backgroundColor = color[0]
        }
    }

    return StyleSheet.create({
        style: {
            ...style_template.selected,
            backgroundColor: backgroundColor,
            borderRightWidth: borderWidthRight,
            borderBottomWidth: borderWidthBottom,
        }
    })
}

const style_template = StyleSheet.create({
    cellStyle: {
        backgroundColor: "#eeeeee", 
        borderWidth: 1,
        width: 40, 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    selected: {
        backgroundColor: "#FFc0cb", 
        borderWidth: 1, 
        width: 40, 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    notSelected: {
        backgroundColor: "#ffd1dc", 
        borderWidth: 1, 
        width: 40, 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})