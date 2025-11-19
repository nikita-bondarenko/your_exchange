import { updateUserDataAction } from "@/d__features/userDataDisplay/api";
import {
  setMailRequired,
  setUpdateUserDataLoading,
  setUserEmail,
} from "@/d__features/userDataDisplay/model";
import { useServerAction, validateEmail } from "@/shared/lib";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";
import { InputField, BaseModal } from "@/shared/ui";
import React, { useEffect, useState } from "react";

export default function EmailModal() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isErrorShowing, setIsErrorShowing] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data?.user_data);
  const userId = useAppSelector((state) => state.user.id);
  const isMailRequired = useAppSelector((state) => state.user.mailRequired);

  useEffect(() => {
    if (isMailRequired)
      setTimeout(() => {
        setIsEmailModalOpen(true);
        dispatch(setMailRequired(false));
      }, 1000);
  }, [isMailRequired]);

  useEffect(() => {
    const validationResult = validateEmail(value);
    setError(validationResult.error);
  }, [value]);

  const [updateUser, response, errorResponse] = useServerAction({
    action: updateUserDataAction,
    loadingAction: setUpdateUserDataLoading,
  });

  const handleSubmit = () => {
    setIsErrorShowing(true);
    if (!error && userId) {
      updateUser({
        user_id: userId,
        email: value,
      });
    }
  };

  useEffect(() => {
    if (response) {
      dispatch(setUserEmail(value));
      setIsEmailModalOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 3000);
    }
  }, [response]);

  useEffect(() => {
    if (errorResponse) {
      setIsEmailModalOpen(false);
      setIsErrorModalOpen(true);
      setTimeout(() => {
        setIsErrorModalOpen(false);
      }, 3000);
    }
  }, [errorResponse]);
  return (
    <>
      <BaseModal
        isOpen={isEmailModalOpen}
        handleClose={() => setIsEmailModalOpen(false)}
        handleButton={handleSubmit}
        buttonText="Отправить"
      >
        <div className="mb-[-25px]">
          <p className="mb-[30px]">
            Пожалуйста, введите свою почту для&nbsp;обратной связи - никакого
            спама, пишем только по&nbsp;делу
          </p>
          <InputField
            onChange={setValue}
            error={isErrorShowing ? error : ""}
            value={value}
            className="[&]:bg-[var(--background-global)]"
            placeholder="Электронная почта"
          />
        </div>
      </BaseModal>
      <BaseModal
        isOpen={isSuccessModalOpen}
        handleClose={() => setIsSuccessModalOpen(false)}
      >
        <p className="text-center">Email успешно сохранен!</p>
      </BaseModal>
      <BaseModal
        isOpen={isErrorModalOpen}
        handleClose={() => setIsErrorModalOpen(false)}
      >
        Произошла ошибка при попытке сохранить email. Свяжитесь с оператором.
      </BaseModal>
    </>
  );
}
