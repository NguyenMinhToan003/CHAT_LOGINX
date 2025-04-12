import { checkTypeByFileName } from '../../utils/checkFileType'
import { RiFileExcel2Fill } from 'react-icons/ri';
import { RiFileWord2Fill } from 'react-icons/ri';
import { BiSolidFilePdf } from "react-icons/bi";
import { GrDocumentZip } from "react-icons/gr";
import { GoFileDirectoryFill } from "react-icons/go";




import { Box, Typography } from '@mui/material';
const TypeFile = ({ file }) => {
  const type = checkTypeByFileName(file.url)
  console.log(file)
  return <>
    {type.isExcel && <Box
      onClick={() => window.open(file.url, '_blank')}
      sx={{ display: 'flex', alignItems: 'center', gap: 1, jsonifyContent: 'center', height: 20, backgroundColor: '#f0f0f0', padding: 1, borderRadius: 1, paddingX: 2, paddingY: 3 }}> 
      <RiFileExcel2Fill style={{color:'green', width:24, height:24}}/>
      <Typography variant='body2'
        sx={{
          paddingLeft: 1,
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
    </Box>}
    {
      type.isDocument && <Box
        onClick={() => window.open(file.url, '_blank')}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', height: 20, backgroundColor: '#f0f0f0', padding: 1, borderRadius: 1, paddingX: 2, paddingY: 3 }}> 
      <RiFileWord2Fill style={{color:'#005ae0', width:24, height:24}}/>
        <Typography variant='body2'
          sx={{
          paddingLeft: 1,
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
      </Box>}
    {
      type.isPdf && <Box
        onClick={() => window.open(file.url, '_blank')}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', height: 20, backgroundColor: '#f0f0f0', padding: 1, borderRadius: 1, paddingX: 2, paddingY: 3 }}> 
      <BiSolidFilePdf style={{color:'#f44640', width:24, height:24}}/>
        <Typography variant='body2'
          sx={{
          paddingLeft: 1,
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
    }
    {
      type.isZip && <Box
        onClick={() => window.open(file.url, '_blank')}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', height: 20, backgroundColor: '#f0f0f0', padding: 1, borderRadius: 1, paddingX: 2, paddingY: 3 }}> 
      <GrDocumentZip style={{color:'#1c1c1c', width:24, height:24}}/>
        <Typography variant='body2'
          sx={{
          paddingLeft: 1,
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
    }
    {
      type.isUnknown && <Box
        onClick={() => window.open(file.url, '_blank')}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', height: 20, backgroundColor: '#f0f0f0', padding: 1, borderRadius: 1, paddingX: 2, paddingY: 3 }}> 
        <GoFileDirectoryFill style={{color:'#1c1c1c', width:24, height:24}}/>
        <Typography variant='body2'
          sx={{
          paddingLeft: 1,
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
    }
    
    </>
}
export default TypeFile