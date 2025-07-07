import clsx from 'clsx'
import React, { CSSProperties } from 'react'
export type IconProps = {
    src: string,
    className: string,
    server?: boolean
}

export default function Icon({src, className, server}:IconProps) {
  return (
    <span style={{ backgroundImage: server ? `url(${src})` : `url(/images/icons/${src})`} as CSSProperties} className={clsx('block bg-no-repeat bg-contain ', className, {
      "-rotate-[13.88deg]": src === 'btc.svg'
    })}></span>
  )
}
