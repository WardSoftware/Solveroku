import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GridView from './components/GridView';
import BottomRow from './components/BottomRow';
import CellView from './components/CellView';

export class Cell {
  fixed: Boolean;
  value: number;
  row: number;
  column: number;

  constructor(fixed: Boolean, value: number, row: number, column: number) {
    this.fixed = fixed;
    this.value = value;
    this.row = row;
    this.column = column;
  }
  
  getRow() {
    return this.row;
  }
  getColumn() {
    return this.column;
  }
  getFixed() {
    return this.fixed;
  }
  getValue() {
    return this.value;
  }
  setValue(value: number) {
    if (this.fixed) {
      return false;
    } else {
      this.value = value;
      return true;
    }
  }
}

export class Grid {
  grid: Cell[][] = [];

  constructor(gridList?: number[]) {
    if (gridList) {
      for (let i = 0; i < 9; i++) {
        var row: Cell[] = []
        for (let j = 0; j < 9; j++) {
          if (gridList[i * 9 + j] != 0) {
            row.push(new Cell(true, gridList[i * 9 + j], i, j));
          } else {
            row.push(new Cell(false, 0, i, j))
          }
        }
        this.grid.push(row)
      }
    } else {
      for (let i = 0; i < 9; i++) {
        var row: Cell[] = []
        for (let j = 0; j < 9; j++) {
          row.push(new Cell(false, 0, i, j))
        }
        this.grid.push(row)
      }
    }
    
  }

  solvingCellValue(selected, setSelected, val: number) {
    let i = selected[0]
    let j = selected[1]

    this.grid[i][j] = new Cell(false, val, i, j)

    setSelected([8, 8])
    setSelected([8, 7])
    setSelected([i, j])

  }

  getCell(row: number, column: number) {
    return this.grid[row][column]
  }

  previousCell(row: number, column: number) {
    if (row == 0) {
      if (column == 0) {
        return [-1, -1]
      }
    }

    if (column <= 0) {
      return [row - 1, 8]
    }
    return [row, column - 1]
  }

  nextCell(row: number, column: number) {
    if (row >= 8 && column >= 8) {
      return [-1, -1]
    }
    if (column >= 8) {
      return [row + 1, 0]
    } 
    return [row, column + 1]
  }

  getRow(row: number) {
    return this.grid[row]
  }

  getColumn(col: number) {
    let getcol = []
    for (var i of this.grid) {
      getcol.push(i[col])
    }
    return getcol
  }

  getBox(row: number, col: number) {
    if (row >= 0 && row < 3)
      var rowIndices = [0, 1, 2]
    if (row >= 3 && row < 6)
      rowIndices = [3, 4, 5]
    else
      rowIndices = [6, 7, 8]
  
    if (col >= 0 && col < 3)
      var colIndices = [0, 1, 2]
    if (col >= 3 && col < 6)
      colIndices = [3, 4, 5]
    else
      colIndices = [6, 7, 8]

    let box = []

    for (var i of rowIndices) {
      for (var j of colIndices) {
        box.push(this.grid[i][j])
      }
    }
    return box
  }

  updateCell(selected, setSelected, val: number) {
    let i = selected[0]
    let j = selected[1]
    if (val == 0) {
      this.grid[i][j] = new Cell(false, 0, i, j)
    } else {
      this.grid[i][j] = new Cell(true, val, i, j)
    }

    setSelected([8, 8])
    setSelected([8, 7])
    setSelected([i, j])
    
  }

  incrementCell(selected, setSelected) {
    let i = selected[0]
    let j = selected[1]
    if (this.getCell(i, j).getFixed()) {
      return false
    } else {
      this.grid[i][j] = new Cell(false, this.getCell(i, j).getValue(), i, j)
    }

    setSelected([8, 8])
    setSelected([8, 7])
    setSelected([i, j])
  }

  resetCell(selected, setSelected) {
    let i = selected[0]
    let j = selected[1]
    if (this.getCell(i, j).getFixed()) {
      return false
    } else {
      this.grid[i][j] = new Cell(false, 0, i, j)
    }

    setSelected([8, 8])
    setSelected([8, 7])
    setSelected([i, j])
  }

  printGrid() {
    var thisgrid = []

    for (var i of this.grid) {
      var tmp = []
      for (var j of i) {
        tmp.push(j.getValue())
      }
      thisgrid.push(tmp)
    }
    return thisgrid
  }
}

function check(cond: String, grid: Grid, row: number, column: number) {
  var cell = grid.getCell(row, column);
  var values: Cell[] = []
  switch (cond) {
    case "row": values = grid.getRow(row)
    case "column": values = grid.getColumn(column)
    case "box": values = grid.getBox(row, column)
  }

  for (var i of values) {
    if (i.getValue() == 0)
      continue
    if (i.getRow() == row && i.getColumn() == column)
      continue
    if (cell.getValue() == i.getValue())
      return false
  }
  return true
}

function solve(grid: Grid, selected, setSelected) {
  setSelected([0, 0])
  console.log('hello')

  var backtracking = false
  while (true) {
    let i = selected[0]
    let j = selected[1]

    console.log(grid.getCell(i, j).getValue())

    if (backtracking) {
      if (grid.getCell(i, j).getFixed()) {
        if (grid.previousCell(i, j)[0] == -1) {
          break
        }
        setSelected(grid.previousCell(i, j))
        continue
      } else {
        backtracking = false
      }
    }

    grid.incrementCell(selected, setSelected)
    

    if (grid.getCell(i, j).getValue() > 9) {
      grid.resetCell(selected, setSelected)
      backtracking = true
      if (grid.previousCell(i, j)[0] == -1) {
        break
      }
      setSelected(grid.previousCell(i, j))
      continue
    }

    // updateGrid

    while (!(check("row", grid, i, j) && check("column", grid, i, j) && check("box", grid, i, j))) {
      // updateGrid
      grid.incrementCell(selected, setSelected)
      if (grid.getCell(i, j).getValue() > 9) {
        grid.resetCell(selected, setSelected)
        backtracking = true
        break
      }
    }

    if (backtracking) {
      if (grid.previousCell(i, j)[0] == -1) {
        break
      }
      setSelected(grid.previousCell(i, j))
      continue
    }

    if (grid.nextCell(i, j)[0] == -1) {
      return grid
    } else {
      setSelected(grid.nextCell(i, j))
    }
  }
}

export default function App() {

  const [grid, setGrid] = useState(new Grid())

  const [selected, setSelected] = useState([0, 0])

  return (
    <SafeAreaView style={styles.container}>
      <GridView selected={selected} setSelected={setSelected} grid={grid} />
      <StatusBar style="auto" />
      <View style={{flex: 1}}/>
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity onPress={() => {
          grid.updateCell(selected, setSelected, 0)
        }} style={{...styles.solveButton, width: "40%"}}>
          <Text>Clear Cell</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGrid(new Grid())} style={{...styles.solveButton, width: "40%"}}>
          <Text>Clear Grid</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => solve(grid, selected, setSelected)} style={styles.solveButton}>
        <Text>Solve</Text>
      </TouchableOpacity>
      <BottomRow onPress={(val) => {
        grid.updateCell(selected, setSelected, val)
      }}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solveButton: {
    backgroundColor: '#eeeeee',
    width: '85%',
    margin: 10,
    height: 60,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
