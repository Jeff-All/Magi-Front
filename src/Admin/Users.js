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
      url: `https://localhost:8081/admin/users?where=ID=${data.data.ID}`,
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
      url: `https://localhost:8081/admin/users?where=ID=${data.data.ID}`,
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
      url: `https://localhost:8081/admin/users?where=ID=${data.data.ID}`,
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

  async GetRoles(column, callback) {
    console.log("GetRoles", column, callback)
    $.ajax({
      url: `https://localhost:8081/roles?limit=20`,
      type: 'GET',
      data: "{}",
      dataType: "json",
      beforeSend: function(xhr){
        xhr.setRequestHeader(
          'Authorization', "Bearer " + 
          localStorage.getItem('id_token')
        );
      },
      success: (json)=>callback(json, column, "Name"),
      error: (jqXHR, status, error) => {
        console.log("error getting roles", jqXHR, status, error);
        alert("error getting roles");
      },
    });
  }

  async UpdateUser(
    data,
    callback,
  ) {
    console.log("UpdateUser", data, callback)
    $.ajax({
      url: `https://localhost:8081/admin/users?where=ID=${data.data.ID}`,
      type: 'PATCH',
      data: JSON.stringify(data.changes),
      dataType: "json",
      beforeSend: function(xhr){
        xhr.setRequestHeader(
          'Authorization', "Bearer " + 
          localStorage.getItem('id_token')
        );
      },
      success: callback,
      error: (jqXHR, status, error) => {
        console.log("error updating user", jqXHR, status, error);
        alert("error updating user");
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
          update={this.UpdateUser.bind(this)}
          actions={{
            Activate: {
              glyph:"lock",
              onClick: this.LockUser.bind(this),
            },
            Update: {
              glyph:"floppy-save",
              isDisabled: (ctx)=>!ctx.props.changed,
              onClick:this.UpdateUser.bind(this),
            }
          }}
          sources={{
            Role: this.GetRoles.bind(this),
          }}
          />
        </Tab>
        <Tab eventKey="inactive" title="Inactive">
          <JSONTable striped bordered condensed hover responsive
            limit={10}
            dataSource={this.GetInactiveUsers.bind(this)}
            actions={{
              Activate: {
                glyph:"ok",
                onClick: this.ActivateUser.bind(this),
              },
              Update: {
                glyph:"floppy-save",
                onClick:this.UpdateUser.bind(this),
              }
            }}
          />
        </Tab>
        <Tab eventKey="locked" title="Locked">
          <JSONTable striped bordered condensed hover responsive
            limit={10}
            dataSource={this.GetLockedUsers.bind(this)}
            actions={{
              UnLockUser: {
                glyph:"ok",
                onClick: this.UnLockUser.bind(this),
              },
              Update: {
                glyph:"floppy-save",
                onClick:this.UpdateUser.bind(this),
              }
            }}
          />
        </Tab>
      </Tabs>
    );
  }
}

export default Users;