import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import View from './components/View';
import Create from './components/Create';
import Edit from './components/Edit';
import Practice from './components/Practice';
import './scss/App.scss'

import firebase from 'firebase/app'
import { firebaseConfig } from './ts/configs';
import 'firebase/auth'
import 'firebase/firestore'

if (firebase.apps.length) {
  firebase.app()
} else {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const db = firebase.firestore()

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
          <Switch>
            <Route path="/duo-cards" exact component={Home} />
            <Route path="/duo-cards/view/:id" exact component={View} />
            <Route path="/duo-cards/create" exact component={Create} />
            <Route path="/duo-cards/edit/:id" exact component={Edit} />
            <Route path="/duo-cards/practice/:id" exact component={Practice} />
          </Switch>
      </div>
    </Router>
  )
}

export default App
