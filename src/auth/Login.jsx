/* eslint-disable react/no-unescaped-entities */
import IconGoogle from '../assets/images/Google'
import IconGitHub from '../assets/images/GitHub'
import IconX from '../assets/images/X'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { verifyToken } from '../api'
import GlobalLoading from '../components/GlobalLoading'
import { loginLocal } from '../api/auth'

const host = `${import.meta.env.VITE_SERVER_HOST}/api`

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // trang thai dang nhap
  const fetchUser = async () => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    
    if (!token) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      const user = await verifyToken(token)
      localStorage.setItem('user', JSON.stringify(user))
      window.location.href = '/'
    } catch (err) {
      setError("Xác thực thất bại! Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [location])

  const handleLogin = async () => {
    setLoading(true)
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập.")
      setLoading(false)
      return
    }
    
    try {
      const response = await loginLocal(email, password)
      if (response._id) {
        localStorage.setItem('user', JSON.stringify(response))
        window.location.href = '/index'
      } else {
        setError("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.")
      }
    } catch (error) {
      setError("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.")
    } finally {
      setLoading(false)
    }
  }

  const loginWithGithub = async () => {
    try {
      window.location.href = `${host}/auth/github`
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  const loginWithX = async () => {
    try {
      window.location.href = `${host}/auth/twitter`
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  const loginWithGoogle = async () => {
    try {
      window.location.href = `${host}/auth/google`
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  return (
    <>
      <GlobalLoading loading={loading} />
      <Grid
        container
        sx={{
          height: '100vh',
          width: '100%',
          padding: { xs: '20px', md: '40px' },
          background: 'linear-gradient(135deg, #e6f0fa 0%, #f5e6f5 100%)',
          color: '#333',
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: { xs: 4, md: 0 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '28rem', px: { xs: 2, md: 0 } }}>
            <Typography
              variant="h4"
              sx={{
                marginBottom: 2,
                textAlign: { xs: 'center', md: 'left' },
                fontWeight: 500,
                color: '#333',
              }}
            >
              Welcome 👋
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                display: 'block',
                mb: 4,
                color: '#555',
                fontSize: '1.1rem',
              }}
            >
              {error
                ? <span style={{ color: 'red' }}>{error}</span>
                : 'Hôm nay là một ngày mới. Hãy đăng nhập để bắt đầu với cảm nghĩ của bạn.'
              }
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}>
              <TextField
                fullWidth
                id="email"
                label="email"
                type="email"
                color="success"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    '& fieldset': {
                      borderColor: '#1a3c4d',
                      borderWidth: '2px',
                      borderRadius: '12px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#388e3c',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#388e3c',
                      borderWidth: '2px',
                      boxShadow: '0 0 8px rgba(56, 142, 60, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#388e3c',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '14px 16px',
                    color: '#333',
                  },
                }}
              />
              <TextField
                fullWidth
                id="password"
                label="mật khẩu"
                type="password"
                color="success"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    '& fieldset': {
                      borderColor: '#1a3c4d',
                      borderWidth: '2px',
                      borderRadius: '12px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#388e3c',
                      borderWidth: '2px',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#388e3c',
                      borderWidth: '2px',
                      boxShadow: '0 0 8px rgba(56, 142, 60, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#388e3c',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '14px 16px',
                    color: '#333',
                  },
                }}
              />
              <Button
                onClick={handleLogin}
                sx={{
                  fontWeight: 'bold',
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: '2px solid #1a3c4d',
                  backgroundColor: '#1a3c4d',
                  textAlign: 'center',
                  fontSize: '16px',
                  color: '#fff',
                }}
              >
                Đăng nhập
              </Button>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Typography variant="span" sx={{ color: '#555' }}>
                  Bạn không có tài khoản?
                </Typography>
                <NavLink to="/register">
                  <Button
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#f3f9fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '16px',
                      padding: '8px 16px',
                      textTransform: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      ':hover': {
                        backgroundColor: '#e0e0e0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Typography variant="span" sx={{ color: '#1e88e5' }}>
                      Đăng ký
                    </Typography>
                  </Button>
                </NavLink>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              width: '100%',
              maxWidth: '28rem',
              px: { xs: 2, md: 0 },
              mb: { xs: 4, md: 0 },
            }}
          >
            <Button
              onClick={() => loginWithGoogle()}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '16px',
                padding: '12px 24px',
                width: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                ':hover': {
                  backgroundColor: '#f3f9fa',
                },
              }}
            >
              <IconGoogle />
              <Typography variant="span" sx={{ color: '#333' }}>
                Đăng nhập với Google
              </Typography>
            </Button>
            <Button
              onClick={() => loginWithGithub()}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '16px',
                padding: '12px 24px',
                width: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                ':hover': {
                  backgroundColor: '#f3f9fa',
                },
              }}
            >
              <IconGitHub />
              <Typography variant="span" sx={{ color: '#333' }}>
                Đăng nhập với GitHub
              </Typography>
            </Button>
            <Button
              onClick={() => loginWithX()}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '16px',
                padding: '12px 24px',
                width: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                ':hover': {
                  backgroundColor: '#f3f9fa',
                },
              }}
            >
              <IconX />
              <Typography variant="span" sx={{ color: '#333' }}>
                Đăng nhập với X
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Login