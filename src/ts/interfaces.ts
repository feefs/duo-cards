import firebase from 'firebase/app';
import { RouteComponentProps } from 'react-router-dom';
import { History, Location, LocationState } from 'history';

export interface CuratedCard {
    name: string
    parameters: string
    num: number
}

export interface CardSchema {
    ja: string
    pronunciation: string
    en: string
    pos: string
    id: number
    flipped?: boolean
}

export interface DeckSchema {
    cards: CardSchema[]
    created: firebase.firestore.Timestamp | null
    creator_uid: string
    name: string
    docID?: string
    last_edited?: firebase.firestore.Timestamp | undefined
    last_practiced?: firebase.firestore.Timestamp | undefined
}

export interface UserSchema {
    visits: number
}

export interface SlideEditorProps {
    user: any
    deckName: string
    setDeckName: Function
    cards: CardSchema[]
    setCards: Function
    ID: number
    setID: Function
    deckID?: string
    ret?: boolean
}

export interface CardProps {
    cardData: CardSchema
    setJa: Function
    setPronunciation: Function
    setEn: Function
    setPos: Function
}

interface Match {
    id: string
}

export interface MatchProps extends RouteComponentProps<Match> {}

export interface PracticeSlidesProps {
    deckName: string
    cards: CardSchema[]
    setCards: Function
    deckID: string
}

export interface PracticeCardProps {
    cardData: CardSchema
    jaFocus: boolean
}

export interface HistType extends History<LocationState> {}

export interface LocType extends Location {
    state: {
        name: string
        curateParameters: string
        numCards: number
    }
}
