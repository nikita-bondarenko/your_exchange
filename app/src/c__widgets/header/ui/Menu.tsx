import { useClickOutside } from "@/shared/lib/browser";
import { clsx } from "clsx";
import { memo, useRef, useState } from "react";
import BurgerIcon from "./BurgerIcon";
import { useMenuButtons } from "../lib/useMenuButtons";
import React from "react";

type Props = {};

const MenuDivider = () => (
  <div className="border-b border-[var(--divider-secondary)]"></div>
);
export const Menu = memo(({}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setIsMenuOpen((v) => !v);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useClickOutside<HTMLDivElement, HTMLButtonElement>(
    menuRef,
    menuButtonRef,
    () => setIsMenuOpen(false)
  );

  const { menuButtons } = useMenuButtons({ closeMenu });

  // console.log(menuButtons)

  return (
    <div className="flex justify-end relative">
      <button
        onClick={handleMenuToggle}
        ref={menuButtonRef}
        className="flex items-center justify-center"
      >
        <BurgerIcon
          className="scale-80"
          fill={"var(--text-main)"}
          isCrossShape={isMenuOpen}
        ></BurgerIcon>
      </button>

      <div
        ref={menuRef}
        className={clsx(
          "absolute right-0 top-[120%] z-50 min-w-180 bg-[var(--background-secondary)] rounded-10 shadow-lg border border-[var(--border-main)]  flex flex-col animate-fade-in rounded-6 text-[var(--text-main)] transition-opacity duration-500",
          { "opacity-0 pointer-events-none": !isMenuOpen }
        )}
      >
        {menuButtons.map((button, index) => (
          <React.Fragment key={index}>
            <button
              className={clsx(
                "flex items-center gap-8 px-11 py-13  rounded-6",
                button.className
              )}
              onClick={button.onClick}
            >
              {button.icon}
              <span className="text-13 leading-normal text-left">
                {button.text}
              </span>
            </button>
            {index !== menuButtons.length - 1 && <MenuDivider />}
          </React.Fragment>
        ))}
        {/* <button
          className="flex items-center gap-8 px-11 py-13  rounded-6"
          onClick={supportButtonHandler}
        >
          <SupportIcon />
          <span className="text-13 leading-normal">Задать вопрос</span>
        </button>
        <MenuDivider></MenuDivider>
        <button
          className="flex items-center gap-6 px-11 py-13  rounded"
          onClick={reloadButtonHandler}
        >
          <ReloadIcon />
          <span className="text-13 leading-normal">Обновить страницу</span>
        </button> */}
      </div>
    </div>
  );
});
