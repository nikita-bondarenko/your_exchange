import { FC, memo } from "react";
import clsx from "clsx";
import { PersonIcon } from "@/shared/ui";
import { useRouter } from "next/navigation";

const ProfileButton: FC<{
  onClick?: () => void;
  avatar?: string;
  trackingLabel: string;
}> = ({ avatar, trackingLabel }) => {
  const router = useRouter();
  const handleSubmit = () => {
    router.push("/profile");
  };
  return (
    <button
      onClick={handleSubmit}  
      data-tracking-label={trackingLabel}
      className="relative w-46 h-46 bg-[var(--background-button-profile)]  rounded-full flex justify-center items-center shrink-0"
    >
      <span className="absolute  inset-0 rounded-full animation-wave border border-[var(--profile-button-wave)]  wave1"></span>
      <span className="absolute inset-0 rounded-full animation-wave border border-[var(--profile-button-wave)]   wave2"></span>
      <span className="absolute inset-0 rounded-full animation-wave border border-[var(--profile-button-wave)]  wave3"></span>
      <span className="absolute inset-0 rounded-full border border-[var(--profile-button-wave)] z-20"></span>
      <PersonIcon
        color="var(--background-profile-icon)"
        className={clsx("w-15 h-17", { "opacity-100": avatar })}
      ></PersonIcon>
      {avatar && (
        <img
          src={avatar}
          alt="User Avatar"
          className={clsx("w-full h-full absolute top-0 left-0 object-cover rounded-full", {
            "opacity-0": !avatar,
          })}
        />
      )}
    </button>
  );
};

ProfileButton.displayName = "ProfileButton";

export default ProfileButton;
