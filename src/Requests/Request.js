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
  Well,
} from 'react-bootstrap';
import JSONTable from '../JSONTable/JSONTable'
import $ from "jquery"

class Request extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  async GetGifts(limit, offset, callback) {
    $.ajax({
      url: `https://localhost:8081/gifts?limit=${limit}&offset=${offset}&where=request_id=${this.ID}`,
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
        alert("error getting gifts");
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log("Request.componentWillReceiveProps:", nextProps);
  }

  render() {
    console.log("Request.render", this.props.data)
    return (
      <Panel>
        <Well>
          <div>{JSON.stringify(this.props.data)}</div>
        </Well>
        <JSONTable striped bordered condensed hover responsive load
          limit={5}
          ID={this.props.data.ID}
          dataSource={this.GetGifts.bind({ID:this.props.ID})}
        />
      </Panel>
    );
  }
}

export default Request;