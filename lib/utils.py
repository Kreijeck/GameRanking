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
