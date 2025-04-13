// ~/components/RoomInfoPanel.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ShareIcon from '@mui/icons-material/Share';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import AddMemberForm from '~/components/AddMemberForm';
import EditGroupForm from '~/components/EditGroupForm';
import { delateRoom, leaveRoom } from '~/api/roomAPI';

const RoomInfoPanel = ({
  room,
  user,
  toggleShowInfoRoom,
  setIsChange,
  handleCloseInfoPanel,
}) => {
  const navigate = useNavigate();
  const [openEditGroupForm, setOpenEditGroupForm] = useState(false);
  const [openAddMemberForm, setOpenAddMemberForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteRoom = async () => {
    const response = await delateRoom({ roomId: room._id, userId: user._id });
    if (response) {
      setOpenDeleteDialog(false);
      navigate('/roomchats');
    }
  };

  const handleLeaveRoom = async () => {
    const response = await leaveRoom({ roomId: room._id, userId: user._id });
    if (response.code === 0) {
      navigate('/roomchats');
    } else {
      alert(response.message);
    }
  };

  return (
    <Box
      sx={{
        width: toggleShowInfoRoom ? 350 : 0,
        display: 'flex',
        overflow: 'hidden',
        transition: 'width 0.5s',
        backgroundColor: 'secondary.main',
        borderRadius: 3,
        padding: toggleShowInfoRoom ? 2 : 0,
        height: '100vh',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: toggleShowInfoRoom ? 'flex' : 'none',
          transition: 'display 1.5s ease-in-out',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: 1,
        }}
      >
        <Avatar
          src={room?.avatar?.url}
          sx={{
            width: 80,
            height: 80,
            border: '2px solid',
            borderColor: 'primary.main',
          }}
        />
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            textAlign: 'center',
            wordBreak: 'break-word',
          }}
        >
          {room?.name}
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: '0.9rem',
            textAlign: 'center',
            wordBreak: 'break-word',
            paddingX: 1,
          }}
        >
          {room?.description || 'Không có mô tả'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: toggleShowInfoRoom ? 'block' : 'none',
          transition: 'display 1.5s ease-in-out',
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'background.default',
            padding: 1,
            borderRadius: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
          }}
        >
          <Tooltip title="Thêm thành viên">
            <IconButton color="primary" onClick={() => setOpenAddMemberForm(true)}>
              <AddOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chia sẻ nhóm">
            <IconButton color="info">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa thông tin">
            <IconButton color="success" onClick={() => setOpenEditGroupForm(true)}>
              <EditCalendarOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thoát nhóm">
            <IconButton color="warning" onClick={handleLeaveRoom}>
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa nhóm">
            <IconButton
              color="error"
              onClick={handleOpenDeleteDialog}
              disabled={
                room?.members?.some((m) => m._id === user._id && m.role === 'admin')
                  ? false
                  : true
              }
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          display: toggleShowInfoRoom ? 'block' : 'none',
          transition: 'display 1.5s ease-in-out',
          flex: 1,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflowY: 'auto',
        }}
      >
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: '1rem',
            fontWeight: 'medium',
            my: 2,
          }}
        >
          Thành viên ({room?.members?.length || 0})
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {room?.members?.map((member, index) => (
            <Box
              onClick={() => {
                navigate(`/chat-user/${member._id}`);
              }}
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                paddingY: 1,
                paddingRight: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Avatar
                src={member.picture?.url ? member.picture?.url : member.picture}
                sx={{
                  width: 36,
                  height: 36,
                  border: room?.admins?.some((m) => m._id === member._id)
                    ? '2px solid orange'
                    : 'none',
                }}
              />
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: '0.95rem',
                  flex: 1,
                }}
              >
                {member.name}
                {member._id === user._id && (
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: 'gray',
                      fontWeight: 'medium',
                    }}
                  >
                    (bạn)
                  </Typography>
                )}
              </Typography>
              {member?.role === 'admin' && (
                <Typography
                  sx={{
                    padding: 0.5,
                    fontSize: '0.75rem',
                    color: 'red',
                    fontWeight: 'bold',
                    border: '1px solid gray',
                    borderRadius: 1,
                  }}
                >
                  Admin
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <AddMemberForm
        setIsChange={setIsChange}
        room={room}
        open={openAddMemberForm}
        onClose={() => setOpenAddMemberForm(false)}
      />
      <EditGroupForm
        room={room}
        open={openEditGroupForm}
        onClose={() => setOpenEditGroupForm(false)}
        setIsChange={setIsChange}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          className: 'delete-dialog-paper',
        }}
      >
        <DialogTitle className="delete-dialog-title" id="alert-dialog-title">
          <DeleteOutlineOutlinedIcon /> Xác nhận
        </DialogTitle>
        <DialogContent className="delete-dialog-content">
          <DialogContentText id="alert-dialog-description" className="delete-dialog-text">
            Bạn có chắc chắn muốn xóa nhóm này?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="delete-dialog-actions">
          <Button onClick={handleCloseDeleteDialog} className="cancel-button">
            Hủy
          </Button>
          <Button onClick={handleDeleteRoom} className="delete-button" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomInfoPanel;