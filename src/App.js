import React , {Fragment} from "react";
import 'suneditor/dist/css/suneditor.min.css'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import Note from "./components/Note/Note"
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { Container , Icon , Menu , Segment} from "semantic-ui-react";
import { Switch, Route ,Link , BrowserRouter as Router } from 'react-router-dom' ;
import {Home} from "./components/Home"
import Notes from "./components/Notes" 
class App extends React.Component {

  constructor(props){

    super(props)
    this.state = {

      sidebarOpen: true,
      activeItem: 'home'
    }
    this.handleItemClick = this.handleItemClick.bind(this)

  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  
  render(){
    
    const { activeItem } = this.state


    return (
      <Router>
        <div style={{ height:"100%" }}>   

          <Menu pointing>
            <Menu.Item
              as={Link}
              to={"/"}
              name='home'
              active={activeItem === 'home'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              as={Link}
              to={"/notes"}
              name='notes'
              active={activeItem === 'notes'}
              onClick={this.handleItemClick}
              
            />
            </Menu>   

            <Switch>
              <Route exact path='/'  component={Home}/>
              <Route exact path='/notes' component={Notes}/>
              <Route exact path="/notes/:id" component={Note}/>
            </Switch>
          </div>
        </Router>


    )
  }

}


export default App

