import {
  useCreateInvoiceOrderMutation,
  useCreateFTAOrderMutation,
  useCreateChinesePlatformOrderMutation,
  useCreateAbroadCardTransferOrderMutation,
  OrderResponse,
} from "@/shared/api";
import {
  useAppSelector,
  abroadTransferDetailsSelector,
  useAppDispatch,
  setOrderId,
} from "@/shared/model/store";
import { useRouter } from "next/navigation";

export const useTransferInputDataSubmit = (transferType: string | null) => {
  const router = useRouter();
  const {
    transferTypeCategorySlug,
    currency,
    amount,
    bank,
    cardNumber,
    countryName,
    taskDescription,
    platform,
    file1,
    file2,
    russianCompanyRequisites,
    abroadCompanyRequisites,
  } = useAppSelector(abroadTransferDetailsSelector);

  const [createInvoiceOrder] = useCreateInvoiceOrderMutation();
  const [createFTAOrder] = useCreateFTAOrderMutation();
  const [createChinesePlatform] = useCreateChinesePlatformOrderMutation();
  const [createAbroadCardTransferOrder] =
    useCreateAbroadCardTransferOrderMutation();

  const dispatch = useAppDispatch();

  const requiestPromiseCallback = (value: {
    data?: OrderResponse | undefined;
  }) => {
    console.log(value);
    dispatch(setOrderId(value.data?.order_id || 'no_info'));
    router.push("/transfer-abroad/result");
  };

  const userId = useAppSelector((state) => state.user.id);

  const handleSubmit = () => {
    switch (transferType) {
      case "cards": {
        if (cardNumber && currency?.name && amount && bank?.name && userId)
          createAbroadCardTransferOrder({
            card_number: cardNumber,
            currency_name: currency?.name,
            amount,
            bank_name: bank?.name,
            user_id: userId,
          }).then(requiestPromiseCallback);
        break;
      }
      case "chinese-platforms": {
        console.log(currency?.name, amount, platform?.name);
        if (currency?.name && amount && platform?.name && userId)
          createChinesePlatform({
            currency_name: currency?.name,
            amount,
            platform_name: platform?.name,
            user_id: userId,
          }).then(requiestPromiseCallback);
        break;
      }
      case "fta": {
        console.log(currency?.name, amount, taskDescription, userId);
        if (currency?.name && amount && taskDescription && userId)
          createFTAOrder({
            user_id: userId,
            currency_name: currency?.name,
            amount,
            task_description: taskDescription,
            file_1: file1,
            file_2: file2,
            russian_company_requisites: russianCompanyRequisites,
            abroad_company_requisites: abroadCompanyRequisites,
          }).then(requiestPromiseCallback);
        break;
      }
      case "invoice": {
        console.log(
          currency?.name,
          amount,
          taskDescription,
          countryName,
          transferTypeCategorySlug
        );
        if (
          currency?.name &&
          amount &&
          taskDescription &&
          countryName &&
          transferTypeCategorySlug &&
          userId
        )
          createInvoiceOrder({
            currency_name: currency?.name,
            amount,
            task_description: taskDescription,
            country_name: countryName,
            transfer_type: transferTypeCategorySlug,
            user_id: userId,
          }).then(requiestPromiseCallback);
        break;
      }
    }
  };

  return [handleSubmit];
};
