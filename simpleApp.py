
from flask import Flask, render_template


app2 = Flask(__name__)



@app2.route('/')
def index():
    games_lists =   ["Heat", "Barrage", "Gaia"]

    return render_template('index_simple.html', games_lists=games_lists)

if __name__ == "__main__":
    app2.run(debug=True)