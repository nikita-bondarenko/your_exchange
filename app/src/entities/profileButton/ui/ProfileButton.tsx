import { FC, memo } from "react";
import clsx from "clsx";
import Link from "next/link";
import { PersonIcon } from "@/shared/ui";

const ProfileButton: FC<{ onClick?: () => void, avatar?: string }> = memo(({avatar }) => {
  console.log(avatar)
  return (
    <Link
      href="/profile"
      className="relative w-46 h-46 bg-[var(--background-button-profile)]  rounded-full flex justify-center items-center shrink-0"
    >
      <span className="absolute  inset-0 rounded-full animation-wave border border-[var(--profile-button-wave)]  wave1"></span>
      <span className="absolute inset-0 rounded-full animation-wave border border-[var(--profile-button-wave)]   wave2"></span>
      <span className="absolute inset-0 rounded-full animation-wave border border-[var(--profile-button-wave)]  wave3"></span>
      <span className="absolute inset-0 rounded-full border border-[var(--profile-button-wave)] z-20"></span>
      <PersonIcon color="var(--background-profile-icon)" className={clsx("w-15 h-17", {"opacity-100": avatar})}></PersonIcon>
     {avatar &&   <img
          src={avatar}
          alt="User Avatar"
          className={clsx(
            "w-full h-full object-cover rounded-full",{"opacity-0":!avatar}
          )}
        />}
    </Link>
  );
});

ProfileButton.displayName = "ProfileButton";

export default ProfileButton;
