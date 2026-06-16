import Header from "@/components/header"
import LiveMarkets from "@/components/liveMarkets"

const liveMarketsData = [
  { id: 1, pair: "USD/JPY", rate: 157.91, change: +0.024 },
  { id: 2, pair: "EUR/USD", rate: 1.12, change: -0.022 },
  { id: 3, pair: "GBP/USD", rate: 1.31, change: +0.052 },
  { id: 4, pair: "AUD/USD", rate: 0.74, change: -0.035 },
  { id: 5, pair: "USD/CAD", rate: 1.25, change: +0.07 },
  { id: 6, pair: "USD/CHF", rate: 0.91, change: -0.01 },
  { id: 7, pair: "NZD/USD", rate: 0.7, change: +0.078 },
  { id: 8, pair: "USD/SEK", rate: 8.5, change: -0.034 },
  { id: 9, pair: "USD/NOK", rate: 8.9, change: +0.0534 },
  { id: 10, pair: "USD/DKK", rate: 6.3, change: -0.024 },
]
export default function Page() {
  return (
    <div className="">
      <Header currencyCount={55} dataProvider="EOD" dataType="ECB DATA" />
      <LiveMarkets items={liveMarketsData} />
    </div>
  )
}
