'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Container, Grid, Button } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import NewsCard from './NewsCard';
import CategoriesBar from './CategoriesBar';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchNews } from '@/store/slices/newsSlice';

const LIMIT = 8;

export default function NewsList() {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const prevCategory = useRef('all');

  const { docs, hasNextPage, isLoading, error, category } = useAppSelector((state) => state.news);

  useEffect(() => {
    if (category !== prevCategory.current) {
      prevCategory.current = category;
      setPage(1);
      dispatch(fetchNews({ limit: LIMIT, page: 1, category }));
    } else {
      dispatch(fetchNews({ limit: LIMIT, page, category }));
    }
  }, [dispatch, page, category]);

  return (
    <>
      <CategoriesBar />
      {error && (
        <Container
          sx={{ color: 'error.main', mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}
        >
          {error}
          <Button
            size="small"
            variant="outlined"
            onClick={() => dispatch(fetchNews({ limit: LIMIT, page, category }))}
          >
            Retry
          </Button>
        </Container>
      )}
      <InfiniteScroll
        dataLength={docs.length}
        next={() => setPage((p) => p + 1)}
        hasMore={hasNextPage}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>No more news</b>
          </p>
        }
        loader={null}
      >
        <Container sx={{ mb: 12 }}>
          <Grid container spacing={3}>
            {isLoading && docs.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Grid key={`skeleton-${i}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <NewsCard loading />
                  </Grid>
                ))
              : docs.map((item) => (
                  <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Link href={`/news/${item._id}`} style={{ textDecoration: 'none' }}>
                      <NewsCard imageUrl={item.image} title={item.title} description={item.text} />
                    </Link>
                  </Grid>
                ))}
          </Grid>
        </Container>
      </InfiniteScroll>
    </>
  );
}
