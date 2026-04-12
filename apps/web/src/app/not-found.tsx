import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Page not found
      </Typography>
      <Link href="/">
        <Button variant="contained" size="large">
          Go Home
        </Button>
      </Link>
    </Container>
  );
}
