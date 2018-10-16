import React from 'react';
import {
  Panel,
  Button,
  ProgressBar,
  Table,
  Pager,
  Overlay,
  Tab,
  Tabs,
  Glyphicon,
} from 'react-bootstrap';
import $ from "jquery"
import Renderer from './Renderer'

class Tags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // renderer: React.createRef()
    };
    // this.renderer = React.createRef();
    console.log("Tags.Constructor", this.state.renderer)
  }

  async GetRequests(limit, offset, callback) {
    $.ajax({
      url: `https://localhost:8081/requests?limit=${limit}&offset=${offset}`,
      type: 'GET',
      dataType: "json",
      beforeSend: function(xhr){
        xhr.setRequestHeader(
          'Authorization', "Bearer " + 
          localStorage.getItem('id_token')
        );
      },
      success: callback,
      error: (jqXHR, status, error) => {
        alert("error getting active users");
      },
    });
  }

  generateImage(data) {
    console.log("Tags.generateImage", this.renderer)
    this.renderer.generateImage(data);
    this.setState({generated: true});
  }

  componentDidMount() {
    this.GetRequests(10, 0, (data)=>this.generateImage(data))
    // this.state.renderer.generateImage()
  }

  render() { 
    return (
    <Panel>
      {/* <Button onClick={()=>this.generateImage()}>Generate Image</Button>
        {this.state && this.state.generated ? <Button onClick={()=>
        {
          console.log("Tags.Render.print.click", this.renderer)
          const dataUrl = this.renderer.refs.canvas.toDataURL();
          // const dataUrl = document.getElementById('the-pdf-canvas').toDataURL(); 

          let windowContent = '<!DOCTYPE html>';
          windowContent += '<html>';
          windowContent += '<head><title>Print canvas</title></head>';
          windowContent += '<body>';
          windowContent += '<img src="' + dataUrl + '">';
          windowContent += '</body>';
          windowContent += '</html>';
      
          const printWin = window.open('', '', 'width=800,height=800');
          printWin.document.open();
          printWin.document.write(windowContent); 
      
          printWin.document.addEventListener('load', function() {
              printWin.focus();
              printWin.print();
              printWin.document.close();
              printWin.close();            
          }, true);
          
        }
        }>Print</Button>:"what"} */}
      <Renderer width={3000} height={2000} ref={instance => {this.renderer = instance}} tagWidth={200} tagHeight={200}/>
    </Panel>
    );
  }
}

export default Tags;