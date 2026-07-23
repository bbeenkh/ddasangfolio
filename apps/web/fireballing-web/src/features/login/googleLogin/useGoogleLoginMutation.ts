import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';


/**
 * 구글 로그인 mutation
 * @returns 
 */
export default function useGoogleLoginMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      // 구글 signin
      await signIn("google", {
        callbackUrl: '/'
      });
    },
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (error) => {
      console.error(error);
    }
  });
}
