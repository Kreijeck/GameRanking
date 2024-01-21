from flask import Flask, render_template, request, redirect, url_for

from lib.yaml_ops import load_games, load_ranking_all, save_ranking, delete_user_in_ranking
from lib.utils import calc_sum, get_users

app = Flask(__name__)



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

@app.route('/view_results/<list_name>')
def view_results(list_name):
    # Lade die Ergebnisse aus der 'rankings.yaml'-Datei
    # Verarbeitung, um die notwendigen Daten für die Anzeige zu erhalten
    # (Diese Logik muss noch implementiert werden)
    sum_list = calc_sum(list_name)
    user_list = get_users(list_name)
    return render_template('view_results.html', list_name=list_name, game_data=sum_list, user_list=user_list)

@app.route('/show_rankings')
def show_rankings():
    try:
        rankings = load_ranking_all()
    except FileNotFoundError:
        rankings = {}
    
    return render_template('show_rankings.html', rankings=rankings)

@app.route('/delete_user/<list_name>/<user_name>', methods=['POST'])
def delete_user(list_name, user_name):
    
    delete_user_in_ranking(list_name, user_name)

    return redirect(url_for('show_rankings'))



if __name__ == '__main__':
    app.run(debug=True)
