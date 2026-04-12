import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 8,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <NewspaperIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Dream
            <Box component="span" sx={{ color: 'primary.main' }}>
              News
            </Box>
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Your daily source for technology, cybersport, and gaming news.
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          <MuiLink
            href="https://github.com/Dream2140/newsApp"
            target="_blank"
            color="text.secondary"
            underline="hover"
            variant="body2"
          >
            GitHub
          </MuiLink>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
          {new Date().getFullYear()} Dream News. Built with Next.js & NestJS.
        </Typography>
      </Container>
    </Box>
  );
}
