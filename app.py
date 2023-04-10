import csv
import matplotlib.pyplot
from flask import Flask, request
import random
import json

sudokus = []
solutions = []
difficulties = []

welcome_messages = [ "Welcome to our Sudoku app!",
    "It's great to have you here!",
    "We hope you enjoy playing Sudoku with us!",
    "Thanks for choosing our app for your Sudoku adventure!",
    "It's time to sharpen your mind with some Sudoku!",
    "Let's get started with some Sudoku challenges!",
    "Welcome to our community of Sudoku enthusiasts!",
    "We're excited to have you join us for some Sudoku fun!",
    "Are you ready to put your Sudoku skills to the test?",
    "Let's see how well you can solve these Sudoku puzzles!",
    "Welcome to the world of Sudoku!",
    "We're glad you're here to play Sudoku with us!",
    "Get ready for some serious Sudoku challenges!",
    "Let's start solving some Sudoku puzzles!",
    "We're thrilled to have you here to enjoy Sudoku!",
    "Welcome to your new Sudoku addiction!",
    "We hope you're ready for some challenging Sudoku!",
    "Get your thinking cap on for some Sudoku puzzles!",
    "Let's see how fast you can solve these Sudoku puzzles!",
    "Welcome to the world of Sudoku where every puzzle is a new adventure!",
    "We're excited to see how well you can do on these Sudoku puzzles!",
    "Let's get started on some exciting Sudoku puzzles!",
    "Good luck with your Sudoku challenges!",
    "Let's put your Sudoku skills to the test!",
    "Welcome to the best Sudoku app out there!",
    "It's time to exercise your brain with some Sudoku puzzles!",
    "Get ready for some brain-teasing Sudoku challenges!",
    "We're thrilled to have you here to enjoy Sudoku with us!",
    "It's time to put your Sudoku skills to the test!",
    "Let's see how well you can do on these Sudoku puzzles!",
    "We're excited to see what you can do with these Sudoku challenges!",
    "Let's get started on some fun Sudoku puzzles!",
    "Good luck and happy Sudoku solving!",
    "Let's see how fast you can solve these Sudoku puzzles!",
    "Welcome to the ultimate Sudoku challenge!",
    "We hope you enjoy solving Sudoku puzzles with us!",
    "Get ready for some exciting Sudoku challenges!",
    "Let's get started on some challenging Sudoku puzzles!",
    "We're excited to have you join us for some Sudoku fun!",
    "It's time to put your Sudoku skills to the test!",
    "Let's see how well you can do on these tricky Sudoku puzzles!",
    "Get ready for some mind-bending Sudoku challenges!",
    "We're thrilled to have you here for some Sudoku fun!",
    "Welcome to our Sudoku app where the puzzles never end!",
    "It's time to put your Sudoku skills to the test!",
    "Let's see how fast you can solve these Sudoku puzzles!",
    "We're excited to see what you can do with these Sudoku challenges!",
    "Get ready for some intense Sudoku puzzles!",
    "Let's get started on some brain-busting Sudoku challenges!",
    "Welcome to the world of Sudoku, where every puzzle is a new adventure!"]

# To get difficulty of sudoku with x missing, diff = ((x - 4) / 54) * 100. Can be done on 

app = Flask(__name__)

def getDifficulty(sudoku):
    c = 0
    for i in sudoku:
        if i == "0":
            c += 1
    return ((c - 4) / 54) * 100

with open("sudoku.csv", newline="") as csvfile:
    f = csv.reader(csvfile, delimiter=",", quotechar="|")
    for row in f:
        if row[0] == "puzzle":
            continue
        sudokus.append(row[0])
        solutions.append(row[1])
        
        difficulties.append(getDifficulty(sudokus[len(sudokus) - 1]))

@app.route("/sudoku")
def getSudoku():
    difficulty = float(request.args.get('difficulty'))
    indexes = [i for i in range(len(sudokus)) if difficulty - 2 < difficulties[i] < difficulty + 2]
    index = random.choice(indexes)
    return  {
        "puzzle":sudokus[index], 
        "solution":solutions[index],
        "difficulty":difficulties[index]
    }

@app.route("/localUpdate")
def updateLocal():
    total = len(sudokus)
    indexes = []
    for i in range(500):
        indexes.append(random.randint(0, total))
    return {
        "puzzles": [sudokus[i] for i in indexes],
        "solutions": [solutions[i] for i in indexes],
        "difficulties": [difficulties[i] for i in indexes]
    }

@app.route("/solve", methods=["POST"])
def solveSudoku():
    # idea: start the solving algorithm and add sudoku to a list of sudoku solve requests. return the index of the list from "start solve" function
    # Then create a "incremental update" for the sudoku solving request - 1 per second will be sent to the server to update the sudoku client-side.
    # incremental update will take argument of sudoku. Read danger as anyone can send random argument and get current state of another sudoku being solved - but its just a sudoku, who cares.
    sudoku = json.loads(request.json)
    print(sudoku)

@app.route("/message")
def message():
    return {'message':random.choice(welcome_messages)}