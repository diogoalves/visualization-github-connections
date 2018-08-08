import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PopupWindow from './PopupWindow';
import { isLogged, cleanLoggedUser, toQuery } from '../utils';
import { OAUTH_CLIENT_ID, OAUTH_SCOPE } from '../constants';

const styles = {
  root: {
    flexGrow: 1
  },
  appbar: {
    position: 'fixed'
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Header extends Component {
  handleLogin = () => {
    const search = toQuery({
      client_id: OAUTH_CLIENT_ID,
      scope: OAUTH_SCOPE,
      redirect_uri: ''
    });
    const popup = (this.popup = PopupWindow.open(
      'github-oauth-authorize',
      `https://github.com/login/oauth/authorize?${search}`,
      { height: 1000, width: 600 }
    ));

    popup.then(data => console.log(data), error => console.log(error));
  };

  handleLogout = () => {
    const { client, history } = this.props;
    cleanLoggedUser();
    client.resetStore();
    history.push(`/`);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appbar}>
          <Toolbar>
            <div className={classes.flex}>
              <Typography
                variant="title"
                color="inherit"
                className={classes.flex}
              >
                Github Connections
              </Typography>
            </div>
            {this.props.children}
            {isLogged() && (
              <div>
                <Button onClick={this.toggle} color="inherit">
                  <AccountCircle />
                  user
                </Button>
                <Button onClick={this.handleLogout} color="inherit">
                  Logout
                </Button>
              </div>
            )}
            {!isLogged() && (
              <div>
                <Button onClick={this.handleLogin} color="inherit">
                  Login
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(withApollo(withStyles(styles)(Header)));
