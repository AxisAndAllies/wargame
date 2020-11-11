// example theme.js
export default {
  fonts: {
    body:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#33e',
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
  }
}