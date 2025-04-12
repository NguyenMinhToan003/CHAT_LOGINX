import { Box, Typography } from '@mui/material';
import { RiFileExcel2Fill, RiFileWord2Fill } from 'react-icons/ri';
import { BiSolidFilePdf } from 'react-icons/bi';
import { RiFolderZipFill } from "react-icons/ri";

import { GoFileDirectoryFill } from 'react-icons/go';
import { checkTypeByFileName } from '../../utils/checkFileType';


const fileTypeConfig = {
  isExcel: {
    icon: <RiFileExcel2Fill style={{ color: '#1D6F42', width: 28, height: 28 }} />,
    backgroundColor: '#E6F4EA',
  },
  isDocument: {
    icon: <RiFileWord2Fill style={{ color: '#4267B2', width: 28, height: 28 }} />,
    backgroundColor: '#E8EEFA',
  },
  isPdf: {
    icon: <BiSolidFilePdf style={{ color: '#CB2027', width: 28, height: 28 }} />,
    backgroundColor: '#FDEDED',
  },
  isZip: {
    icon: <RiFolderZipFill style={{ color: '#800080', width: 20, height: 20 }} />,
    backgroundColor: '#F5E6F5',
  },
  isUnknown: {
    icon: <GoFileDirectoryFill style={{ color: '#F28C28', width: 24, height: 24 }} />,
    backgroundColor: '#FFF4E6', 
  },
};

const TypeFile = ({ file, isClick = true }) => {
  const type = checkTypeByFileName(file.url);

  
  const fileTypeKey = Object.keys(type).find((key) => {
    if(type[key] === true) {
      return key;
    }
  })
  
  const config = fileTypeConfig[fileTypeKey] || fileTypeConfig.isUnknown;

  return (
    <Box
      onClick={() => isClick && window.open(file.url, '_blank')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        justifyContent: 'center',
        backgroundColor: config.backgroundColor,
        color: 'text.primary',
        boxShadow: 1,
        borderRadius: 1,
        px: 2,
        py: 1,
        height: 48,
        cursor: isClick ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: isClick ? `${config.backgroundColor}CC` : config.backgroundColor, // 
        },
      }}
    >
      {config.icon}
      <Typography
        variant="body2"
        sx={{
          pl: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.2rem',
          fontSize: '0.875rem',
        }}
      >
        {file.name}
      </Typography>
    </Box>
  );
};

export default TypeFile;