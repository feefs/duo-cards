import { CuratedCard } from './interfaces';

/*
name: Name of deck
parameters: {
    start: Date N days + N weeks ago to start looking for words.
    end: Date N days + N weeks ago to stop looking for words
    strength: Range of word strength bars to look for (inclusive)
}
num: Number of cards to fetch.
*/

const recent = {
    name: "Recently Practiced",
    parameters: JSON.stringify({
            start: {"days": 0, "weeks": 1},
            end: {"days": 0, "weeks": 0},
            strength: [1, 4]
        }),
    num: 10
}

const weak = {
    name: "Weak but Recent",
    parameters: JSON.stringify({
        start: {"days": 0, "weeks": 12},
        end: {"days": 0, "weeks": 0},
        strength: [1, 3]
    }),
    num: 10
}

const longLost = {
    name: "Long Lost Words",
    parameters: JSON.stringify({
        start: {"days": 0, "weeks": 0},
        end: {"days": 0, "weeks": 12},
        strength: [1, 2]
    }),
    num: 15
}

const justLearned = {
    name: "Just Learned",
    parameters: JSON.stringify({
        start: {"days": 0, "weeks": 1},
        end: {"days": 0, "weeks": 0},
        strength: [1, 2]
    }),
    num: 10
}

const curatedList: CuratedCard[] = [recent, weak, longLost, justLearned]

export default curatedList
