import Header from "@/components/header"
import LiveMarkets from "@/components/liveMarkets"
import ConverterWrapper from "@/components/converterWrapper"
import DetailsTabs from "@/components/detailsTabs"

export const metadata = {
  title: "FX Currency Converter",
  description: "Convert currencies and view historical exchange rates.",
  icons: {
    icon: "/favicon.png",
  }
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header dataProvider="EOD" dataType="ECB DATA" />
      <LiveMarkets />
      <main className="mx-auto w-full max-w-275 px-4 py-8 md:px-6 md:py-12 lg:px-8">
        <div className="flex flex-col gap-8">
          <ConverterWrapper />
          <DetailsTabs />
        </div>
      </main>
    </div>
  )
}
