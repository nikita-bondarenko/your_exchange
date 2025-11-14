import React, { useEffect, useState } from "react";
import Modal from "../../../shared/ui/modal/BaseModal";
import InputField from "../../../shared/ui/form/InputField";

import { validateEmail } from "@/shared/lib/validation";
import { useUserUpdateCreateMutation } from "@/d__features/userDataDisplay/api";
import { setMailRequired, setUserEmail } from "@/d__features/userDataDisplay/model";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";


export default function EmailModal () {
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
        dispatch(setMailRequired(false))
      }, 1000);
  }, [isMailRequired]);

  useEffect(() => {
    const validationResult = validateEmail(value);
    setError(validationResult.error);
  }, [value]);

  const [updateUser] = useUserUpdateCreateMutation();
  const handleSubmit = async () => {
    setIsErrorShowing(true);
    if (!error && userId) {
      try {
        await updateUser({
       
            user_id: userId,
            full_name: userData?.name,
            phone: userData?.phone,
            email: value,
         
        });
        dispatch(setUserEmail(value));
        setIsEmailModalOpen(false);
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          setIsSuccessModalOpen(false);
        }, 3000);
      } catch {
        setIsEmailModalOpen(false);
        setIsErrorModalOpen(true);
        setTimeout(() => {
          setIsErrorModalOpen(false);
        }, 3000);
      }
    }
  };
  return (
    <>
      <Modal
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
      </Modal>
      <Modal
        isOpen={isSuccessModalOpen}
        handleClose={() => setIsSuccessModalOpen(false)}
      >
        <p className="text-center">Email успешно сохранен!</p>
      </Modal>
      <Modal
        isOpen={isErrorModalOpen}
        handleClose={() => setIsErrorModalOpen(false)}
      >
        Произошла ошибка при попытке сохранить email. Свяжитесь с оператором.
      </Modal>
    </>
  );
}
