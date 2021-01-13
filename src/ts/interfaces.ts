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
    
    metadata?: any
    defs?: any
    flipped?: boolean
}

export interface DeckSchema {
    cards: CardSchema[]
    created: firebase.firestore.Timestamp | null
    creator_uid: string
    name: string
    last_edited?: firebase.firestore.Timestamp | undefined
    last_practiced?: firebase.firestore.Timestamp | undefined

    docID?: string
}

export interface UserSchema {
    visits: number
}

export interface SlideEditorProps {
    user: any
    deckName: string
    setDeckName: Function
    cardlist: CardSchema[]
    setCardlist: Function
    cardID: number
    setCardID: Function
    deckID?: string
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
    cardlist: CardSchema[]
    setCardlist: Function
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
