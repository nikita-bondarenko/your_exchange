"use client"
import dynamic from 'next/dynamic';

const ExchangeResultPage = dynamic(() => import('@/b__pages/exchangeResult/ui').then(mod => mod.default), { ssr: false });

export default function ExchangeResult() {
  return <ExchangeResultPage></ExchangeResultPage>
}