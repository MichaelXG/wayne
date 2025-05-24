import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import products from './products';
import order from './order';
import carrier from './carrier';
import address from './address';
import secret from './secret';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, secret, products, order, carrier, address, pages, utilities, other]
};

export default menuItems;
