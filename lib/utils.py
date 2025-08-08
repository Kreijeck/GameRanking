from lib.yaml_ops import load_ranking, load_games
#from yaml_ops import load_ranking

def print_it():

    print(load_ranking("Spielliste 1"))


def _get_game_keys(spielliste: str) -> list:
    return [game for game in load_games().get(spielliste, [])]

def _get_ranks(spielliste: str) -> list[dict]:
    try:
        rankings = load_ranking(spielliste)
        if not rankings:
            return []
        return [rank.get('rankings', {}) for rank in rankings if rank.get('rankings')]
    except Exception as e:
        print(f"Fehler in _get_ranks: {e}")
        return []
    
def get_users(spielliste: str) -> list:
    try:
        rankings = load_ranking(spielliste)
        if not rankings:
            return []
        return [user.get('user', "") for user in rankings if user.get('user')]
    except Exception as e:
        print(f"Fehler in get_users: {e}")
        return []

def calc_sum(spielliste: str) -> dict:
    try:
        game_keys = _get_game_keys(spielliste)
        ranks = _get_ranks(spielliste)
        
        if not game_keys or not ranks:
            return {}
        
        results = {}
        
        for game in game_keys:
            sum = 0
            for rank in ranks:
                if rank and game in rank and rank[game] and str(rank[game]).isdigit():
                    sum += int(rank[game])
            results[game] = sum

        return results
    except Exception as e:
        print(f"Fehler in calc_sum: {e}")
        return {}

def calc_detailed_data(spielliste: str) -> dict:
    """
    Berechnet detaillierte Daten für Tooltips mit User-spezifischen Punkten.
    Gibt ein Dictionary zurück mit Spiel -> {sum, users: [{user, points}]}
    """
    try:
        game_keys = _get_game_keys(spielliste)
        ranking_data = load_ranking(spielliste)
        
        if not game_keys or not ranking_data:
            return {}
        
        results = {}
        
        for game in game_keys:
            game_sum = 0
            user_points = []
            
            for entry in ranking_data:
                if not entry:
                    continue
                    
                user = entry.get('user', '')
                rankings = entry.get('rankings', {})
                
                if not rankings or game not in rankings:
                    continue
                
                rank_value = rankings.get(game, '')
                
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
    except Exception as e:
        print(f"Fehler in calc_detailed_data: {e}")
        return {}
