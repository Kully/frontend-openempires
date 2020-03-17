import flask
from flask import Flask, render_template, request, url_for

import json
import os
import subprocess
import time
from util import *

database = 'activegames.json'
GAME_PATH = "$HOME/Wine Files/drive_c/Program Files/Microsoft Games/Age of Empires II Trial/Data/"
XRES = 1200
YRES = 750

app = Flask(__name__)
flush_active_games(database)


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/games', methods=['GET'])
def games():
    '''get a list of games'''
    if request.method == 'GET':
        print('GET on /games')
        activegames = read_activegames(database)
        print('  DB: %r' %activegames)

    return render_template('index.html')


@app.route('/join', methods=['POST'])
def join():
    '''join an active game'''
    if request.method == 'POST':
        print('POST on /join')  
        game = json.loads(request.data)
        print(game)

        name = game['name']
        port = game['port']
        try:
            players = str(int(game['players']) + 1)
        except ValueError:
            players = game['players']

        print('start a server')
        os.system(f'../openempires/./openempires --server --port {port} --users {players}')
        
        # print('start a client')
        # subprocess.call(f'./openempires --host localhost --port {port} --xres 1440 --yres 900 --path "{GAME_PATH}')

    return render_template('index.html')


@app.route('/create', methods=['POST'])
def create():
    '''create a new game'''
    if request.method == 'POST':
        print('POST on /create')
        data = json.loads(request.data)

        # add game to activegames
        with open(database, 'r') as f:
            activegames = json.load(f)
            activegames.append(data)
            activegames_update = activegames
            
        with open(database, 'w') as f:
            f.write(json.dumps(activegames_update))

        print('  DB: %r' %activegames)

    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
