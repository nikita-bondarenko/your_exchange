import { useRouter } from "next/navigation";

export const useRouterPushCallback = (path: string) => {
  const router = useRouter();

  const callback = () => {
    router.push(path);
  };

  return [callback];
};
