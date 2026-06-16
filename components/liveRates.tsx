interface LiveRatesProps {
  currencyPairs: string
  exchangeRate: number
  exchangeRateChange: number
}

export default function LiveRates({
  currencyPairs,
  exchangeRate,
  exchangeRateChange,
}: LiveRatesProps) {
  return (
    <div className="flex items-center gap-2.5 border-r bg-[#171719] p-3 md:px-5 md:py-3">
      <p className="text-[10px] text-gray-400 md:text-xs">{currencyPairs}</p>
      <p className="text-[10px] md:text-xs">{exchangeRate}</p>
      <p
        className={`text-[10px] md:text-xs ${exchangeRateChange > 0.04 ? "text-green-400 before:content-['▲']" : "text-red-400 before:content-['▼']"}`}
      >
        {" "}
        {exchangeRateChange > 0.04 ? " +" : ""}
        {exchangeRateChange}%
      </p>
    </div>
  )
}
