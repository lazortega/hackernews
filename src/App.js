import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import Layout from "./components/layout/Layout";
import {Home} from "./pages/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

function App() {
  return (
      <Layout>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>
          <Route exact path="/home" component={Home} />
        </Switch>
      </Layout>
  );
}

export default App;
