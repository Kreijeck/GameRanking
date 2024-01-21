from flask import Flask, render_template
import yaml

app = Flask(__name__)

yaml_file = 'games_list.yaml'

def load_games():
    with open(yaml_file, 'r') as file:
        data = yaml.safe_load(file)
        return data.get('games', {})

@app.route('/')
def index():
    games_lists = load_games()
    return render_template('index.html', games_lists=games_lists)

@app.route('/list/<list_name>')
def list_details(list_name):
    games_lists = load_games()
    games = games_lists.get(list_name, [])
    return render_template('list_details.html', list_name=list_name, games=games)

if __name__ == '__main__':
    app.run(debug=True)
