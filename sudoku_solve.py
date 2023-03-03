## Sudoku Solver: Python 3
## This is a working example of the algorithm in python. 
# I want the solver to be on-device not server based, so i need to rewrite this algorithm in typescript.

import os

## Cell class. Stores all the necessary information about the cell. 
# In order to backtrack, we need to pay attention to what numbers are part of the puzzle, and which are answers.
class Cell:
    def __init__(self, fixed, value, row, column):
        self.fixed = fixed
        self.value = value
        self.row = row
        self.column = column

    def getFixed(self):
        return self.fixed

    def getRow(self):
        return self.row

    def getColumn(self):
        return self.column
    
    def getValue(self):
        return self.value
    
    def setValue(self, value):
        if self.fixed:
            return False
        else:
            self.value = value
            return True
## Similarly to above, this is a class for the grid. init method takes a single 81 value list and creates a 2d "grid." 
# Includes functions for getting each row, cell, and column by index identifiers. Makes checking if the number is valid much easier.

class Grid:
    def __init__(self, gridList):
        self.grid = []
        for i in range(9):
            row = []
            for j in range(9):
                if gridList[i * 9 + j] != 0:
                    row.append(Cell(True, gridList[i * 9 + j], i, j))
                else:
                    row.append(Cell(False, 0, i, j))
            self.grid.append(row)

    def getCell(self, row, column):
        return self.grid[row][column]

    def previousCell(self, row, column):
        if row == 0:
            if column == 0:
                return -1
        if column == 0:
            return (row - 1, 8)
        return (row, column - 1)

    def nextCell(self, row, column):
        if row >= 8 and column >= 8:
            return -1
        if column >= 8:
            return (row + 1, 0)
        return (row, column + 1)
            
    def getRow(self, row):
        return self.grid[row]

    def getColumn(self, col):
        getcol = []
        for i in self.grid:
            getcol.append(i[col])
        return getcol

    # Takes in a cells position, and returns all cells inside the box that the cell is inside.
    def getBox(self, row, col):

        # There's a faster, easier way to do this. I just can't be bothered.
        if row >= 0 and row < 3:
            rowIndices = [0, 1, 2]
        elif row >= 3 and row < 6:
            rowIndices = [3, 4, 5]
        else:
            rowIndices = [6, 7, 8]
        
        if col >= 0 and col < 3:
            colIndices = [0, 1, 2]
        elif col >= 3 and col < 6:
            colIndices = [3, 4, 5]
        else:
            colIndices = [6, 7, 8]
        
        box = []
        for i in rowIndices:
            for j in colIndices:
                box.append(self.grid[i][j])

        return box

    def printGrid(self):
        # time.sleep(0.2)
        os.system("clear")
        for i in self.grid:
            s = ""
            for j in i:
                if not j.getFixed():
                    s += "\033[0;34;40m" + str(j.getValue()) + " "
                else:
                    s += "\033[0;37;40m" + str(j.getValue()) + " "
            s += "\033[0;36;40m"
            print(s)

def check(cond, grid, row, column):

    cell = grid.getCell(row, column)
    

    if cond == "row":
        values = grid.getRow(row)
    elif cond == "column":
        values = grid.getColumn(column)
    elif cond == "box":
        values = grid.getBox(row, column)
    
    for i in values:
        if i.getValue() == 0:
            continue
        if i.getRow() == row and i.getColumn() == column:
            continue
        if cell.getValue() == i.getValue():
            return False
    return True


def solve(grid):
    i = 0
    j = 0
    backtracking = False
    while True:
        # Get the cell we are checking
        cell = grid.getCell(i, j)

        # If we have gone back a step, ensure that the current cell is not fixed. Necessary as we want to keep backtracking until a changable cell is found instead of going forward.
        if backtracking:
            if cell.getFixed():
                (i, j) = grid.previousCell(i, j)
                continue
            else:
                backtracking = False
        
        # If the cell is fixed, go to the next available
        if cell.getFixed():
            if grid.nextCell(i, j) == -1: # If the last cell is fixed, then we have found all values.
                return grid
            (i, j) = grid.nextCell(i, j)
            continue
        
        # Increment the cell
        cell.setValue(cell.getValue() + 1)

        # If incrementing the cell makes it larger than 9, then we have exhausted all values. Time to backtrack.
        if cell.getValue() > 9:
            cell.setValue(0)
            backtracking = True
            (i, j) = grid.previousCell(i, j)
            continue

        # Print the grid so we can see the algorithm working.
        grid.printGrid()
        
        # Check that the new value has not broken sudoku rules. If it has, Go to the next number. If no larger number is valid either, backtrack.
        while sum( [ check(x, grid, i, j) for x in ['row', 'column', 'box'] ] ) < 3:
            grid.printGrid()
            cell.setValue(cell.getValue() + 1)
            if cell.getValue() >= 10:
                cell.setValue(0)
                
                backtracking = True
                break

        # In order to get to the beginning of the "while true" statement, we must use the backtracking argument at the end, to avoid going forward.
        if backtracking:
            (i, j) = grid.previousCell(i, j)
            continue

        # If there is no next cell, we are done.
        if grid.nextCell(i, j) == -1:
            return grid
        else:
            (i, j) = grid.nextCell(i, j)

# grid = Grid([6, 8, 0, 0, 0, 7, 3, 0, 0,
#              0, 0, 1, 8, 0, 0, 0, 0, 2,
#              4, 0, 0, 0, 0, 0, 0, 8, 0,
#              0, 0, 9, 7, 0, 1, 0, 4, 3,
#              0, 0, 0, 0, 3, 0, 6, 0, 7,
#              0, 0, 0, 0, 0, 0, 0, 9, 0,
#              0, 0, 6, 0, 0, 0, 9, 0, 4,
#              0, 0, 7, 0, 5, 8, 0, 0, 0,
#              0, 9, 0, 0, 0, 0, 0, 0, 0])

# test 2
# grid = Grid([9, 1, 0, 0, 0, 7, 3, 0, 0,
#              0, 0, 0, 0, 9, 0, 5, 0, 0,
#              6, 0, 0, 0, 0, 4, 0, 0, 7,
#              8, 7, 0, 4, 0, 0, 0, 0, 0,
#              2, 0, 6, 0, 8, 0, 0, 0, 3,
#              0, 0, 9, 0, 0, 0, 8, 0, 0,
#              0, 3, 0, 0, 0, 0, 0, 8, 5,
#              0, 0, 0, 6, 0, 0, 0, 0, 0,
#              0, 0, 4, 0, 0, 0, 2, 1, 0])

grid = Grid([0, 8, 5, 3, 0, 0, 4, 9, 7,
             7, 3, 4, 9, 0, 0, 1, 2, 0, 
             2, 1, 9, 0, 4, 7, 0, 8, 3,
             3, 4, 0, 1, 0, 9, 0, 7, 8,
             0, 0, 0, 0, 7, 4, 9, 3, 1, 
             1, 9, 7, 0, 3, 0, 0, 4, 0,
             9, 0, 0, 7, 0, 0, 3, 0, 4,
             4, 7, 3, 5, 0, 0, 8, 0, 9,
             0, 0, 1, 4, 9, 3, 7, 0, 2])

solve(grid).printGrid()