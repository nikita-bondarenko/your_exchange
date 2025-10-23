import { InputWrapper } from "@/shared/ui";
import {SectionHeading} from "@/shared/ui/exchange/SectionHeading";
import { BaseTextarea } from "@/shared/ui";
import { memo, useState } from "react";

export const TaskDescriptionInput = memo(() => {
  const [text, setText] = useState("");
  return (
    <div className="w-full">
      <SectionHeading title="Описание задачи"></SectionHeading>
      <InputWrapper>
        <BaseTextarea
          placeholder="Описание задачи в свободной форме, минимум 10 символов"
          value={text}
          setValue={setText}
          className="text-16 leading-[148%]"
        ></BaseTextarea>
      </InputWrapper>
    </div>
  );
});

TaskDescriptionInput.displayName = "TaskDescriptionInput";
