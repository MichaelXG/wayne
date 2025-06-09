let useNotifier;

export const setNotifier = (notifier) => {
  useNotifier = notifier;
};

export const notify = (message, variant = 'default', duration = 60000) => {
  if (useNotifier) {
    useNotifier(message, { 
      variant, 
      autoHideDuration: duration  // ✅ duração padrão: 1 minuto
    });
  } else {
    console.warn('❗ Notifier not initialized.');
  }
};
