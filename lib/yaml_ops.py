import yaml
import os

DATADIR = 'data'
RANKING_YAML = os.path.join(DATADIR, 'rankings.yaml')
GAMELIST_YAML = os.path.join(DATADIR,'games_list.yaml')

def load_yaml(yaml_file: str, root_key: str = None) -> dict:
    with open(yaml_file, 'r') as file:
        data = yaml.safe_load(file)
        if root_key is not None:
            return data.get(root_key, {})
        return data


def load_games() -> dict:
    return load_yaml(GAMELIST_YAML, 'games')

def load_ranking_all() -> dict:
    return load_yaml(RANKING_YAML)

def load_ranking(spielliste: str) -> dict:
    return load_yaml(RANKING_YAML, spielliste)
    
def save_ranking(list_name: str, user_name: str, rankings: dict) -> None:
    # Lese vorhandene Rankings
    try:
        with open(RANKING_YAML, 'r') as file:
            all_rankings = yaml.safe_load(file) or {}
    except FileNotFoundError:
        all_rankings = {}

    # Füge neue Rankings hinzu
    if list_name not in all_rankings:
        all_rankings[list_name] = []
    all_rankings[list_name].append({'user': user_name, 'rankings': rankings})

    # Speichere die aktualisierten Rankings
    with open(RANKING_YAML, 'w') as file:
        yaml.dump(all_rankings, file)

def delete_user_in_ranking(list_name, user_name):
    try:
        with open(RANKING_YAML, 'r') as file:
            rankings = yaml.safe_load(file)
    except FileNotFoundError:
        return "Rankinngs Datei nicht gefunden", 404
    
    if list_name in rankings:
        rankings[list_name] = [entry for entry in rankings[list_name] if entry['user'] != user_name]

        with open(RANKING_YAML, 'w') as file:
            yaml.dump(rankings, file)