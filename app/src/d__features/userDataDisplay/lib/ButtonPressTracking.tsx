import { useAppSelector } from "@/shared/model/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useTrackUserAction } from ".";

export const ButtonPressTracking = () => {
  const pathname = usePathname();
  const sessionId = useAppSelector((state) => state.user.sessionId);

  const { trackPushButton } = useTrackUserAction();

  const handleButtonPress = (element: Element) => {
    const button = element as HTMLButtonElement | HTMLAnchorElement;
    const label = button.dataset.trackingLabel;
    console.log(button, label);
    if (label) {
      trackPushButton(label);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    setTimeout(() => {
      const allButtons = document.querySelectorAll("a, button");

      allButtons.forEach((button) =>
        button?.addEventListener("click", (e) => handleButtonPress(button))
      );

      //   allButtons.forEach((button) =>
      //     console.log(button,(button as HTMLButtonElement).dataset.trackingLabel)
      //   );
      //   console.log(allButtons);
    }, 500);
  }, [pathname, sessionId]);
  return <></>;
};
