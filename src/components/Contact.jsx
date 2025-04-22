import { useEffect, useState } from 'react';
import { getFriends } from '~/api/userAPI';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Contacts = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    const res = await getFriends(user._id);
    setContacts(res);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div
      className='contacts-sidebar'
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div className='contacts-header'>
          <h3>Những người bạn biết ({contacts.length})</h3>
          <div className='contacts-actions'>
            <button>
              <i className='fas fa-search'></i>
            </button>
            <button>
              <i className='fas fa-ellipsis-h'></i>
            </button>
          </div>
        </div>
        <div
          className='contacts-list'
          style={{
            overflowY: 'auto',
            flexGrow: 1,
          }}
        >
          {contacts.map(contact => (
            <div
              key={contact._id}
              className='contact-item'
              onClick={() => {
                navigate(`/profile/${contact._id}`);
              }}
            >
              <div className='contact-avatar'>
                <img src={contact?.picture?.url} alt={contact.name} />
                {contact.online && <span className='online-status'></span>}
              </div>
              <span className='contact-name'>{contact.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Nút đăng xuất */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Button
          variant='contained'
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            width: '100%',
            padding: '8px 0',
            fontSize: '14px',
            backgroundColor: '#424242', // Màu đen xám
            '&:hover': {
              backgroundColor: '#212121', // Màu đen xám đậm hơn khi hover
            },
          }}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default Contacts;