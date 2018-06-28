import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import {Button} from 'react-bootstrap'
class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      manager:'',
      balance:'',
      players:'',
      value:'',
      message:'',
      showPickWinner:false,
    }
  }
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const accounts =await web3.eth.getAccounts();
    if(accounts[0] == manager){
      this.setState({
        showPickWinner:true,
      })
    }
    this.setState({
      manager,
      players,
      balance,
    })
  
  }

  value =(e) => {
  this.setState({
    value:e.target.value,
  })
  }

  pickWinner = async (e)=>{
    e.preventDefault();
    const accounts =await web3.eth.getAccounts();
    this.setState({
     message: "Winner is being selected"
    })
      await lottery.methods.pickWinner().send({
       from:accounts[0]
      
     })
   const winner =  await lottery.methods.lastWinner().call();
     this.setState({
       message: `${this.state.players[winner]} is the winner`,
     })

  }

  enter= async (e)=>{
    e.preventDefault();
   const accounts =await web3.eth.getAccounts();
   this.setState({
    message: "Your transaction is being processed.Please wait..."
   })
     await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    })
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({
      players,
      balance,
      message:"You successfully entered in to lottery",
    })
  }
  render() {
    console.log(web3.version)
    return (
      <div className="App">
        <header className="App-header">
         <h1>Lottery Dapp</h1>
        </header>
        <p className="App-intro">
      

        Hey! welcome to the lottery dapp.
        </p>
      <p>This dapp is managed by {this.state.manager}.</p>
       
      <p> {this.state.players.length} players are participating in the lottery for a total amount of
         {web3.utils.fromWei(this.state.balance,'ether')} </p>
      
       

        <form onSubmit={this.pickWinner}>
          <label htmlFor="enter">Enter in in lottery</label>

          <input name="enter" onChange={this.value}  placeholder="Enter the lottery amount" />
         <Button bsStyle="primary" onClick={this.enter}>Enter </Button>
         <hr/>
        {this.state.showPickWinner ? <Button type="submit">Pick the winner</Button>:<p></p>} 
        
       </form>   
       <h3>{this.state.message}</h3>
      </div>
    );
  }
}

export default App;
