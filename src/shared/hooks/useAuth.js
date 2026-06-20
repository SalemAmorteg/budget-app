import { useAuthContext } from '@features/auth/store/authStore';
export function useAuth() {
    return useAuthContext();
}
