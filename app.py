import flask
from flask import Flask, render_template, request, url_for

import json
import os
import subprocess
import time
from util import *

database = 'activegames.json'

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
        print('  DB: %r' %data)

    return render_template('index.html')


@app.route('/join', methods=['POST'])
def join():
    '''join an active game'''
    if request.method == 'POST':
        print('POST on /join')  
        data = json.loads(request.data)
        print('  DB: %r' %data)

        # >> LAUNCH THE AGE BINARIES !!!
        rc = subprocess.call('./run.sh')

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
