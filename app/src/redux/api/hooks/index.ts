"use server"
import { fetchApi, FetchApiProps } from "@/redux/helpers/fetchApi";
import { UserListApiArg, UserListApiResponse } from "../types";

//   const [data, setData] = useState();
//   const fetchProps: FetchApiProps = {
//     params: {
//       user_id: userId,
//     },
//   };

//   useEffect(() => {

//   },[])

export const userListQuery = async ({
  userId,
}: UserListApiArg): Promise<{ data: UserListApiResponse | undefined }> => {
  const fetchProps: FetchApiProps = {
    params: {
      user_id: userId,
    },
    path: "/user/",
  };

  console.log('fetchProps',fetchProps)
  const result = await fetchApi<UserListApiResponse>(fetchProps);
  return {
    data: result,
  };
};
