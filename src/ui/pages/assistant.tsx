import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SendIcon from '@mui/icons-material/Send';

interface AssistantPageProps {
  user?: {
    username: string;
    role: string;
  };
  onLogout?: () => void;
}

const sidebarWidth = 300;

const AssistantPage: React.FC<AssistantPageProps> = ({ user, onLogout }) => {
  const [model, setModel] = useState("Model '24");
  const [prompt, setPrompt] = useState('');

  const chats = useMemo(
    () =>
      new Array(6).fill(null).map((_, i) => ({
        id: `chat-${i + 1}`,
        title: 'List item',
        subtitle:
          'Supporting line text lorem ipsum dolor sit amet, consectetur…',
      })),
    []
  );

  const handleSend = () => {
    // Placeholder for sending prompt
    setPrompt('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#0f0f12',
        color: '#e6e6e6',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.08)',
          bgcolor: '#121317',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              bgcolor: '#7c4dff',
            }}
          />
          <Typography variant="h6" fontWeight={700} color="#fff">
            Laila
          </Typography>
        </Box>
        <Box sx={{ px: 2, pb: 1 }}>
          <Button
            fullWidth
            startIcon={<AddIcon />}
            sx={{
              justifyContent: 'flex-start',
              bgcolor: 'rgba(255,255,255,0.06)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            New Chat
          </Button>
        </Box>
        <List dense sx={{ px: 1 }}>
          <ListItem sx={{ borderRadius: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 36, color: '#a7a7a7' }}>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography color="#cfcfcf">Search Chats</Typography>}
            />
          </ListItem>
          <ListItem sx={{ borderRadius: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 36, color: '#a7a7a7' }}>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary={<Typography color="#cfcfcf">Library</Typography>} />
          </ListItem>
          <ListItem sx={{ borderRadius: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 36, color: '#a7a7a7' }}>
              <ViewInArIcon />
            </ListItemIcon>
            <ListItemText primary={<Typography color="#cfcfcf">Models</Typography>} />
          </ListItem>
        </List>

        <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="overline" sx={{ px: 2, color: '#9aa0a6' }}>
          Chats
        </Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
          <List dense>
            {chats.map((c) => (
              <ListItem key={c.id} sx={{ borderRadius: 1.5 }} button>
                <ListItemText
                  primary={<Typography color="#e6e6e6">{c.title}</Typography>}
                  secondary={
                    <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
                      {c.subtitle}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap fontSize={14} color="#fff">
              {user?.username || 'Ahmed Asaad'}
            </Typography>
            <Typography noWrap variant="caption" sx={{ color: '#9aa0a6' }}>
              Free Plan
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.06)',
                color: '#fff',
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
            >
              <MenuItem value={"Model '24"}>Model '24</MenuItem>
              <MenuItem value={'Vision Beta'}>Vision Beta</MenuItem>
              <MenuItem value={'Lite'}>Lite</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Toggle dark mode">
              <IconButton size="small" sx={{ color: '#cfcfcf' }}>
                <DarkModeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton size="small" sx={{ color: '#cfcfcf' }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            {onLogout && (
              <Tooltip title="Logout">
                <IconButton size="small" sx={{ color: '#cfcfcf' }} onClick={onLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>

        {/* Center hero */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <Box
            sx={{
              maxWidth: 900,
              mx: 'auto',
              px: 3,
              py: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 2,
            }}
          >
            <Avatar sx={{ width: 72, height: 72 }}>L</Avatar>
            <Typography variant="h4" fontWeight={700} color="#fff">
              My name is Laila
            </Typography>
            <Typography sx={{ color: '#b3b3b3', maxWidth: 680 }}>
              Hello! I'm your AI assistant—here to help you get things done, answer
              questions, and make your day a little easier. What can I do for you today?
            </Typography>

            {/* Suggestions */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ mt: 2, width: '100%' }}
            >
              {[
                {
                  title: 'Plan and organization',
                  items: [
                    'Create a to-do list for a birthday',
                    "What should I pack for a 4-day trip to Paris?",
                  ],
                },
                {
                  title: 'Ask me Anything',
                  items: [
                    'What’s the difference of UX and UI',
                    'What is intermittent fasting?',
                  ],
                },
                {
                  title: 'Write with me',
                  items: [
                    'Write a professional email',
                    'Draft a caption for a cozy fall outfit',
                  ],
                },
              ].map((card) => (
                <Paper
                  key={card.title}
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'left',
                  }}
                >
                  <Typography fontWeight={700} color="#fff" sx={{ mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Stack spacing={0.5}>
                    {card.items.map((it) => (
                      <Typography key={it} variant="body2" sx={{ color: '#cfcfcf' }}>
                        {it}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Bottom prompt */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              mx: 'auto',
              maxWidth: 900,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              p: 1,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  bgcolor: 'transparent',
                  px: 2,
                  py: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ color: '#bdbdbd', mb: 0.5 }}>
                  Laila can see you!
                </Typography>
                <InputBase
                  placeholder="Turn on video and show Laila anything; or type a prompt here"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  sx={{
                    color: '#fff',
                    width: '100%',
                  }}
                />
              </Paper>
              <Tooltip title="Video">
                <IconButton sx={{ color: '#cfcfcf' }}>
                  <VideocamIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Voice">
                <IconButton sx={{ color: '#cfcfcf' }}>
                  <MicIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Upload">
                <IconButton sx={{ color: '#cfcfcf' }}>
                  <UploadFileIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Send">
                <IconButton
                  onClick={handleSend}
                  sx={{
                    bgcolor: '#7c4dff',
                    color: '#fff',
                    '&:hover': { bgcolor: '#6a3df0' },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 1,
              color: '#8e8e93',
            }}
          >
            Laila may display inaccurate info, including about people, so double‑check
            responses. Your privacy is important.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AssistantPage;

