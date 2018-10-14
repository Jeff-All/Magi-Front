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

  async GetTags(limit, offset, callback) {
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

  componentDidMount() {
    // this.state.renderer.generateImage()
  }


  render() { 
    return (
    <Panel>
      <Button onClick={()=>
        {
          console.log("Tags.Render.click", this.renderer)
          this.renderer.generateImage();
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
        }>Generate Image</Button>
      <Renderer width={3000} height={2000} ref={instance => {this.renderer = instance}}/>
    </Panel>
    );
  }
}

export default Tags;