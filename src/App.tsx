import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import firebase from 'firebase/app'
import config from './ts/firebase-config';
import 'firebase/auth'
import 'firebase/firestore'

import Header from './components/Header';
import Home from './components/Home';
import Create from './components/Create';
import View from './components/View';
import Edit from './components/Edit';
import Practice from './components/Practice';
import './scss/App.scss'

if (firebase.apps.length) {
  firebase.app()
} else {
  firebase.initializeApp(config)
}

export const auth = firebase.auth()
export const db = firebase.firestore()

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/create" exact component={Create}/>
            <Route path="/view/:id" exact component={View}/>
            <Route path="/edit/:id" exact component={Edit}/>
            <Route path="/practice/:id" exact component={Practice}/>
          </Switch>
      </div>
    </Router>
  )
}

export default App
