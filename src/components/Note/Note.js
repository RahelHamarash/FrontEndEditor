import React , {Component , Fragment} from "react"
import suneditor from 'suneditor'
import plugins  from 'suneditor/src/plugins'
import {Container , Button , Icon , Loader} from "semantic-ui-react"
import IdleTimer from 'react-idle-timer'
class Note extends Component {


  constructor(props){

      super(props)
      this._id = this.props.match.params.id



      this.state = {
  
        patch : {
  
          _id:this.props.match.params.id,
          blocks:[]
        
        },
        
        savebtn : () => document.querySelector("[data-command=save]"),
  
      }
      this.SubmitHandler = this.SubmitHandler.bind(this)
      this.idleTimer = null
      this.onIdle = this.onIdle.bind(this)
      this.autosave = this.autosave.bind(this)
      this.reverseApi = this.reverseApi.bind(this)
      
      
      
    }

    
  componentDidMount(){
      
    this.textarea = document.querySelector("[contentEditable]")

      this.editor =  suneditor.create('sample', {
      plugins: plugins,
      buttonList: [
          ['undo', 'redo'],
          ['font','fontSize', 'formatBlock'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['removeFormat'],
          // Line break
          ['fontColor', 'hiliteColor'],
          ['outdent', 'indent'],
          ['align', 'horizontalRule', 'list', 'lineHeight'],
          ['table', 'link', 'image', 'video'],
          ['preview', 'print'],
          ['save']

        
      ],
      width:'100%',
      height:"80vh",
      placeholder:"type here",
      resizingBar:false,
      callBackSave: async (content)=> {

        await this.createApi(content)
        localStorage.setItem(this._id,JSON.stringify(this.state.patch))
        
      }
      

  
    }


    )


    this.reverseApi()
    this.autosave()

  }
    
  componentWillUnmount(){


    this.editor.destroy()
    localStorage.removeItem(this._id)
    

  }


  createApi(content){

    const blocks = []

    let div = document.createElement("DIV")
    div.innerHTML = content 

    Array.prototype.forEach.call( div.children,child => {

      let nodeName = child.nodeName
      let nodeClass = child.className
      let nodeStyle = child.getAttribute("style") ? child.getAttribute("style") : ""
      let nodeBlock = child.innerHTML

      blocks.push({
      
        type:nodeName,
        class:nodeClass,
        style:nodeStyle,
        block:nodeBlock
        
      
    
      })
      
    })

    console.log(blocks)
    this.setState((state) =>{

      state.patch.blocks = blocks

    })

    
  }


   reverseApi(){

    let emptyStorage = {

      _id:this._id,
      blocks:[]
    }
    if(localStorage.getItem(this._id) == null){

      localStorage.setItem(this._id,JSON.stringify(emptyStorage))


    }else{

      this.localstorage = localStorage.getItem(this._id)
      
    }

    this.parsed = JSON.parse(localStorage.getItem(this._id))



    let reverser = (result) => {

      const div =  document.createElement("DIV")

      result.blocks.forEach(block => {
        let container = document.createElement(block.type)
        container.className = block.class
        container.style = block.style
        container.innerHTML = block.block
        div.append(container)
        
        
      })

      console.log(div)
      this.editor.setContents(div.innerHTML)

    }
    if(this.parsed.blocks.length == 0) {

      fetch("http://localhost:3333/notes/"+this._id)
            
      .then(res => res.json())
        .then(result => {
             
          reverser(result)
          console.log("get request hit!! indicating storage was cleaned")
        })

    }else{
      
      reverser(this.parsed)
      console.log("patch request not sent yet!! localstorage was returned")
    
    }





       
  }



  autosave(){

    this.state.savebtn().click()

  }
    

  SubmitHandler(event){
    
    let content = this.editor.getContents(true)
    this.createApi(content)
    localStorage.setItem(this._id,JSON.stringify(this.state.patch))

  
    event.preventDefault()
  }

  onIdle =() => {

    fetch('http://localhost:3333/notes/'+this._id, {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body:localStorage.getItem(this._id)
    }).then(res => res.json())
      .then(result => {

        if(result.status){

          localStorage.setItem(this._id, JSON.stringify({ id_:this._id , blocks:[]}))
          console.log("patch request hit!! time to clean the storage")
        }
      })

    }
    
      render(){
        return (
          <Fragment>
            <IdleTimer
              ref={ref => { this.idleTimer = ref }}
              onIdle={this.autosave}
              timeout={4000}
              element={this.textarea}
              
              />
            <IdleTimer
              ref={ref => { this.idleTimer = ref }}
              onIdle={this.onIdle}
              debounce={250}
              timeout={5000}
              element={this.textarea}
              
              />
            <textarea id="sample"/>
            <Button onClick={this.SubmitHandler} id="save">Done</Button>
          </Fragment>
    );
  }
}

export default Note