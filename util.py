'''util'''
import json

def flush_active_games(filename):
    f = open(filename, 'w')
    f.write(json.dumps([]))
    f.close()

def write_to_activegames(data, filename):
    f = open(filename, 'w')
    f.write(data)
    f.close()

def read_activegames(filename):
    f = open(filename, 'r')
    active_games_json = f.read()
    f.close()
    return active_games_json
