import React , {Component , Fragment} from "react"
import suneditor from 'suneditor'
import plugins from 'suneditor/src/plugins'
import {Container} from "semantic-ui-react"
import IdleTimer from 'react-idle-timer'
class Note extends Component {


  constructor(props){

      let date = new Date()
      super(props)
      this.state = {
  
        patch : {
  
          _id:this.props.location._id,
          title:this.props.location._title,
          time:date.getDay()+ "-" + date.getMonth() + "-" + date.getFullYear() + " " + date.getTime() ,
          blocks:[]
        
        },
        savebtn : () => document.querySelector("[data-command=save]"),
  
      }
      this.SubmitHandler = this.SubmitHandler.bind(this)
      this.AutoSave = this.AutoSave.bind(this)
      this.idleTimer = null
      this.onIdle = this.onIdle.bind(this)


      
      
    }

    
  async componentDidMount(){

      this.editor =  await suneditor.create('sample', {
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
      callBackSave : (content) => {
        
          this.createApi(content)
          localStorage.setItem("unsaved",JSON.stringify(this.state.patch))
        
      },
    })

    
    this.AutoSave()

    this.reverseApi()
    
  }
    
  componentWillUnmount(){


    this.editor.destroy()
    document.removeEventListener('input',this.AutoSave)
    

  }

  AutoSave(){

    
    document.querySelector("[contenteditable=true]").addEventListener("input",() => {

      setTimeout(()=>{
  
        this.state.savebtn().click()
        
          
      },10000)
    })


  }

  createApi(content){

    let blocks = []

    let div = document.createElement("Div")
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

    this.setState((state) =>{

      state.patch.blocks = blocks

    })
    
  }


  reverseApi(){

    const _id = this.props.location.state._id
    let div = document.createElement("DIV")
    fetch("http://localhost:3333/notes/"+_id)
      .then(res => res.json())
      .then(result => {


        Array.prototype.forEach.call(result.blocks,block => {

          let container = document.createElement(block.type)
          container.className = block.class
          container.style = block.style
          container.innerHTML = block.block
          div.append(container)
          
        })

        this.editor.setContents(div.innerHTML)
      })

    



       
  }
    

  async SubmitHandler(event){
    
    event.preventDefault()
    let value = event.target[0].value
    this.setState(state => {

      state.patch.title = value
    })
  }

  onIdle(){

    console.log(localStorage.getItem("unsaved"))
    const _id = this.props.location.state._id
    fetch("http://localhost:3333/notes/"+_id, {
      method: 'put',
     headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         },
     body:localStorage.getItem("unsaved")
     })
  }

      
    
      render(){
        return (
          <Fragment>
            <IdleTimer
              ref={ref => { this.idleTimer = ref }}
              onIdle={this.onIdle}
              debounce={250}
              timeout={1000 } />
            <textarea id="sample"/>
          </Fragment>
    );
  }
}

export default Note