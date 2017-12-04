import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import ContentAdd from 'material-ui/svg-icons/content/add';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MenuItem from 'material-ui/MenuItem';
import { grey50, grey200, grey400 } from 'material-ui/styles/colors';
import Theme from 'theme.js';

import Logo from 'components/logo.jsx';
import WalletItem from 'components/wallet-item.jsx';
import WalletItemAddEdit from 'components/wallet-item-add-edit.jsx';
import { Size } from 'helper/responsive-size';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdd: false,
      showEdit: false,
      drawerDocked: window.innerWidth > Size.SM,
      drawerOpened: false
    };
    this.renderDrawer = this.renderDrawer.bind(this);
    this.handleOnEditClick = this.handleOnEditClick.bind(this);
    this.handleOnAddBtnClick = this.handleOnAddBtnClick.bind(this);
    this.handleOnSaveClick = this.handleOnSaveClick.bind(this);
    this.handleOnCreateClick = this.handleOnCreateClick.bind(this);
    this.handleOnRemoveClick = this.handleOnRemoveClick.bind(this);
    this.handleOnCancelClick = this.handleOnCancelClick.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.handleDrawerRequestChange = this.handleDrawerRequestChange.bind(this);
  }

  componentWillMount() {
    let { items } = this.props;
    if (!items || !items.length) this.setState({ showAdd: true });
  }

  openDrawer() {
    this.setState({ drawerOpened: true });
  }

  handleDrawerRequestChange(open) {
    this.setState({ drawerOpened: open });
  }

  renderDrawer() {
    let { items = [], selectedItemId } = this.props;
    let { drawerDocked, drawerOpened } = this.state;
    let drawerItems = items.map((item, index) => {
      let style =
        item._id === selectedItemId ? { backgroundColor: grey200 } : null;
      return (
        <MenuItem
          style={style}
          innerDivStyle={styles.drawerItem}
          onTouchTap={e => this.handleClickOnDrawerItem(e, item._id)}
          key={index + 1}>
          {item.title}
        </MenuItem>
      );
    });

    if (!drawerDocked) {
      drawerItems.unshift(
        <div style={styles.drawerTitle} key={0}>
          Wallet Items
        </div>
      );
    }

    return (
      <Drawer
        containerStyle={{
          ...styles.drawer,
          top: drawerDocked ? '68px' : '0px'
        }}
        open={drawerDocked ? true : drawerOpened}
        docked={drawerDocked}
        onRequestChange={this.handleDrawerRequestChange}>
        {drawerItems}
      </Drawer>
    );
  }

  handleClickOnDrawerItem(e, itemId) {
    this.setState({ showAdd: false, showEdit: false, drawerOpened: false });
    this.props.selectItem(itemId);
  }

  handleOnAddBtnClick() {
    this.setState({ showAdd: true, showEdit: false });
  }

  handleOnEditClick() {
    this.setState({ showEdit: true, showAdd: false });
  }

  handleOnCreateClick(item) {
    let { createItem } = this.props;
    createItem(item);
    this.setState({ showAdd: false, showEdit: false });
  }

  handleOnRemoveClick(id) {
    let { removeItem } = this.props;
    removeItem(id);
    this.setState({ showAdd: false, showEdit: false });
  }

  handleOnSaveClick(updatedItem) {
    let { updateItem } = this.props;
    updateItem(updatedItem);
    this.setState({ showEdit: false, showAdd: false });
  }

  handleOnCancelClick() {
    this.setState({ showAdd: false, showEdit: false });
  }

  renderWalletItems() {
    let { items = [], selectedItemId } = this.props;
    let { showAdd, showEdit, drawerDocked } = this.state;
    let containerStyle = drawerDocked ? { ...styles.itemsWrapper, marginLeft: '256px' } : styles.itemsWrapper;

    console.log('#GC - ', containerStyle)
    if (showAdd || showEdit) {
      const item = items.find(item => item._id === selectedItemId);
      return (
        <div style={containerStyle}>
          <WalletItemAddEdit
            item={showEdit ? item : null}
            onClickCancel={this.handleOnCancelClick}
            onClickCreate={this.handleOnCreateClick}
            onClickRemove={this.handleOnRemoveClick}
            onClickSave={this.handleOnSaveClick}
          />
        </div>
      );
    } else {
      if (!items.length) return null;
      const renderedItems = items.map((item, i) => {
        return (
          <WalletItem
            key={i}
            item={item}
            onClickEdit={this.handleOnEditClick}
          />
        );
      });

      return <div style={containerStyle}>{renderedItems}</div>;
    }
  }

  render() {
    let { logout, items = []} = this.props;
    let { showAdd, showEdit, drawerDocked } = this.state;

    return (
      <div style={styles.root}>
        <div
          style={{
            ...styles.topBar,
            justifyContent: drawerDocked ? '' : 'space-between'
          }}>
          {drawerDocked ? null : (
            <FlatButton
              onTouchTap={this.openDrawer}
              style={styles.menuBtn}
              icon={<MenuIcon color='#fff' />}
            />
          )}
          <Logo style={styles.topBar.logo} />
          <FlatButton
            onTouchTap={logout}
            label="logout"
            labelStyle={{ color: '#fff' }}
            style={{ marginLeft: drawerDocked ? 'auto' : '0px' }}
          />
        </div>
        {this.renderDrawer()}
        {this.renderWalletItems()}
        {showAdd || showEdit ? null : (
          <FloatingActionButton
            style={styles.addBtn}
            onTouchTap={this.handleOnAddBtnClick}>
            <ContentAdd />
          </FloatingActionButton>
        )}
      </div>
    );
  }
}

Wallet.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  createItem: PropTypes.func,
  updateItem: PropTypes.func,
  logout: PropTypes.func
};

const styles = {
  root: {
    height: '100vh'
  },
  addBtn: {
    position: 'fixed',
    bottom: '12px',
    right: '12px'
  },
  topBar: {
    borderBottom: 'solid 1px #E0E0E0',
    padding: '0 12px',
    height: 68,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Theme.palette.primary1Color,
    logo: {
      width: 48,
      height: 48
    }
  },
  drawer: {
    boxShadow: 'none',
    borderRight: 'solid 1px #E0E0E0',
    borderTop: 'solid 1px #E0E0E0',
    paddingTop: '12px',
    paddingBottom: '68px'
  },
  drawerTitle: {
    display: 'flex',
    alignItems: 'center',
    height: '56px',
    fontSize: '22px',
    padding: '0 16px 12px',
    fontWeight: '100',
    borderBottom: `solid 1px ${grey200}`,
    boxSizing: 'border-box'
  },
  drawerItem: {
    textTransform: 'capitalize',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  menuBtn: {
    minWidth: '42px',
    marginRight: '38px'
  },
  noItem: {
    fontSize: '4vw',
    color: grey400,
    fontWeight: '100',
    padding: '22px'
  },
  itemsWrapper: {
    height: 'calc(100vh - 69px)',
    overflowY: 'scroll',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  }
};
export default Radium(Wallet);
