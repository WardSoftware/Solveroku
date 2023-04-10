import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import rgb, { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import GridView from './components/GridView';
import BottomRow from './components/BottomRow';
import ColorPicker from 'react-native-wheel-color-picker'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNetInfo } from '@react-native-community/netinfo'
import { Feather } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'

const ip = "http://192.168.0.36:5000"

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
    if (this.grid[i][j].getFixed()) {
      return;
    } else {
      this.grid[i][j] = new Cell(false, val, i, j);
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

async function solve(grid: Grid, selected, setSelected) {
  // const response = await fetch(ip + "/solve", {
  //   method: "POST", // *GET, POST, PUT, DELETE, etc.
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: {
  //     "sudoku": grid.printGrid()
  //   }
  // })
  setSelected([0, 0])

  var backtracking = false
  while (true) {
    let i = selected[0]
    let j = selected[1]

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

function checkEditable(selected, setSelected, grid, setEditable) {
  const i = selected[0]
  const j = selected[1]
  if (grid.grid[i][j].getFixed()) {
    setEditable(false)
  } else {
    setEditable(true)
  }

}

async function getNewGrid(netInfo, setGrid: React.Dispatch<React.SetStateAction<Grid>>, setCorrectGrid: React.Dispatch<React.SetStateAction<Grid>>, difficulty: number) {
  console.log("GETTING SUDOKU")
  var serverResponse;
  try {
    let r = await fetch(ip+"/message").catch(e => serverResponse = false)
    serverResponse = r.status == 200
  } catch {
    serverResponse = false
  }
  
  console.log(serverResponse)

  if (netInfo.isConnected && serverResponse) {
    fetch(ip+"/sudoku?difficulty=" + difficulty.toString()).then(r => {
      r.json().then(json => {
        var newGridInput = []
        var correctNewGridInput = []
        for (var i = 0; i < 81; i++) {
          newGridInput.push(Number(json['puzzle'][i]))
          correctNewGridInput.push(Number(json['solution'][i]))
        }
  
        setGrid(new Grid(newGridInput))
        setCorrectGrid(new Grid(correctNewGridInput))
      })
    })
  } else {
    let str = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "data.csv")
    let rows = str.split("\n")
    let puzzles = []
    for (var i of rows) {
      puzzles.push(i.split(","))
    }
    puzzles = puzzles.filter((puzzle) => ((Number(puzzle[2]) < (difficulty - 2)) || (Number(puzzle[2]) < (difficulty + 2))))

    // console.log(puzzles)
    
    const randomIndex = Math.floor((Math.random() * 1000000000) % puzzles.length)

    console.log(randomIndex)
    var newGridInput = []
    var correctNewGridInput = []
    for (var j = 0; j < 81; j++) {
      newGridInput.push(Number(puzzles[randomIndex][0][j]))
      correctNewGridInput.push(Number(puzzles[randomIndex][1][j]))
    }

    setGrid(new Grid(newGridInput))
    setCorrectGrid(new Grid(correctNewGridInput))
  }
}

async function updateLocalDB() {
  console.log("updating database")
  var puzzles: string[][] = []
  var solutions: string[][] = []
  var difficulties: string[][] = []
  var r = await fetch(ip+"/localUpdate")
  var json = await r.json()
  puzzles = json['puzzles']
  solutions = json['solutions']
  difficulties = json['difficulties']
    
  var rows = ""

  for (var m in puzzles) {
    rows += `${puzzles[m]},${solutions[m]},${difficulties[m]}\n`
  }

  const headerString = 'puzzle,solution,difficulty\n'
  
  const csvString = `${headerString}${rows}`

  console.log(csvString)

  // console.log(rows)

  const path = FileSystem.documentDirectory + "data.csv"
  // pathToWrite /storage/emulated/0/Download/data.csv
  FileSystem.writeAsStringAsync(path, csvString)
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function darkenColor(color: string): string {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  var r;
  var g;
  var b;
  if (result) {
      r = parseInt(result[1], 16)
      g = parseInt(result[2], 16)
      b = parseInt(result[3], 16)
  } else {
      return color
  }

  return rgbToHex((r - 30), g - 30, b - 30);
  
}

const setColorFn = (color: string, setColor, selected, setSelected) => {
  console.log(darkenColor(darkenColor(darkenColor("#bae1ff"))))
  setColor([color, darkenColor(color), darkenColor(darkenColor(color))])
  const i = selected[0] 
  const j = selected[1]
  setSelected([8, 8])
  setSelected([8, 7])
  setSelected([i, j])
}

export default function App() {

  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isConnected) {
      updateLocalDB()
    }
  }, [netInfo])
  

  const [grid, setGrid] = useState(new Grid())

  const [color, setColor] = useState(["#ffffff", "#efefef", "#dfdfdf"]);

  const [correctGrid, setCorrectGrid] = useState(new Grid());

  const [selectedEditable, setEditable] = useState(true);

  const [difficulty, setDifficulty] = useState(40)

  const [selected, setSelected] = useState([0, 0])

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
        <TouchableOpacity onPress={() => setColorFn('#ffb3ba', setColor, selected, setSelected)} style={{width: 30, margin: 20, marginBottom: 0, height: 30, backgroundColor: '#ffb3ba', borderRadius: 50}}/>
        <TouchableOpacity onPress={() => setColorFn('#efcfaa', setColor, selected, setSelected)} style={{width: 30, margin: 20, marginBottom: 0, height: 30, backgroundColor: '#ffdfba', borderRadius: 50}}/>
        <TouchableOpacity onPress={() => setColorFn('#efeb9a', setColor, selected, setSelected)} style={{width: 30, margin: 20, marginBottom: 0, height: 30, backgroundColor: '#fffbaa', borderRadius: 50}}/>
        <TouchableOpacity onPress={() => setColorFn('#aaefb9', setColor, selected, setSelected)} style={{width: 30, margin: 20, marginBottom: 0, height: 30, backgroundColor: '#baffc9', borderRadius: 50}}/>
        <TouchableOpacity onPress={() => setColorFn('#bae1ff', setColor, selected, setSelected)} style={{width: 30, margin: 20, marginBottom: 0, height: 30, backgroundColor: '#bae1ff', borderRadius: 50}}/>
      </View>
      <View style={{flex: 1, width: "90%", paddingBottom: 0, marginBottom: 0, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <Feather size={20} name={netInfo.isConnected ? "wifi" : "wifi-off"} /> 
        <Text>Difficulty: {difficulty}</Text>
      </View>
      <GridView color={color} selected={selected} setSelected={setSelected} setEditable={setEditable} grid={grid} correctGrid={correctGrid} />
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
      
      {/* <TouchableOpacity onPress={() => solve(grid, selected, setSelected)} style={styles.solveButton}>
        <Text>Solve</Text>
      </TouchableOpacity> */}
      <Text>Difficulty: {difficulty}%</Text>
      <View style={{...styles.solveButton, padding:15, alignItems: "stretch"}}>
        <Slider minimumValue={0} maximumValue={100}  step={1} value={difficulty} onValueChange={v => setDifficulty(v)} />
      </View>  
      <TouchableOpacity style={styles.solveButton} onPress={() => getNewGrid(netInfo, setGrid, setCorrectGrid, difficulty)}>
        <Text>Get Sudoku</Text>
      </TouchableOpacity>
      <BottomRow grid={grid} disabled={!(selectedEditable)} onPress={(val) => {
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
