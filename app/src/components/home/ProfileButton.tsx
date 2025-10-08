import { FC, memo } from "react";
import Icon from "../helpers/Icon";
import clsx from "clsx";

const ProfileButton: FC<{ onClick?: () => void, avatar?: string }> = memo(({ onClick, avatar }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-46 h-46 bg-[#000000]  rounded-full flex justify-center items-center shrink-0"
    >
      <span className="absolute  inset-0 rounded-full animation-wave border border-[#262626]  wave1"></span>
      <span className="absolute inset-0 rounded-full animation-wave border border-[#262626]   wave2"></span>
      <span className="absolute inset-0 rounded-full animation-wave border border-[#262626]  wave3"></span>
      <span className="absolute inset-0 rounded-full border border-[#262626] z-20"></span>
      <Icon src="person.svg" className={clsx("w-15 h-17", {"opacity-100": avatar})}></Icon>
        <img
          src={avatar || '/images/icons/person.svg'}
          alt="user avatar"
          className={clsx(
            "w-full h-full object-cover rounded-full",{"opacity-0":!avatar}
          )}
        />
    </button>
  );
});

ProfileButton.displayName = "ProfileButton";

export default ProfileButton;
