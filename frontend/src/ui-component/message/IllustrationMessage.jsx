import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const illustrations = {
  empty: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-content.svg',
    alt: 'Empty',
    title: 'No content available',
    description: 'Nothing to show here yet. Try again later.'
  },
  error: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-file.svg',
    alt: 'Error',
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.'
  },
  success: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-product.svg',
    alt: 'Success',
    title: 'All done!',
    description: 'Your action was completed successfully.'
  },
  notFound: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-user.svg',
    alt: 'Not Found',
    title: 'User not found',
    description: 'We couldn’t find the user you were looking for.'
  },
  chat: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-chat.svg',
    alt: 'Chat',
    title: 'No Messages',
    description: 'You have no conversations yet.'
  },
  mail: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-mail.svg',
    alt: 'Mail',
    title: 'Inbox is empty',
    description: 'No new emails to show.'
  },
  order: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-order.svg',
    alt: 'Order',
    title: 'No Orders',
    description: 'You haven’t placed any orders yet.'
  },
  page: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-page.svg',
    alt: 'Page',
    title: 'No Pages',
    description: 'No content pages are currently available.'
  },
  search: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-search.svg',
    alt: 'Search',
    title: 'No Results',
    description: 'We couldn’t find anything matching your search.'
  },
  task: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-task.svg',
    alt: 'Task',
    title: 'No Tasks',
    description: 'You have no pending tasks.'
  },
  team: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-team.svg',
    alt: 'Team',
    title: 'No Team Members',
    description: 'Your team is currently empty.'
  },
  timeline: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-timeline.svg',
    alt: 'Timeline',
    title: 'No Activity',
    description: 'There’s no recent activity to display.'
  },
  file: {
    src: 'https://assets.minimals.cc/public/assets/icons/empty/ic-file.svg',
    alt: 'File',
    title: 'No Files',
    description: 'You don’t have any files yet.'
  }
};

const IllustrationMessage = ({ type = 'empty', customTitle, customDescription }) => {
  const { src, alt, title, description } = illustrations[type] || illustrations.empty;

  return (
    <Box
      height="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ opacity: 0.8, p: 3 }}
    >
      <img src={src} alt={alt} width={120} style={{ marginBottom: 16 }} />
      <Typography variant="h6" color="text.primary" textAlign="center" gutterBottom>
        {customTitle || title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {customDescription || description}
      </Typography>
    </Box>
  );
};

IllustrationMessage.propTypes = {
  type: PropTypes.oneOf([
    'empty',
    'error',
    'success',
    'notFound',
    'chat',
    'mail',
    'order',
    'page',
    'search',
    'task',
    'team',
    'timeline',
    'file'
  ]),
  customTitle: PropTypes.string,
  customDescription: PropTypes.string
};

export default IllustrationMessage;
