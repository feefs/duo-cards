from flask import Flask, request
from api import DuoTranslator
import json

app = Flask(__name__)
dt = None

@app.route('/query', methods=['GET'])
def query():
    data = request.get_json()
    start_days_ago = data['start']['days']
    start_weeks_ago = data['start']['weeks']
    end_days_ago = data['end']['days']
    end_weeks_ago = data['end']['weeks']
    lower_strength = data['strength'][0]
    upper_strength = data['strength'][1]
    return json.dumps(dt.query_words(start_days_ago, start_weeks_ago, end_days_ago, end_weeks_ago,
                                     lower_strength, upper_strength), ensure_ascii=False)

@app.route('/translate', methods=['GET'])
def translate():
    data = request.get_json()
    return json.dumps(dt.translation(data['word_list']), ensure_ascii=False)

if __name__ == '__main__':
    print("\033[36m" + 'Initializing DuoTranslator...' + "\033[0m")
    dt = DuoTranslator()
    print("\033[36m" + 'Running Flask...' + "\033[0m")
    app.run(debug=False)
