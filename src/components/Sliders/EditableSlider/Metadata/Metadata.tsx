import { useEffect, useState } from 'react';

import { Metadata as MetadataType } from '../../../../data/types';

interface MetadataProps {
  data: MetadataType;
}

export function Metadata(props: MetadataProps): JSX.Element {
  const { strength, similar_translations, skill, skill_url_title } = props.data;

  const [similar, setSimilar] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const copy = [...similar_translations];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i - 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    if (similar_translations.length > 0) {
      setSimilar(
        <>
          {copy.map((translation, index) => (
            <a
              key={index}
              className="similar"
              href={`https://translate.google.com/?sl=ja&tl=en&text=${translation}&op=translate`}
              rel="noreferrer"
              target="_blank"
            >
              {translation + (index === similar_translations.length - 1 ? '' : ', ')}
            </a>
          ))}
        </>
      );
    }
  }, [similar_translations]);

  return (
    <div className="metadata">
      <div>Strength: {<span className="strength">{(strength * 100).toFixed(2) + '%'}</span>}</div>
      {similar ? <div>Similar: {similar}</div> : null}
      <div>
        Lesson:
        <a
          className="lesson"
          href={`https://duolingo.com/skill/ja/${skill_url_title}/practice`}
          rel="noreferrer"
          target="_blank"
        >
          {' ' + skill}
        </a>
      </div>
    </div>
  );
}
