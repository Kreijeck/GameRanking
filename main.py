import os
from flask import Flask, render_template, request, redirect, url_for

from lib.yaml_ops import load_games, load_ranking_all, save_ranking, delete_user_in_ranking, save_new_game_list, delete_game_list
from lib.utils import calc_sum, get_users, calc_detailed_data

app = Flask(__name__)

# Passwort für Admin-Funktionen (in Produktion sollte dies in einer Konfigurationsdatei oder Umgebungsvariable stehen)
ADMIN_PASSWORD = "kreijecksworld"



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
    sum_list = calc_sum(list_name)
    detailed_data = calc_detailed_data(list_name)
    user_list = get_users(list_name)
    return render_template('view_results.html', list_name=list_name, 
                         game_data=sum_list, detailed_data=detailed_data, user_list=user_list)

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

@app.route('/new_list', methods=['GET', 'POST'])
def new_list():
    error_message = None
    
    if request.method == 'POST':
        password = request.form.get('password')
        
        if password != ADMIN_PASSWORD:
            error_message = "Falsches Passwort!"
        else:
            list_name = request.form.get('list_name')
            games_input = request.form.get('games')
            
            # Teile die Spiele auf (getrennt durch Zeilenumbrüche oder Kommas)
            games = [game.strip() for game in games_input.replace(',', '\n').split('\n') if game.strip()]
            
            if list_name and games:
                save_new_game_list(list_name, games)
                return redirect(url_for('index'))
            else:
                error_message = "Bitte füllen Sie alle Felder aus!"
    
    return render_template('new_list.html', error_message=error_message)

@app.route('/delete_list', methods=['GET', 'POST'])
def delete_list():
    games_lists = load_games()
    error_message = None
    success_message = None
    
    if request.method == 'POST':
        password = request.form.get('password')
        list_name = request.form.get('list_name')
        
        if password != ADMIN_PASSWORD:
            error_message = "Falsches Passwort!"
        elif not list_name:
            error_message = "Bitte wählen Sie eine Liste zum Löschen aus!"
        else:
            if delete_game_list(list_name):
                success_message = f"Liste '{list_name}' wurde erfolgreich gelöscht!"
                games_lists = load_games()  # Liste neu laden
            else:
                error_message = "Fehler beim Löschen der Liste!"
    
    return render_template('delete_list.html', games_lists=games_lists, 
                         error_message=error_message, success_message=success_message)



if __name__ == '__main__':
    # Abrufen des Ports aus der Umgebungsvariable
    port = int(os.environ.get('PORT', 5000))  # Standardwert 5000, falls die Umgebungsvariable nicht gesetzt ist
    app.run(host='0.0.0.0', port=port)
