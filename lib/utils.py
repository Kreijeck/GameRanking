from lib.yaml_ops import load_ranking, load_games
#from yaml_ops import load_ranking

def print_it():

    print(load_ranking("Spielliste 1"))


def _get_game_keys(spielliste: str) -> list:
    return [game for game in load_games().get(spielliste, [])]

def _get_ranks(spielliste: str) -> list[dict]:
    return [rank.get('rankings') for rank in load_ranking(spielliste)]
    
def get_users(spielliste: str) -> list:
    return[user.get('user', "") for user in load_ranking(spielliste)]

def calc_sum(spielliste: str) -> dict:
    game_keys = _get_game_keys(spielliste)
    ranks = _get_ranks(spielliste)
    
    results = {}
    
    for game in game_keys:
        sum = 0
        for rank in ranks:
            if rank[game].isdigit():
                sum += int(rank[game])
        results[game] = sum

    return results

def calc_detailed_data(spielliste: str) -> dict:
    """
    Berechnet detaillierte Daten für Tooltips mit User-spezifischen Punkten.
    Gibt ein Dictionary zurück mit Spiel -> {sum, users: [{user, points}]}
    """
    game_keys = _get_game_keys(spielliste)
    ranking_data = load_ranking(spielliste)
    
    results = {}
    
    for game in game_keys:
        game_sum = 0
        user_points = []
        
        for entry in ranking_data:
            user = entry.get('user', '')
            rank_value = entry.get('rankings', {}).get(game, '')
            
            if rank_value and str(rank_value).isdigit():
                points = int(rank_value)
                game_sum += points
                user_points.append({
                    'user': user,
                    'points': points
                })
        
        results[game] = {
            'sum': game_sum,
            'users': user_points
        }
    
    return results
