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
import JSONTable from '../JSONTable/JSONTable'
import $ from "jquery"
import Request from './Request'

class Requests extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
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

  async InspectRequest(data, callback) {
    console.log("Requests.InspectRequest", data)
    this.setState({CurrentRow: data.data})
  }

  render() {
    if(this.state && this.state.CurrentRow){console.log("Requests.Render", this.state.CurrentRow)}
    return (
      <div>
        { (this.state && this.state.CurrentRow)
          ?<Request data={this.state.CurrentRow} ID={this.state.CurrentRow.ID}/>
          :null
        }
        <Panel>
          <JSONTable striped bordered condensed hover responsive load
            limit={20}
            dataSource={this.GetRequests.bind(this)}
            actions={{
              Inspect: {
                glyph:"search",
                onClick: this.InspectRequest.bind(this),
              },
            }}
          />
        </Panel>
      </div>
    );
  }
}

export default Requests;