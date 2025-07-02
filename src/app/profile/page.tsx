"use client";
import RequestStoryItem, {
  RequestStoryItemProps,
} from "@/components/profile/RequestStoryItem";
import Button from "@/components/ui/Button";
import { Notification } from "@/components/ui/Notification";
import { InputField } from "@/components/ui/ProfileInputField";
import { useUserUpdateCreateMutation } from "@/redux/api/cryptusApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPageName } from "@/redux/slices/uiSlice";
import { formSchema } from "@/schemas/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";


export default function Page() {
  const dispatch = useAppDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const isAppReady = useAppSelector((state) => state.ui.isAppReady);

  useEffect(() => {
    dispatch(setPageName("Данные профиля"));
  }, [dispatch]);

  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

const {id: userId, data} = useAppSelector(state => state.user) 
const [updateUser] = useUserUpdateCreateMutation()

  const onSubmit = methods.handleSubmit((data) => {
    if (!userId) return;
    
    updateUser({
  body: {
    user_id: userId,
    full_name: data.name,
    phone: data.phone,
    email: data.email,
  }
    }).then(() => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    });
  });


  useEffect(() => {
    if (data) {
      methods.reset({
        name: data?.user_data?.name,
        phone: data?.user_data?.phone,
        email: data?.user_data?.email,
      });
    }
  }, [data, methods]);


  return (
    <div className="container mt-20">
      <div className="mb-35">
      <FormProvider {...methods}>
          <form className="relative" onSubmit={onSubmit}>
            <h2 className="heading">Контактная информация</h2>
            <div className="relative">
              <div
                className={clsx("flex flex-col mb-7 relative transition-all", {
                  "blur-sm": showSuccess,
                })}
              >
                <InputField name="name" type="text" placeholder="ФИО" />
                <InputField
                  name="phone"
                  type="tel"
                  placeholder="Номер телефона"
                />
                <InputField
                  name="email"
                  type="email"
                  placeholder="Электронная почта"
                />
              </div>
              <Notification
                className="center w-full mt-20"
                isVisible={showSuccess}
                message="данные успешно сохранены"
              />
            </div>
            <Button submit type="primary">
              Сохранить
            </Button>
         
          </form>
        </FormProvider>
      </div>
    {data?.requests_all && data?.requests_all.length > 0 && <div>
        <h2 className="heading">История обращений</h2>
        {data?.requests_all?.map((exchange, index) => (
          <RequestStoryItem data={exchange} key={index} />
        ))}
      </div>}
    </div>
  );
}
