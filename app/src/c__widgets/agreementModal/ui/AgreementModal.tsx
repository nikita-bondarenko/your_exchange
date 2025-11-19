import React, { useEffect, useMemo, useState } from "react";
import {BaseModal} from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import { setAgreementAccepted } from "@/d__features/userDataDisplay/model/store/reducer/userReducer";
import Checkbox from "../../../shared/ui/form/Checkbox";
import { typograf } from "@/shared/lib/string/typograf";
import { useServerAction } from "@/shared/lib";
import { updateUserDataAction } from "@/d__features/userDataDisplay/api";
import { setUpdateUserDataLoading } from "@/d__features/userDataDisplay/model";

export default function AgreementModal() {
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(true);
  const [isMature, setIsMature] = useState(false);
  const [isIdPossessor, setIsIdPossessor] = useState(false);
  const [hasAgreedWithTerms, setHasAgreedWithTerms] = useState(false);
  const userId = useAppSelector((state) => state.user.id);
  const agreementAccepted = useAppSelector(
    (state) => state.user.agreementAccepted
  );
  const policyUrl = useAppSelector((state) => state.pageData.home.policyUrl);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsAgreementModalOpen(!agreementAccepted);
  }, [agreementAccepted]);

  const [updateUser] = useServerAction({
    action: updateUserDataAction,
    loadingAction: setUpdateUserDataLoading,
  });

  const handleSubmit = () => {
    dispatch(setAgreementAccepted(true));
    if (userId) updateUser({ user_id: userId, has_consented: true });
  };

  const isSubmitButtonDisabled = useMemo(() => {
    return !(isMature && isIdPossessor && hasAgreedWithTerms);
  }, [isMature, isIdPossessor, hasAgreedWithTerms]);

  return (
    <BaseModal
      isOpen={isAgreementModalOpen}
      handleClose={() => {}}
      handleButton={handleSubmit}
      buttonText="Подтвердить"
      className="[&]:z-[300]"
      isCloseButtonHidden={true}
      isSubmitButtonDisabled={isSubmitButtonDisabled}
    >
      <div className="flex flex-col gap-[17px]">
        <Checkbox
          checked={isMature}
          onClick={() => {
            setIsMature(!isMature);
          }}
        >
          {typograf("Я подтверждаю, что мне уже исполнилось 18 лет")}
        </Checkbox>
        <Checkbox
          checked={isIdPossessor}
          onClick={() => {
            setIsIdPossessor(!isIdPossessor);
          }}
        >
          {typograf(
            "Я подтверждаю, что использую собственный Telegram ID и имею право распоряжаться указанной учётной записью"
          )}
        </Checkbox>
        <Checkbox
          checked={hasAgreedWithTerms}
          onClick={() => {
            setHasAgreedWithTerms(!hasAgreedWithTerms);
          }}
        >
          {typograf("Я даю согласие на обработку")}
          <a
            target="_blank"
            className="underline underline-offset-2"
            href={policyUrl}
          >
            персональных данных
          </a>
        </Checkbox>
      </div>
    </BaseModal>
  );
}
