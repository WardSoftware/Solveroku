import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

class Cell {
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

class Grid {
  grid: Cell[][] = [];
  constructor(gridList: number[]) {
    for (let i = 0; i < 10; i++) {
      let row: Cell[] = []
      for (let j = 0; j < 10; j++) {
        if (gridList[i * 9 + j] != 0) {
          row.push(new Cell(true, gridList[i * 9 + j], i, j));
        } else {
          row.push(new Cell(false, 0, i, j))
        }
      }
      this.grid.push(row)
    }
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

    if (column == 0) {
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

  printGrid() {

    // Will update the displayed grid. Won't be necessary as the view will use a state variable.
    return 0
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

function solve(grid: Grid) {
  var i = 0
  var j = 0
  var backtracking = false
  while (true) {
    var cell = grid.getCell(i, j)
    
    if (backtracking) {
      if (cell.getFixed()) {
        i = grid.previousCell(i, j)[0]
        j = grid.previousCell(i, j)[1]
        continue
      } else {
        backtracking = false
      }
    }

    cell.setValue(cell.getValue() + 1)

    if (cell.getValue() > 9) {
      cell.setValue(0)
      backtracking = true
      i = grid.previousCell(i, j)[0]
      j = grid.previousCell(i, j)[1]
      continue
    }

    // updateGrid

    while (!(check("row", grid, i, j) && check("column", grid, i, j) && check("box", grid, i, j))) {
      // updateGrid
      cell.setValue(cell.getValue() + 1)
      if (cell.getValue() > 9) {
        cell.setValue(0)
        backtracking = true
        break
      }
    }

    if (backtracking) {
      i = grid.previousCell(i, j)[0]
      j = grid.previousCell(i, j)[1]
      continue
    }

    if (grid.nextCell(i, j)[0] == -1) {
      return grid
    } else {
      i = grid.nextCell(i, j)[0]
      j = grid.nextCell(i, j)[1]
    }
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
