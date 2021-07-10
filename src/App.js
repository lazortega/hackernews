import React, {useContext} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import AppContext from "./store/app-context";
import Layout from "./components/layout/Layout";
import {Search} from "./pages/Search";
import {History} from "./pages/History";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

function App() {
  const ctx = useContext(AppContext);
  return (
      <Layout>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/search" />
          </Route>
          <Route exact path="/search" component={Search} />
          <Route exact path="/history" component={History} />
        </Switch>
      </Layout>
  );
}

export default App;
