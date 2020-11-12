// example theme.js
export default {
  fonts: {
    body:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },
  colors: {
    // mostly from tailwind colors: https://tailwindcss.com/docs/customizing-colors
    text: '#000',
    background: '#fff',
    primary: '#2C7A7B',
    red: '#C53030',
    blue: '#2B6CB0',
    purple: '#6B46C1',
    green: '#2F855A',
    gray: '#718096'
  },
  buttons: {
    secondary: {
      backgroundColor: 'white',
      color: 'black',
      border: '1px solid black',
      padding: '',
      boxShadow: '3px 5px #999',
      '&:hover': {
          boxShadow: '3px 5px #555',
          border: `1px solid blue`,
      },
      '&:active': {
          boxShadow: '2px 2px #999',
          transform: `translate(1px, 3px)`,
      },
      '&:disabled': {
          opacity: '30%',
      },
    }
  },
  badges: {
    primary: {
      color: 'background',
      bg: 'primary',
    },
    outline: {
      color: 'primary',
      bg: 'transparent',
      boxShadow: 'inset 0 0 0 1px',
      padding: '4px'
    },
  },
}