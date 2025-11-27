"use client";

import { Button } from "@/shared/ui/button";
import { Notification, ProfileInputField } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { formValidationSchema } from "@/shared/lib/validation";
import RequestStoryItem from "@/entities/shortRequestDetails/ui";
import { SignIcon } from "@/shared/ui";
import {
  setUpdateUserDataLoading,
  updateUserProfileData,
} from "@/d__features/userDataDisplay/model";
import { UserUpdateCreateApiArg } from "@/shared/model/api";
import {
  useAppDispatch,
  setPageName,
  useAppSelector,
} from "@/shared/model/store";
import { updateUserDataAction } from "@/d__features/userDataDisplay/api";
import { useServerAction } from "@/shared/lib";
import { useTrackUserAction } from "@/d__features/userDataDisplay/lib";

const headingClassNames =
  "font-medium text-16 leading-normal mb-20 text-[var(--text-main)]";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    dispatch(setPageName("Данные профиля"));
  }, [dispatch]);

  const methods = useForm({
    resolver: zodResolver(formValidationSchema),
  });

  const { id: userId, data } = useAppSelector((state) => state.user);

  const [updateUser, response] = useServerAction({
    action: updateUserDataAction,
    loadingAction: setUpdateUserDataLoading,
  });

  const { trackUserAction } = useTrackUserAction();

  const onSubmit = methods.handleSubmit((data) => {
    if (!userId) {
      trackUserAction(
        "Поля формы не прошли валидацию, запрос на изменение информации пользователя не отправлен"
      );
      return;
    }
    const updateUserMutationArgs: UserUpdateCreateApiArg = {
      user_id: userId,
      full_name: data.name,
      phone: data.phone,
      email: data.email,
    };
    updateUser(updateUserMutationArgs);
    trackUserAction(
      "Поля формы прошли валидацию, запрос на изменение информации пользователя успешно отправлен"
    );
  });

  useEffect(() => {
    if (response) {
      setShowSuccess(true);
      dispatch(updateUserProfileData(response));
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }, [response]);

  useEffect(() => {
    if (data) {
      methods.reset({
        name: data?.user_data?.name ?? "",
        phone: data?.user_data?.phone ?? "",
        email: data?.user_data?.email ?? "",
      });
    }
  }, [data, methods]);

  return (
    <div className="container mt-20">
      <div className="mb-35">
        <FormProvider {...methods}>
          <form className="relative" onSubmit={onSubmit}>
            <h2 className={headingClassNames}>Контактная информация</h2>
            <div className="relative">
              <div
                className={clsx("flex flex-col mb-7 relative transition-all", {
                  "blur-sm": showSuccess,
                })}
              >
                <ProfileInputField
                  trackingLabel="ФИО"
                  name="name"
                  type="text"
                  placeholder="ФИО"
                />
                <ProfileInputField
                  trackingLabel="Номер телефона"
                  name="phone"
                  type="tel"
                  placeholder="Номер телефона"
                />
                <ProfileInputField
                  name="email"
                  type="email"
                  placeholder="Электронная почта"
                  trackingLabel="Электронная почта"
                />
              </div>
              <Notification
                icon={<SignIcon />}
                className="center w-full mt-20"
                isVisible={showSuccess}
                message="данные успешно сохранены"
              />
            </div>
            <Button trackingLabel="Сохранить" submit type="primary">
              Сохранить
            </Button>
          </form>
        </FormProvider>
      </div>
      {data?.requests_all && data?.requests_all.length > 0 && (
        <div>
          <h2 className={headingClassNames}>История обращений</h2>
          {data?.requests_all?.map((exchange, index) => (
            <RequestStoryItem data={exchange} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
