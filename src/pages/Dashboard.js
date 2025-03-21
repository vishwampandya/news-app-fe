import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';

function Dashboard() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">
          Welcome to Dashboard
        </Typography>
      </Container>
    </Box>
  );
}

export default Dashboard; 