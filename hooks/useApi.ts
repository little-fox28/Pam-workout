/**
 * Pam App — useApi hook
 * Convenience wrapper around TanStack Query for typed API calls.
 */
import {
  type QueryKey,
  type UseQueryOptions,
  type UseMutationOptions,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import type { ApiError } from '@types/index';

/**
 * Typed query hook — wraps useQuery with sane defaults.
 */
export function useApiQuery<TData = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 2,
    ...options,
  });
}

/**
 * Typed mutation hook — wraps useMutation with sane defaults.
 */
export function useApiMutation<TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    ...options,
  });
}

/**
 * Re-export queryClient hook for manual cache control.
 */
export { useQueryClient };
