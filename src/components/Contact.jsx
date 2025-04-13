import { useEffect, useState } from 'react';
import { getFriends } from '../api/userAPI';
import { useNavigate } from 'react-router-dom';

const Contacts = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [contacts, setContacts] = useState([])
  const navigate = useNavigate()
  const fetchContacts = async () => {
    const res = await getFriends(user._id)
    setContacts(res)
  }
  useEffect(() => {
    fetchContacts()
  }, [])

  return (
    <div className='contacts-sidebar'>
      <div className='contacts-header'>
        <h3>Những người bạn biết</h3>
        <div className='contacts-actions'>
          <button><i className='fas fa-search'></i></button>
          <button><i className='fas fa-ellipsis-h'></i></button>
        </div>
      </div>
      <div className='contacts-list'>
        {contacts.map(contact => (
          <div key={contact._id} className='contact-item' onClick={() => {
            navigate(`/profile/${contact._id}`)
          }}>
            <div className='contact-avatar'>
              <img src={contact?.picture?.url} />
              {contact.online && <span className='online-status'></span>}
            </div>
            <span className='contact-name'>{contact.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Contacts;