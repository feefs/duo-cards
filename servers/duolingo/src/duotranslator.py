from time import time
from dotenv import dotenv_values
from duolingo import Duolingo

ENV_VARS = dict(dotenv_values())
VOCAB_KEYS = [
    'word_string',
    'strength',
    'strength_bars',
    'last_practiced_ms',
    'skill',
    'skill_url_title'
]

class DuoTranslator():
  def __init__(self):
    duo = Duolingo(ENV_VARS['DUOLINGO_USER'], ENV_VARS['DUOLINGO_PASS'])
    vocab = duo.get_vocabulary('ja')['vocab_overview']
    vocab = list(map(lambda entry: {key: entry[key] for key in VOCAB_KEYS}, vocab))
    vocab.sort(key=lambda entry: entry['last_practiced_ms'])

    self.vocab = vocab

  def query_words(self, start_days_ago, end_days_ago, low_threshold=1, high_threshold=4):
    current_time = time()
    start_ms = (current_time - (start_days_ago * 24 * 60 * 60)) * 1000
    end_ms = (current_time - (end_days_ago * 24 * 60 * 60)) * 1000

    return list(
        filter(
            lambda entry: (start_ms <= entry['last_practiced_ms'] <= end_ms) and
            (low_threshold <= entry['strength_bars'] <= high_threshold),
            self.vocab
        )
    )
