'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NewsCard from '@/components/news/NewsCard';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { searchNews } from '@/store/slices/newsSlice';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const dispatch = useAppDispatch();
  const { docs, isLoading, searchQuery } = useAppSelector((state) => state.news);

  useEffect(() => {
    if (query && query !== searchQuery) {
      dispatch(searchNews(query));
    }
  }, [query, searchQuery, dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <SearchIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Results for &ldquo;{query}&rdquo;
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : docs.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No articles found for &ldquo;{query}&rdquo;
        </Typography>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {docs.length} article{docs.length !== 1 ? 's' : ''} found
          </Typography>
          <Grid container spacing={3}>
            {docs.map((item) => (
              <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Link href={`/news/${item._id}`} style={{ textDecoration: 'none' }}>
                  <NewsCard
                    imageUrl={item.image}
                    title={item.title}
                    description={item.text}
                    category={item.category}
                    readingTime={item.readingTime}
                    source={item.source}
                    publishedAt={item.publishedAt}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
