import React, { useEffect, useState } from "react";
import Modal from "../ui/BaseModal";
import InputField from "../InputField";
import { formSchema } from "@/schemas/formSchema";
import z from "zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {  useUserUpdateCreateMutation } from "@/redux/api/cryptusApi";
import { setMailRequired, setUserEmail } from "@/redux/slices/userSlice/userSlice";

export const validateEmail = (email: string): { error: string } => {
  try {
    // Используем только часть схемы для email
    const emailSchema = formSchema.shape.email;
    emailSchema.parse(email); // Проверяем email
    return { error: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Неизвестная ошибка" };
  }
};

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
    console.log("submit", !error && userId);
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
        mode="light"
        isOpen={isEmailModalOpen}
        handleClose={() => setIsEmailModalOpen(false)}
        handleButton={handleSubmit}
        buttonText="Отправить"
        lightBackgroundClass="bg-[#F1F1F1]"
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
            placeholder="Электронная почта"
          />
        </div>
      </Modal>
      <Modal
        mode="light"
        isOpen={isSuccessModalOpen}
        handleClose={() => setIsSuccessModalOpen(false)}
      >
        <p className="text-center">Email успешно сохранен!</p>
      </Modal>
      <Modal
        mode="light"
        isOpen={isErrorModalOpen}
        handleClose={() => setIsErrorModalOpen(false)}
      >
        Произошла ошибка при попытке сохранить email. Свяжитесь с оператором.
      </Modal>
    </>
  );
}
