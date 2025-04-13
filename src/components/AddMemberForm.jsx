import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { getAllUser, getFriends, searchUser } from '~/api/userAPI';
import { joinRoom } from '~/api/roomAPI';


const AddMemberForm = ({ open, onClose, room, setIsChange }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [addMembers, setAddMembers] = useState([]);

  const fetchFriendsAndUsers = async () => {
    try {
      setLoading(true);
      const friendsResponse = await getFriends(user._id);
      const usersResponse = await getAllUser();

      const filteredFriends = friendsResponse.filter(
        (friend) => !room.members.some((member) => member._id === friend._id)
      );

      const filteredUsers = usersResponse.filter(
        (user) => 
          !room.members.some((member) => member._id === user._id) && 
          !filteredFriends.some((friend) => friend._id === user._id)
      );

      setFriends(filteredFriends);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching friends or users:', error);
      setFriends([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setKeyword(value);
    if (value.trim()) {
      try {
        setLoading(true);
        const response = await searchUser(value);
        // Lọc ra những người dùng chưa có trong nhóm
        const filteredSearchUsers = response.filter(
          (user) => !room.members.some((member) => member._id === user._id)
        );
        setUsers(Array.isArray(filteredSearchUsers) ? filteredSearchUsers : []);

      } catch (error) {
        console.error('Error searching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    } else {
      fetchFriendsAndUsers(); // Reset to all users when search is cleared
    }
  };

  const handleClose = () => {
    setAddMembers([]);
    onClose(addMembers);
    
  }
  const handleAddMember = (member) => {
    if (!addMembers.some((m) => m._id === member._id)) {
      setAddMembers([...addMembers, member]);
    }

  };

  const handleJoinRoom = async() => {
    const memberIds = addMembers.map(i=>i._id)
    const res = await joinRoom ({roomId:room._id,members:memberIds})
    setIsChange(true)
    handleClose()
  };

  useEffect(() => {
    if (open) {
      fetchFriendsAndUsers();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'secondary.main',
          borderRadius: 3,
          padding: 2,
          height: 600,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '1.25rem' }}>
          Thêm thành viên
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'text.primary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2 }}>
          <TextField
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm kiếm tên hoặc ID thành viên"
            variant="outlined"
            fullWidth
            sx={{
              my: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default',
                borderRadius: 2,
                '& fieldset': { borderColor: 'text.secondary' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputBase-input': { color: 'text.main', padding: '10px' },
            }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Friends List */}
              {friends.length > 0 && (
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 'medium', mb: 1 }}>
                    Bạn bè ({friends.length})
                  </Typography>
                  <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {friends.map((friend) => (
                      <Box
                        key={friend._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          py: 1,
                          '&:hover': { backgroundColor: 'action.hover' },
                        }}
                      >
                        <Avatar src={friend?.picture?.url} sx={{ width: 36, height: 36 }} />
                        <Typography sx={{ color: 'text.primary', flexGrow: 1 }}>
                          {friend.name}
                        </Typography>
                        {
                          room?.members.includes(friend._id) ? (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<AddOutlinedIcon />}
                              disabled
                            >
                              Đã thêm
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<AddOutlinedIcon />}
                              onClick={() => handleAddMember(friend)}
                            >
                              Thêm
                            </Button>
                          )
                        }
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </Box>
              )}

              {/* Users List */}
              {users.length > 0 ? (
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 'medium', mb: 1 }}>
                    Người dùng ({users.length})
                  </Typography>
                  <Box sx={{ minHeight: 150, overflowY: 'auto' }}>
                    {users
                      .filter((u) => !friends.some((f) => f._id === u._id))
                      .map((member) => (
                        <Box
                          key={member._id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            py: 1,
                            '&:hover': { backgroundColor: 'action.hover' },
                          }}
                        >
                          <Avatar src={member?.picture?.url} sx={{ width: 36, height: 36 }} />
                          <Typography sx={{ color: 'text.primary', flexGrow: 1 }}>
                            {member.name}
                          </Typography>
                          {
                            room?.members.includes(member) ? (
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<AddOutlinedIcon />}
                                disabled
                              >
                                Đã thêm
                              </Button>

                            ) :
                              (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<AddOutlinedIcon />}
                                  onClick={() => handleAddMember(member)}
                                >
                                  Thêm
                                </Button>
                              )
                            
                          }
                        </Box>
                      ))}
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                  Không tìm thấy người dùng
                </Typography>
              )}
            </>
          )}
        </Box>
        <Divider/>
        <Box>
          <Typography sx={{ color: 'text.secondary', fontWeight: 'medium', mb: 1 }}>
            Thành viên đã chọn ({addMembers.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
            {addMembers.map((member) => (
              <Avatar key={member._id} src={member?.picture?.url} sx={{ width: 36, height: 36 }} />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
          Hủy
        </Button>
        <Button onClick={handleJoinRoom} variant='contained'>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberForm;