// ~/components/ReplyMessage.jsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import TypeFile from '~/components/typeFile/TypeFile';

const ReplyMessage = ({ repMessage, onClear }) => {
  if (!repMessage) return null;

  return (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 1,
                      padding: 1,
                      color: 'white',
                      minHeight: 100,
                      maxHeight: 200,
                      overflowY: 'auto',
                      overflowX: 'hidden',
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ color: 'text.primary', fontWeight: 'bold', paddingBottom: 1 }}
                      >
                        Đang trả lời {repMessage.sender.name}
                      </Typography>
                      <Typography
                        sx={{
                          borderLeft: '3px solid #4caf50',
                          paddingLeft: 1,
                          color: 'text.secondary',
                          display: 'flex',
                          gap: 1,
                          flexWrap: 'wrap',
                          lineHeight: '1.2rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        {repMessage.images.length > 0 ? (
                          repMessage.images.map((image, index) => {
                            if (image.type === 'image')
                              return (
                                <img
                                  key={index}
                                  src={image.url}
                                  alt=""
                                  style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 5,
                                    marginRight: 5,
                                  }}
                                />
                              );
                            else if (image.type === 'video')
                              return (
                                <video
                                  key={index}
                                  src={image.url}
                                  alt=""
                                  style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 5,
                                    marginRight: 5,
                                  }}
                                  controls
                                />
                              );
                            else return <TypeFile file={image} key={index} isClick={false} />;
                          })
                        ) : (
                          <Typography
                            sx={{ color: 'text.secondary', fontSize: '0.875rem', padding: 1 }}
                          >
                            {repMessage.content}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => onClear(null)}>
                      <ClearIcon sx={{ color: 'text.secondary' }} />
                    </IconButton>
                  </Box>

  );
};

export default ReplyMessage;