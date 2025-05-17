import React from 'react';
import IllustrationMessage from '../../message/IllustrationMessage';

const DefaultNoRowsOverlay = () => (
  <IllustrationMessage type="empty" customTitle="No data found" customDescription="Try adjusting your filters or adding new items." />
);

export default DefaultNoRowsOverlay;
