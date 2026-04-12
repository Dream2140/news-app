'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Container, Grid } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import NewsCard from './NewsCard';
import CategoriesBar from './CategoriesBar';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchNews } from '@/store/slices/newsSlice';

const LIMIT = 8;

export default function NewsList() {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();

  const { docs, hasNextPage, isLoading, error, category } = useAppSelector((state) => state.news);

  const params = useMemo(() => ({ limit: LIMIT, page, category }), [page, category]);

  useEffect(() => {
    dispatch(fetchNews(params));
  }, [dispatch, params]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  return (
    <>
      <CategoriesBar />
      {error && <Container sx={{ color: 'error.main', mb: 2 }}>{error}</Container>}
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
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
