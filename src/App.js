import React, { Component } from 'react';
import './App.css';
import "react-router";
import { BrowserRouter, Route, NavLink, Redirect} from 'react-router-dom';

var value = 1;
var coins = 0;
var ledger = [];
var id = 1;

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className = "App">
          <img src = "https://www.japan-guide.com/g3/3915_05.jpg" alt = ""></img>
          <div id = "top">
            <NavLink to = "/home" activeClassName = "here" >Home</NavLink> | 
            <NavLink to = "/mine" activeClassName = "here">Mine Coins</NavLink> | 
            <NavLink to = "/buy" activeClassName = "here">Buy Coins</NavLink> | 
            <NavLink to = "/sell" activeClassName = "here">Sell Coins</NavLink> | 
            <NavLink to = "/ledger" activeClassName = "here">Browse Ledger</NavLink>
          </div>
          <div id = "main">
            <Redirect exact from = "/" to = "/home" />
            <Route path = "/home" component = {Home} />
            <Route path = "/mine" component = {Mine} />  
            <Route path = "/buy" component = {Buy} />  
            <Route path = "/sell" component = {Sell} />  
            <Route path = "/ledger" component = {Ledger} />
            <Route path = "/transaction/:id" component = {Transaction} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div id = "home">
        <h1>ShintoCoin Homepage</h1><br></br>
        <h4>Welcome to ShintoCoins! Earn coins by solving the questions shown
            in the "Mine Coins" page correctly!</h4>
        <h4>Buy coins and increase the value of the coins!</h4>
        <h4>You can also sell coins, but be careful! The values of the
            coins will decrease if you do!</h4>
        <h4>Click on "Browser Ledger" to view the history of your transactions
            on this website!</h4>
      </div>
    )
  }
}

class Mine extends Component {
  constructor(props) {
      super(props);
      this.state = {
          answer: "",
          yes: "",
          no: ""
      };
      this.handleChange = this.handleChange.bind(this);
      this.submit = this.submit.bind(this);
  }

  handleChange(event) {
      var answer = event.target.value;
      this.setState({answer: answer});
  }

  submit(e) {
      e.preventDefault();
      if (this.state.answer.includes("Moon") || this.state.answer.includes("moon")) {
          this.setState({yes: "Correct! Your ShintoCoin value has increased!", no: ""});
          value = value + 1;
          ledger.push({action: "Mined", amount: 1, value: value, id: id});
          id++;
      }
      else {
          this.setState({yes: "", no: "Wrong answer. Try again."});
      }
      this.setState({answer: ""});
  }

  render() {
    return (
      <div id = "mine">
        <h1>Mine Coins</h1><br></br>
        <h5>Solve the following question correctly, and you will increase the value
        of the ShintoCoin by one bit!</h5><br></br>

        <form onSubmit = {this.submit}>
          <h5>What does Princess Luna raise every night? </h5>
          <div className = "yes">{this.state.yes}</div>
          <div className = "no">{this.state.no}</div>
          <input type = "text" name = "answer" value = {this.state.answer}
          onChange = {this.handleChange} placeholder = "Your answer here"></input>
          
          <input type = "submit" className = "btn btn-primary" value = "Answer"></input>
        </form>
      </div>
    )
  }
}

class Buy extends Component {
  constructor(props) {
    super(props);
    this.state = {
        buy: "",
        buyError: "",
        submit: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    var buy = event.target.value;
    this.setState({buy: buy});

    if (buy < 1) {
      this.setState({buyError: "Invalid value", submit: false});
    }
    else {
      this.setState({buyError: "", submit: true});
    }
  }

  submit(e) {
    e.preventDefault();
    ledger.push({action: "Bought", amount: this.state.buy, value: value, id: id});
    value = value + 1;
    coins = coins + parseInt(this.state.buy);
    this.setState({buy: ""});
    id++;
  }

  render() {
    var bits;
    if (value === 1) {
      bits = "bit";
    }
    else {
      bits = "bits";
    }
    return (
      <div id = "buy">
        <h1>Buy ShintoCoins</h1><br></br>
        <h4>Current ShintoCoin value: {value} {bits}</h4>
        <h4>Number of ShintoCoins owned: {coins}</h4><br></br>

        <form onSubmit = {this.submit}>
            <div className = "error">{this.state.buyError}</div>
            <input type = "number" name = "buy" value = {this.state.buy}
            onChange = {this.handleChange} size = "number"></input>
            
            <input type = "submit" className = "btn btn-success" value = "Buy"
            disabled = {!this.state.submit}></input>
        </form>
      </div>
    )
  }
}

class Sell extends Component {
  constructor(props) {
    super(props);
    this.state = {
        sell: "",
        sellError: "",
        submit: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    var sell = event.target.value;
    this.setState({sell: sell});

    if (sell < 1) {
      this.setState({sellError: "Invalid value", submit: false});
    }
    else if (sell > coins) {
      this.setState({sellError: "You do not have enough coins", submit: false});
    }
    else {
      this.setState({sellError: "", submit: true});
    }
  }

  submit(e) {
    e.preventDefault();
    ledger.push({action: "Sold", amount: this.state.sell, value: value, id: id});
    if (value > 1) {
      value = value - 1;
    }
    coins = coins - parseInt(this.state.sell);
    id++;
    this.setState({sell: ""});
  }

  render() {
    var bits;
    if (value === 1) {
      bits = "bit";
    }
    else {
      bits = "bits";
    }

    return (
      <div id = "sell">
        <h1>Sell ShintoCoins</h1><br></br>
        <h4>Current ShintoCoin value: {value} {bits}</h4>
        <h4>Number of ShintoCoins owned: {coins}</h4><br></br>

        <form onSubmit = {this.submit}>
            <div className = "error">{this.state.sellError}</div>
            <input type = "number" name = "sell" value = {this.state.sell}
            onChange = {this.handleChange} size = "number"></input>
            
            <input type = "submit" className = "btn btn-secondary" value = "Sell"
            disabled = {!this.state.submit}></input>
        </form>
      </div>
    )
  }
}

class Ledger extends Component {
  render() {
    var all = ledger.map((l, i) => {
      return (
        <tr key = {i}><td>{l.action}</td><td>{l.amount}</td><td>{l.value}</td>
        <td><NavLink to = {"/transaction/" + l.id}><button className = "btn btn-info">
        View</button></NavLink></td></tr>
      )
    });

    return (
      <div id = "ledger">
        <h1>Browse the Ledger</h1><br></br>
        <h3>Browse all of your transactions here. Click on the "View" button to
          see each of your transactions. </h3>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Amount</th>
              <th>Value</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {all}
          </tbody>
        </table>
      </div>
    )
  }
}

class Transaction extends Component {
  render() {
    var id = this.props.match.params.id;
    var action = ledger[id - 1].action;
    var amount = parseInt(ledger[id - 1].amount);
    var value = ledger[id - 1].value;
    var shinto;
    var bits;

    if (amount === 1) {
      shinto = "Shintocoin";
    }
    else {
      shinto = "Shintocoins";
    }

    if (value === 1) {
      bits = "bit";
    }
    else {
      bits = "bits";
    }

    return (
      <div id = "transaction">
        <h1>Ledger Transaction Details</h1><br></br>
        <h3>Detailed view of a transaction from the ledger</h3><br></br>
        <h4>Transaction: #{id}</h4>
        <div id = "one">
          <h4><b>{action}</b> {amount} {shinto}</h4>
          <h4>ShintoCoin value: {value} {bits}</h4>
        </div>
      </div>
    )
  }
}

export default App;
