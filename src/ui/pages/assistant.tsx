import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

// Optional local controls if they exist in the project; fallback to simple placeholders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ThemeToggle: any = () => null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SettingsModal: any = () => null;
try {
  // dynamic require to avoid breaking in environments where these files don't exist
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ThemeToggle = require('../components/themetoggle').default || require('../components/themetoggle');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SettingsModal = require('../components/settingsmodal').default || require('../components/settingsmodal');
} catch {}

interface AssistantPageProps {
  user?: {
    username: string;
    role?: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
}

const chatQuickPrompts = [
  'Create a to-do list for a birthday',
  'What should I pack for a 4-day trip to Paris?',
  'What’s the difference of UX and UI',
  'Explain climate change like I am 5',
  'Write a professional email follow-up',
  'Draft a caption for a cozy fall outfit',
];

const AssistantPage: React.FC<AssistantPageProps> = ({ user, onLogout }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Model 2.4');
  const [messageDraft, setMessageDraft] = useState('');
  const [webcamOpen, setWebcamOpen] = useState(false);

  const userInitials = useMemo(() => {
    if (!user?.username) return 'A';
    const parts = user.username.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts[1]?.[0] ?? '';
    return `${first}${last}`.toUpperCase() || 'A';
  }, [user?.username]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Paper
        elevation={0}
        square
        sx={{
          width: 300,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <MenuIcon fontSize="small" />
          <Typography variant="subtitle1" fontWeight={700}>Laila</Typography>
        </Toolbar>
        <Box sx={{ px: 2, pb: 1 }}>
          <Button fullWidth variant="contained" color="primary" sx={{ textTransform: 'none' }}>New Chat</Button>
        </Box>

        <Box sx={{ px: 2, pb: 1 }}>
          <OutlinedInput fullWidth startAdornment={<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>} placeholder="Search Chats" sx={{ borderRadius: 2 }} />
        </Box>

        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Library</Typography>
        <List dense sx={{ px: 1 }}>
          {[1,2,3,4].map((i) => (
            <ListItem key={`lib-${i}`} sx={{ borderRadius: 2 }} button>
              <ListItemAvatar>
                <Avatar sx={{ width: 28, height: 28 }}>L</Avatar>
              </ListItemAvatar>
              <ListItemText primary={`List item`} secondary={`Supporting line text lorem ipsum dolor sit amet, consectetur...`} primaryTypographyProps={{ noWrap: true }} secondaryTypographyProps={{ noWrap: true }} />
            </ListItem>
          ))}
        </List>

        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', mt: 1 }}>Chats</Typography>
        <List dense sx={{ px: 1, flex: 1, overflow: 'auto' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <ListItem key={`chat-${i}`} sx={{ borderRadius: 2 }} button>
              <ListItemText
                primary={`List item`}
                secondary={`Supporting line text lorem ipsum dolor sit amet, consectetur...`}
                primaryTypographyProps={{ noWrap: true }}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>
          ))}
        </List>

        <Divider />
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={user?.avatarUrl} sx={{ width: 28, height: 28 }}>{userInitials}</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap>{user?.username || 'Ahmed Assad'}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{user?.role || 'Free Plan'}</Typography>
          </Box>
          <Tooltip title="Logout">
            <IconButton size="small" onClick={onLogout}><LogoutIcon fontSize="small" /></IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small">
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  labelId="model-select-label"
                  label="Model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  sx={{ minWidth: 140, borderRadius: 2 }}
                >
                  {['Model 2.4', 'Model 2.3', 'Vision Beta'].map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ThemeToggle />
              <Tooltip title="Settings"><IconButton onClick={() => setSettingsOpen(true)}><SettingsIcon /></IconButton></Tooltip>
              <Tooltip title="Logout"><IconButton onClick={onLogout}><LogoutIcon /></IconButton></Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Hero */}
        <Container maxWidth="lg" sx={{ flex: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64 }}>LA</Avatar>
          </Box>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={700}>My name is Laila</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Hello! I’m your AI assistant—here to help you get things done, answer questions, and
              make your day a little easier. What can I do for you today?
            </Typography>
          </Box>

          {/* Quick Action Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {chatQuickPrompts.map((prompt, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, height: '100%', cursor: 'pointer', borderRadius: 2 }}
                  onClick={() => setMessageDraft(prompt)}
                >
                  <Typography variant="subtitle2" fontWeight={600}>{prompt.split(' ')[0]} and organization</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {prompt}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Visual prompt */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip color="secondary" label="Laila can see you!" sx={{ fontWeight: 700 }} />
            <Typography variant="body2" color="text.secondary">
              Turn on video and show Laila anything: a product, a document, a piece of art—it will understand what it sees.
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Button startIcon={<VideocamIcon />} variant="contained" onClick={() => setWebcamOpen(true)} sx={{ textTransform: 'none' }}>Turn on</Button>
          </Paper>

          {/* Composer */}
          <Paper elevation={3} sx={{ mt: 'auto', p: 1.5, borderRadius: 3 }}>
            <OutlinedInput
              value={messageDraft}
              onChange={(e) => setMessageDraft(e.target.value)}
              placeholder="Type a message or ask me anything..."
              fullWidth
              sx={{ borderRadius: 2 }}
              startAdornment={
                <InputAdornment position="start">
                  <Tooltip title="Show webcam">
                    <IconButton onClick={() => setWebcamOpen(true)} size="small"><VideocamIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Attach file">
                    <IconButton size="small"><AttachFileIcon /></IconButton>
                  </Tooltip>
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title="Hold to speak">
                    <IconButton size="small"><MicIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Send">
                    <span>
                      <IconButton color="primary" disabled={!messageDraft.trim()} size="small">
                        <SendIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </InputAdornment>
              }
            />
          </Paper>
        </Container>

        {/* Webcam Overlay */}
        <Fade in={webcamOpen} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: (theme) => theme.zIndex.modal + 1,
            }}
          >
            <Paper sx={{ width: '86vw', height: '70vh', position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
              {/* Placeholder webcam area */}
              <Box sx={{ width: '100%', height: '100%', bgcolor: 'grey.900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="grey.100">Webcam preview goes here</Typography>
              </Box>
              <IconButton onClick={() => setWebcamOpen(false)} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)' }}>
                <CloseIcon sx={{ color: 'common.white' }} />
              </IconButton>
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, bgcolor: 'rgba(0,0,0,0.5)' }}>
                <Typography variant="subtitle2" color="common.white">Hello, how can I help you?</Typography>
              </Box>
            </Paper>
          </Box>
        </Fade>

        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </Box>
    </Box>
  );
};

export default AssistantPage;

