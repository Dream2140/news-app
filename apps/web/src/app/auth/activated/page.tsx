import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function ActivatedPage() {
  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Account Activated!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Your account has been successfully activated. You can now log in.
      </Typography>
      <Link href="/">
        <Button variant="contained" size="large">
          Go to Home
        </Button>
      </Link>
    </Container>
  );
}
