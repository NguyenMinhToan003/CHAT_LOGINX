import { useState } from 'react';
import { updateUserProfile } from '~/api/userAPI';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  useTheme,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const PersonalInfo = ({ user, setUser, onProfileUpdate, isOwnProfile }) => {
  const theme = useTheme();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    work: user.work || '',
    bio: user.bio || '',
    phone: user.phone || '',
    email: user.email || '',
    address: user.address || '',
  });
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
  });

  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email) return 'Email không được để trống';
    if (!emailRegex.test(email)) return 'Email phải có định dạng hợp lệ và thuộc Gmail (ví dụ: example@gmail.com)';
    return '';
  };

  // Hàm kiểm tra định dạng số điện thoại
  const validatePhone = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    if (!phone) return 'Số điện thoại không được để trống';
    if (!phoneRegex.test(phone)) return 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
    return '';
  };

  // Hàm xử lý thay đổi input và kiểm tra lỗi
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));

    // Kiểm tra lỗi ngay khi nhập
    if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'phone') {
      setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  // Hàm lưu thông tin cá nhân
  const savePersonalInfo = async () => {
    // Kiểm tra lỗi trước khi lưu
    const emailError = validateEmail(personalInfo.email);
    const phoneError = validatePhone(personalInfo.phone);

    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      return;
    }

    try {
      const updatedData = {
        name: user.name || 'Chưa cập nhật',
        phone: personalInfo.phone,
        email: personalInfo.email,
        address: personalInfo.address,
        bio: personalInfo.bio,
        work: personalInfo.work,
      };

      console.log('Dữ liệu gửi lên:', updatedData);

      await updateUserProfile(user._id, updatedData);

      setUser((prev) => ({
        ...prev,
        ...updatedData,
      }));

      if (onProfileUpdate) {
        onProfileUpdate();
      }

      setIsEditingInfo(false);
      setErrors({ email: '', phone: '' }); // Xóa lỗi sau khi lưu thành công
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('Có lỗi khi cập nhật thông tin. Vui lòng thử lại sau.');
    }
  };

  const handleOpenEditDialog = () => setIsEditingInfo(true);
  const handleCloseEditDialog = () => {
    setIsEditingInfo(false);
    setErrors({ email: '', phone: '' }); // Xóa lỗi khi đóng dialog
    setPersonalInfo({
      work: user.work || '',
      bio: user.bio || '',
      phone: user.phone || '',
      email: user.email || '',
      address: user.address || '',
    }); // Khôi phục giá trị ban đầu
  };

  // Kiểm tra xem nút "Lưu thay đổi" có nên bị vô hiệu hóa
  const isSaveDisabled = errors.email || errors.phone || !personalInfo.email || !personalInfo.phone;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Giao diện hiển thị thông tin */}
      <Card
        elevation={3}
        sx={{
          borderRadius: '16px',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Thông tin cá nhân
            </Typography>
            {isOwnProfile && (
              <IconButton
                color="primary"
                onClick={handleOpenEditDialog}
                sx={{
                  '&:hover': { backgroundColor: theme.palette.primary.light, color: 'white' },
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <List>
            <Fade in={true} timeout={400}>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Làm việc tại"
                  secondary={personalInfo.work || 'Chưa cập nhật'}
                  secondaryTypographyProps={{ fontWeight: 'medium', color: 'text.secondary' }}
                />
              </ListItem>
            </Fade>
            <Fade in={true} timeout={600}>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Học tại"
                  secondary={personalInfo.bio || 'Chưa cập nhật'}
                  secondaryTypographyProps={{ fontWeight: 'medium', color: 'text.secondary' }}
                />
              </ListItem>
            </Fade>
          </List>

          <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mt={2} mb={1}>
            Thông tin liên hệ
          </Typography>
          <List>
            <Fade in={true} timeout={800}>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={personalInfo.email || 'Chưa cập nhật'}
                  secondaryTypographyProps={{ fontWeight: 'medium', color: 'text.secondary' }}
                />
              </ListItem>
            </Fade>
            <Fade in={true} timeout={1000}>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Số điện thoại"
                  secondary={personalInfo.phone || 'Chưa cập nhật'}
                  secondaryTypographyProps={{ fontWeight: 'medium', color: 'text.secondary' }}
                />
              </ListItem>
            </Fade>
            <Fade in={true} timeout={1200}>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Địa chỉ"
                  secondary={personalInfo.address || 'Chưa cập nhật'}
                  secondaryTypographyProps={{ fontWeight: 'medium', color: 'text.secondary' }}
                />
              </ListItem>
            </Fade>
          </List>
        </CardContent>
      </Card>

      {/* Dialog chỉnh sửa thông tin */}
      <Dialog
        open={isEditingInfo}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Chỉnh sửa thông tin cá nhân
          </Typography>
          <IconButton onClick={handleCloseEditDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nơi làm việc"
              name="work"
              value={personalInfo.work}
              onChange={handleInfoChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { fontWeight: 'medium' } }}
            />
            <TextField
              label="Học vấn"
              name="bio"
              value={personalInfo.bio}
              onChange={handleInfoChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { fontWeight: 'medium' } }}
            />
            <TextField
              label="Email"
              name="email"
              value={personalInfo.email}
              onChange={handleInfoChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { fontWeight: 'medium' } }}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={personalInfo.phone}
              onChange={handleInfoChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { fontWeight: 'medium' } }}
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              label="Địa chỉ"
              name="address"
              value={personalInfo.address}
              onChange={handleInfoChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { fontWeight: 'medium' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 'medium',
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={savePersonalInfo}
            variant="contained"
            color="primary"
            disabled={isSaveDisabled}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 'medium',
              px: 3,
              '&:disabled': {
                backgroundColor: theme.palette.grey[300],
                color: theme.palette.grey[500],
              },
            }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonalInfo;