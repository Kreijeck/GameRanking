# GameRanking

Eine Flask-basierte Webanwendung zum Ranking von Spielen in Gruppen.

## Installation

### Lokale Entwicklung

1. Repository klonen:
```bash
git clone https://github.com/Kreijeck/GameRanking.git
cd GameRanking
```

2. Virtuelle Umgebung erstellen und aktivieren:
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
```

3. Dependencies installieren:
```bash
pip install -r requirements.txt
```

4. Daten-Dateien initialisieren:
```bash
python init_data.py
```

5. Anwendung starten:
```bash
python main.py
```

Die Anwendung ist dann unter `http://localhost:5000` erreichbar.

## Datenstruktur

Die Anwendung verwendet YAML-Dateien zur Datenspeicherung:

- `data/games_list.yaml` - Enthält die Spielelisten (nicht im Repository)
- `data/rankings.yaml` - Enthält die Benutzerbewertungen (nicht im Repository)
- `data/*.template` - Template-Dateien für die Datenstruktur

**Hinweis:** Die echten Daten-Dateien sind in `.gitignore` ausgeschlossen, da sie serverabhängig sind und sich häufig ändern.

## Produktionsdeployment

Für die Produktionsumgebung mit Nginx, Gunicorn und MariaDB:

```bash
sudo chmod +x deploy.sh
sudo ./deploy.sh
```

## Projektstruktur

```
GameRanking/
├── main.py                 # Haupt-Flask-Anwendung
├── lib/                    # Bibliotheken
│   ├── utils.py           # Hilfsfunktionen
│   └── yaml_ops.py        # YAML-Operationen
├── templates/             # HTML-Templates
├── static/                # Statische Dateien (CSS, JS)
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript-Dateien
├── data/                  # Daten-Verzeichnis
│   ├── *.template         # Template-Dateien
│   ├── games_list.yaml    # Spielelisten (gitignored)
│   └── rankings.yaml      # Rankings (gitignored)
└── deploy.sh              # Deployment-Script
```