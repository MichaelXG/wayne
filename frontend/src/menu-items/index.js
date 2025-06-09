import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import products from './products';
import order from './order';
import carrier from './carrier';
import address from './address';
import secret from './secret';
import permissions from './permissions';
import users from './users';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, secret, products, order, carrier, address, pages, users, permissions, utilities, other]
};

export default menuItems;
