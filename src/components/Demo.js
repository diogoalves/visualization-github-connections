import React, { Component } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  avatar: {}
};

class Demo extends Component {
  state = {
    open: true,
    demoData: {
      nodes: [
        {
          id: 'diogoalves',
          name: 'Diogo Alves',
          image: 'https://avatars2.githubusercontent.com/u/326518?v=4'
        },
        {
          id: 'chr15m',
          name: 'Chris McCormick',
          image: 'https://avatars3.githubusercontent.com/u/67130?v=4'
        },
        {
          id: 'ZeroStride',
          name: 'Pat Wilson',
          image: 'https://avatars2.githubusercontent.com/u/188136?v=4'
        },
        {
          id: 'shiffman',
          name: 'Daniel Shiffman',
          image: 'https://avatars0.githubusercontent.com/u/191758?v=4'
        },
        {
          id: 'willdurand',
          name: 'William Durand',
          image: 'https://avatars0.githubusercontent.com/u/217628?v=4'
        },
        {
          id: 'jarbasjacome',
          name: 'Jarbas Jácome',
          image: 'https://avatars0.githubusercontent.com/u/298168?v=4'
        },
        {
          id: 'alinebastos',
          name: 'Aline Bastos',
          image: 'https://avatars2.githubusercontent.com/u/387470?v=4'
        },
        {
          id: 'gaearon',
          name: 'Dan Abramov',
          image: 'https://avatars0.githubusercontent.com/u/810438?v=4'
        },
        {
          id: 'ya7ya',
          name: 'Yahya',
          image: 'https://avatars0.githubusercontent.com/u/932163?v=4'
        },
        {
          id: 'kovidgoyal',
          name: 'Kovid Goyal',
          image: 'https://avatars0.githubusercontent.com/u/1308621?v=4'
        },
        {
          id: 'hauxir',
          name: 'Haukur Rósinkranz',
          image: 'https://avatars0.githubusercontent.com/u/2439255?v=4'
        },
        {
          id: 'mairatma',
          name: 'Maira Bello',
          image: 'https://avatars3.githubusercontent.com/u/5216049?v=4'
        },
        {
          id: 'antoniopresto',
          name: '',
          image: 'https://avatars2.githubusercontent.com/u/6221799?v=4'
        },
        {
          id: 'vasturiano',
          name: 'Vasco Asturiano',
          image: 'https://avatars1.githubusercontent.com/u/6784226?v=4'
        },
        {
          id: 'rhiemer',
          name: 'Rodrigo Hiemer',
          image: 'https://avatars1.githubusercontent.com/u/7416760?v=4'
        },
        {
          id: 'haskellcamargo',
          name: 'Marcelo Camargo',
          image: 'https://avatars0.githubusercontent.com/u/7553006?v=4'
        },
        {
          id: 'alsfreitas',
          name: 'Anderson Freitas',
          image: 'https://avatars0.githubusercontent.com/u/10349994?v=4'
        }
      ],
      links: [
        {
          source: 'diogoalves',
          target: 'chr15m'
        },
        {
          source: 'diogoalves',
          target: 'ZeroStride'
        },
        {
          source: 'diogoalves',
          target: 'shiffman'
        },
        {
          source: 'diogoalves',
          target: 'willdurand'
        },
        {
          source: 'diogoalves',
          target: 'jarbasjacome'
        },
        {
          source: 'diogoalves',
          target: 'alinebastos'
        },
        {
          source: 'diogoalves',
          target: 'gaearon'
        },
        {
          source: 'diogoalves',
          target: 'ya7ya'
        },
        {
          source: 'diogoalves',
          target: 'kovidgoyal'
        },
        {
          source: 'diogoalves',
          target: 'hauxir'
        },
        {
          source: 'diogoalves',
          target: 'mairatma'
        },
        {
          source: 'diogoalves',
          target: 'antoniopresto'
        },
        {
          source: 'diogoalves',
          target: 'vasturiano'
        },
        {
          source: 'diogoalves',
          target: 'rhiemer'
        },
        {
          source: 'diogoalves',
          target: 'haskellcamargo'
        },
        {
          source: 'diogoalves',
          target: 'alsfreitas'
        }
      ]
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  createAvatar = (node, ctx) => {
    const { x, y, image } = node;
    const img = new Image();
    img.src = image;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 0.3;
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.drawImage(img, x - 5, y - 5, 10, 10);
    ctx.restore();
  };

  render() {
    return (
      <div>
        <ForceGraph2D
          graphData={this.state.demoData}
          nodeCanvasObject={this.createAvatar}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          cooldownTime={5000}
          d3VelocityDecay={0.1}
        />

        <Dialog
          onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
          open={this.state.open}
        >
          <DialogTitle id="simple-dialog-title">Warning</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This is a navigation demo with preloaded data. In order to get
              your connectins data you should first login with your Github
              account.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Demo);
