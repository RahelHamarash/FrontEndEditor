import React , {Fragment , Component} from "react"
import { Card , Input, Button , Container  } from 'semantic-ui-react'
import Note from "./Note/Note" 
import { Switch, Route ,Link , BrowserRouter as Router } from 'react-router-dom' ;

class Notes extends Component{

    constructor(){

        super()
        this.state = {

            loading:false,
            hide:false,
            get : [

                {
                    _id:0,
                    title:""
                }
            ],

        }

        this.CreateNote = this.CreateNote.bind(this)
    }
    CreateNote(e){

        e.preventDefault()
        const inputValue =document.getElementById("input").value
        fetch('http://localhost:3333/notes', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                title:inputValue
            })
        }).then(res => res.json())
            .then(result =>  this.setState(state => {

                return state.get.push({_id:result._id,title:result.title})
            }))
            console.log(this.state.get)
    }

    componentDidMount(){

        fetch("http://localhost:3333/notes")
        .then(response => response.json())
        .then(result => {

            this.setState(state => {

                return {loading : !state.loading , get:result}
            })

        

              
                



            
        })

        console.log(this.state.get)

    }

    HideNotes(){

        this.setState((state) => {
            return {hide:!state.hide}
        })
    }
    render(){

        const {get ,loading} = this.state
        if(loading){
            
            console.log(get)
            const items = get.map(item =>{


                
                return (

                    <Card  key={item._id}  to={{pathname: `/notes/${item._id}`, state: {...item } }} as={Link}>
                        <Card.Content header={item.title} />
                            <Card.Content />
                            <Card.Content >
                        </Card.Content >
                    </Card>
                    

                )
            })
            

            
            return (


                <Fragment>
                    <Container fluid>
                        <Card.Group itemsPerRow={8}>
                            {items}
                            <Card>
                                <Card.Content header='New Note' />
                                    
                                    <Input name="newNote" placeholder="type title here" id="input"/>
                                    <Card.Content/>
                                    <Card.Content extra>
                                        <Button color="green" size="mini" onClick={this.CreateNote}>Done</Button>
                                    </Card.Content>
                            </Card>
                            
                        </Card.Group>
                        <Switch>
                            
                        </Switch>
                    </Container>
                </Fragment>

            
            )
        }else{

            return(
                
                <p>Loading ...</p>
            )  
        }
    }
}

export default Notes
