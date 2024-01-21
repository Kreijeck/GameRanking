from flask import Flask, render_template, request, redirect, url_for
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

@app.route('/list/<list_name>', methods=['GET', 'POST'])
def list_details(list_name):
    games_lists = load_games()
    games = games_lists.get(list_name, [])

    if request.method == 'POST':
        name = request.form.get('name')
        rankings = {game: request.form.get(f'rank-{game}') for game in games}
        save_ranking(list_name, name, rankings)
        return redirect(url_for('index'))

    return render_template('list_details.html', list_name=list_name, games=games)

def save_ranking(list_name, user_name, rankings):
    # Lese vorhandene Rankings
    try:
        with open('rankings.yaml', 'r') as file:
            all_rankings = yaml.safe_load(file) or {}
    except FileNotFoundError:
        all_rankings = {}

    # Füge neue Rankings hinzu
    if list_name not in all_rankings:
        all_rankings[list_name] = []
    all_rankings[list_name].append({'user': user_name, 'rankings': rankings})

    # Speichere die aktualisierten Rankings
    with open('rankings.yaml', 'w') as file:
        yaml.dump(all_rankings, file)

if __name__ == '__main__':
    app.run(debug=True)
