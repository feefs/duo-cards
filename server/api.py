from dotenv import dotenv_values
from duolingo import Duolingo
from googletrans import Translator
from datetime import datetime, timedelta

class DuoTranslator():
    def __init__(self):
        envars = dict(dotenv_values())
        self.duo = Duolingo(envars['USER'], envars['PASS'])
        self.translator = Translator()
        self.fetch_words()

    def fetch_words(self):
        fetched = self.duo.get_vocabulary('ja')['vocab_overview']
        unwanted = ['gender', 'id', 'infinitive', 'last_practiced',
                    'lexeme_id', 'normalized_string', 'pos', 'related_lexemes']
        for w in fetched:
            for u in unwanted:
                del w[u]
        self.words = fetched
        self.last_fetched = int(datetime.now().timestamp())

    def query_words(self, start_days_ago=0, start_weeks_ago=0, end_days_ago=0, end_weeks_ago=0,
                    low_strength=1, high_strength=4):
        current_dt = datetime.now()
        to_ms = lambda d, w: (current_dt - timedelta(days=d, weeks=w)).timestamp() * 1000
        start_ms = to_ms(start_days_ago, start_weeks_ago)
        end_ms = to_ms(end_days_ago, end_weeks_ago)

        if start_days_ago == 0 and start_weeks_ago == 0:
            start_ms = 0

        def filter_func(w):
            valid_time = start_ms <= w['last_practiced_ms'] and w['last_practiced_ms'] <= end_ms
            valid_strength = low_strength <= w['strength_bars'] and w['strength_bars'] <= high_strength
            return valid_time and valid_strength

        return [{'last_fetched': self.last_fetched}] + list(sorted(filter(filter_func, self.words), key=lambda w: w['strength']))

    def translation(self, word_list, reverse=False):
        result = []

        for w in word_list:
            source = 'ja'
            destination = 'en'
            if reverse:
                source, destination = destination, source

            d = vars(self.translator.translate(w, src=source, dest=destination))()
            parsed = d['extra_data']['parsed']
            word_entry = {}

            word_entry['origin'] = d['origin']
            word_entry['translation'] = d['text'].lower()
            word_entry['pos'] = None
            word_entry['defs'] = []

            if len(parsed) > 2:
                options = self.pos_options(parsed)
                word_entry['pos'] = options[0]['pos']
                word_entry['defs'] = options

            result.append(word_entry)

        return result

    def pos_options(self, parsed):
        result = []
        parts_of_speech = parsed[3][5][0]

        for p in parts_of_speech:
            entry = {}
            entry['pos'] = p[0]
            definitions = [{d[0]: d[2]} for d in p[1]]
            entry['defs'] = definitions
            result.append(entry)

        return result
