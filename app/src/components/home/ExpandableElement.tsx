"use client"
import clsx from 'clsx';
import React, { ReactNode, useEffect, useRef, useState } from 'react'

type Props = {

    triggerRender: (props: {onClick: () => void, isOpen: boolean}) => ReactNode
    children: ReactNode
}

export default function ExpandableElement({triggerRender, children}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [listHeight, setListHeight] = useState(0);
  
    const openList = () => {
      if (ref.current) {
        setListHeight(ref.current.clientHeight);
      }
    };
  
    const closeList = () => {
      setListHeight(0);
    };
  
    useEffect(() => {
      if (isOpen) {
        openList();
      } else {
        closeList();
      }
    }, [isOpen]);
  return (
    <div className="overflow-hidden rounded-8">
        {triggerRender({isOpen, onClick:() => setIsOpen((prev) => !prev)})}
    <div
      className={clsx(
        "transition-all duration-500  relative overflow-hidden",
        { "border-top": isOpen }
      )}
      style={{ height: listHeight }}
    >
      <div className="absolute w-full bottom-0 left-0" ref={ref}>
        {children}
      </div>
    </div>
  </div>
  )
}