import { Switch, Redirect, Route } from "react-router-dom";
import React, { Component } from "react";
import ChainHome from "./chain";
import AddUpdate from "./add-update";

import "./chain.less";
class Chain extends Component {
  state = {};
  render() {
    return (
      <Switch>
        <Route path="/chain" component={ChainHome} exact={true}></Route>
        <Route path="/chain/add" component={AddUpdate}></Route>
        <Route path="/chain/update" component={AddUpdate}></Route>
        <Redirect to="/chain" />
      </Switch>
    );
  }
}

export default Chain;
