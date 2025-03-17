import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  Layout: {
    headerHeight: 64,
    navWidth: 350
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#3366ff',
          more: '#e3f2fd',
          header: '#3366ff'
        },
        secondary: {
          main: '#ffffff',
          more: '#3366ff',
          checked: '#f0f2f8'
        },
        text: {
          main: '#3a414e',
          default: '#ffffff'
        },
        background: {
          default: '#eff1f7',
          hover: '#e0e0e9'
        },
        messages: {
          text_primary: '#3F7000',
          bg_primary: '#E0EDCD',
          text_secondary: '#282523',
          bg_secondary: '#fce2ca'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#3366ff',
          more: '#373e4a',
          header: '#373e4a'
        },
        secondary: {
          main: '#232b38',
          more: '#d5e6fd',
          checked: '#f0f2f8'
        },
        text: {
          main: '#a8adb5',
          default: '#ffffff'
        },
        background: {
          default: '#181e2b',
          hover: '#373e4a'
        },
        messages: {
          text_primary: '#101524',
          bg_primary: '#E0EDCD',
          text_secondary: '#1d2439',
          bg_secondary: '#e7d4c5'
        }
      }
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {

        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {

        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          fontSize: 15
        },
        body2: {
          fontSize: '1rem',
          color:'text.main'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {

        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: theme => ({
        a: {
          textDecoration: 'none',
          color: 'inherit'
        }
      })
    }
  }
})

export default theme
