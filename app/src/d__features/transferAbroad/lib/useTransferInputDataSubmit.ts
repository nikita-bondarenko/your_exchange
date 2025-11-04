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
    if (value.data?.order_id) dispatch(setOrderId(value.data?.order_id));
    router.push("/transfer-abroad/result");
  };

  const handleSubmit = () => {
    switch (transferType) {
      case "cards": {
        if (cardNumber && currency?.name && amount && bank?.name)
          createAbroadCardTransferOrder({
            card_number: cardNumber,
            currency_name: currency?.name,
            amount,
            bank_name: bank?.name,
          }).then(requiestPromiseCallback);
        break;
      }
      case "chinese-platforms": {
        if (currency?.name && amount && platform?.name)
          createChinesePlatform({
            currency_name: currency?.name,
            amount,
            platform_name: platform?.name,
          }).then(requiestPromiseCallback);
        break;
      }
      case "fta": {
        if (currency?.name && amount && taskDescription)
          createFTAOrder({
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
        if (
          currency?.name &&
          amount &&
          taskDescription &&
          countryName &&
          transferTypeCategorySlug
        )
          createInvoiceOrder({
            currency_name: currency?.name,
            amount,
            task_description: taskDescription,
            country_name: countryName,
            transfer_type: transferTypeCategorySlug,
          }).then(requiestPromiseCallback);
        break;
      }
    }
  };

  return [handleSubmit];
};
