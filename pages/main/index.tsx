import Link from 'next/link'
export default function Main() {
  return (
    <>
      <main className="py-20 px-12 text-center flex flex-col items-center gap-20px">
        <h2 className="text-3xl font-bold text-green-900"> pofffffsts</h2>

        <Link href="/" className="flex items-center btn">
          <div className="i-carbon-arrow-left" />
          Homed
        </Link>
      </main>
    </>
  )
}
