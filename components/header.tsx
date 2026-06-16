import Logo from "@/components/logo"

export interface HeaderProps {
  currencyCount: number
  dataProvider: string
  dataType: string
}

export default function Header({
  currencyCount,
  dataProvider,
  dataType,
}: HeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-360 items-center justify-between p-4 md:px-6 md:py-5">
      <Logo />
      <div className="flex gap-2 text-[10px] text-gray-400 md:text-base">
        <p>{currencyCount} CURRENCIES</p>·<p>{dataProvider}</p>·
        <p>{dataType}</p>
      </div>
    </header>
  )
}
