import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppStore';
import { fetchMeThunk } from '../store/auth.slice';

export function useSessionBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);
}
