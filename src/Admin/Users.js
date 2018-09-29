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
} from 'react-bootstrap';
import JSONTable from '../JSONTable/JSONTable'
import $ from "jquery"

class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Active: null,
      Inactive: null,
      Locked: null,
    };
  }

  async GetActiveUsers(limit, offset, callback) {
    $.ajax({
      url: `https://localhost:8081/admin/users?limit=${limit}&offset=${offset}&where=Active=1:Locked=0`,
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

  async GetInactiveUsers(limit, offset, callback) {
    $.ajax({
      url: `https://localhost:8081/admin/users?limit=${limit}&offset=${offset}&where=Active=0`,
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

  async GetLockedUsers(limit, offset, callback) {
    $.ajax({
      url: `https://localhost:8081/admin/users?limit=${limit}&offset=${offset}&where=Active=1:Locked=1`,
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

  async LockUser(data, callback) {
    console.log("lockUser", data, callback)
    $.ajax({
      url: `https://localhost:8081/admin/users?where=ID=${data.ID}`,
      type: 'PATCH',
      data: JSON.stringify({Locked: true}),
      dataType: "json",
      beforeSend: function(xhr){
        xhr.setRequestHeader(
          'Authorization', "Bearer " + 
          localStorage.getItem('id_token')
        );
      },
      success: callback,
      error: (jqXHR, status, error) => {
        console.log("error locking user", jqXHR, status, error);
        alert("error locking user");
      },
    });
  }

  async UnLockUser(data, callback) {
    console.log("UnLockUser", data, callback)
    $.ajax({
      url: `https://localhost:8081/admin/users?where=ID=${data.ID}`,
      type: 'PATCH',
      data: JSON.stringify({Locked: false}),
      dataType: "json",
      beforeSend: function(xhr){
        xhr.setRequestHeader(
          'Authorization', "Bearer " + 
          localStorage.getItem('id_token')
        );
      },
      success: callback,
      error: (jqXHR, status, error) => {
        console.log("error locking user", jqXHR, status, error);
        alert("error locking user");
      },
    });
  }

  async ActivateUser(data, callback) {
    console.log("ActivateUser", data, callback)
    $.ajax({
      url: `https://localhost:8081/admin/users?where=ID=${data.ID}`,
      type: 'PATCH',
      data: JSON.stringify({Active: true}),
      dataType: "json",
      beforeSend: function(xhr){
        xhr.setRequestHeader(
          'Authorization', "Bearer " + 
          localStorage.getItem('id_token')
        );
      },
      success: callback,
      error: (jqXHR, status, error) => {
        console.log("error locking user", jqXHR, status, error);
        alert("error locking user");
      },
    });
  }

  render() {
    return (
      <Tabs defaultActiveKey="active" id="t">
        <Tab eventKey="active" title="Active">
          <JSONTable striped bordered condensed hover responsive
          limit={10}
          dataSource={this.GetActiveUsers.bind(this)}
          actions={[
            {
              render: (onClick)=><Button onClick={onClick}>Lock</Button>,
              action: this.LockUser.bind(this),
            },
          ]}
          />
        </Tab>
        <Tab eventKey="inactive" title="Inactive">
          <JSONTable striped bordered condensed hover responsive
            limit={10}
            dataSource={this.GetInactiveUsers.bind(this)}
            actions={[
              {
                render: (onClick)=><Button onClick={onClick}>Activate</Button>,
                action: this.ActivateUser.bind(this),
              },
            ]}
          />
        </Tab>
        <Tab eventKey="locked" title="Locked">
          <JSONTable striped bordered condensed hover responsive
            limit={10}
            dataSource={this.GetLockedUsers.bind(this)}
            actions={[
              {
                render: (onClick)=><Button onClick={onClick}>Un-Lock</Button>,
                action: this.UnLockUser.bind(this),
              },
            ]}
          />
        </Tab>
      </Tabs>
    );
  }
}

export default Users;