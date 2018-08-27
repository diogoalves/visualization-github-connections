import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import queryString from 'query-string';

import { isLogged, cleanLoggedUser, authorize, getAcessToken } from '../utils';

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
  handleLogout = () => {
    const { client, history } = this.props;
    cleanLoggedUser();
    client.resetStore();
    history.push(`/`);
  };

  componentDidMount = () => {
    const { location, history } = this.props;
    const { code } = queryString.parse(location.search);
    if (code) {
      getAcessToken(code, () => history.push(`/`));
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appbar}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
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
                <Button onClick={this.handleLogout} color="inherit">
                  Logout
                </Button>
              </div>
            )}
            {!isLogged() && (
              <div>
                <Button onClick={authorize} color="inherit">
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
