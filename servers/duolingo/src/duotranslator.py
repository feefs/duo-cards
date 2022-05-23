from time import time
from dotenv import dotenv_values
from duolingo import Duolingo
from googletrans import Translator

ENV_VARS = dict(dotenv_values())
VOCAB_KEYS = ['word_string', 'strength', 'last_practiced_ms', 'skill', 'skill_url_title']

class DuoTranslator():
  def __init__(self):
    duo = Duolingo(ENV_VARS['DUOLINGO_USER'], ENV_VARS['DUOLINGO_PASS'])
    vocab = duo.get_vocabulary('ja')['vocab_overview']
    vocab = list(map(lambda entry: {key: entry[key] for key in VOCAB_KEYS}, vocab))
    vocab.sort(key=lambda entry: entry['last_practiced_ms'])

    self.vocab = vocab
    self.translator = Translator()

  def query_words(
      self,
      start_days_ago,
      end_days_ago,
      low_threshold=0,
      high_threshold=1,
      num_cards=10
  ):
    current_time = time()
    start_ms = (current_time - (start_days_ago * 24 * 60 * 60)) * 1000
    end_ms = (current_time - (end_days_ago * 24 * 60 * 60)) * 1000

    words = list(
        filter(
            lambda entry: (start_ms <= entry['last_practiced_ms'] <= end_ms) and
            (low_threshold <= entry['strength'] <= high_threshold),
            self.vocab
        )
    )[-1 * num_cards:]

    response = []
    for w in words:
      translated = vars(self.translator.translate(w['word_string'], src='ja', dest='en'))()
      card = {}
      metadata = {key: w[key] for key in ['strength', 'skill', 'skill_url_title']}
      metadata['similar_translations'] = []

      card['en'] = translated['text'].lower()
      card['ja'] = w['word_string']
      card['pos'] = ''
      card['pronunciation'] = translated['extra_data']['origin_pronunciation'].lower()
      card['metadata'] = metadata

      parsed = translated['extra_data']['parsed']
      if len(parsed) >= 4:
        if parsed[3][5] and parsed[3][5][0]:
          pos = parsed[3][5][0][0]
          translations = []
          for translation in (row[2] for row in pos[1]):
            translations.extend(translation)
          translations = list(
              filter(lambda translation: translation != w['word_string'],
                     translations)
          )[:3]
          card['pos'] = pos[0]
          metadata['similar_translations'] = translations

      response.append(card)

    return response
