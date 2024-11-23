import BaseLayout from "../../layout/BaseLayout/BaseLayout"

type AdvicesProps = {
  title: string
}

const Advices = ({title}: AdvicesProps) => {
  return (
    <BaseLayout>
      <section>
        <div className="flex justify-between items-center py-8 px-6">
          <div>
            <h1 className="font-semibold text-6xl mb-1">{title}</h1>
            <p className="text-[var(--font-secondary-color)] font-bold">
              Jan 1 - Oct 29, 2024
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-6xl font-semibold">$22.5M</span>
              <span className="rounded-full border border-green-600 bg-green-200 text-green-600 text-xs px-1 py-0.5">
                +1,5%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-6xl font-semibold">$5.9M</span>
              <span className="rounded-full border border-red-600 bg-red-200 text-red-600 text-xs px-1 py-0.5">
                -2,3%
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 justify-center gap-2 px-4">
          <span className="bg-white w-full rounded-[30px] py-40 text-center">
            CHART
          </span>
          <span className="bg-white w-full rounded-[30px] py-40 text-center">
            CHART
          </span>
          <span className="bg-white w-full rounded-[30px] py-40 text-center">
            CHART
          </span>
          <span className="bg-white w-full rounded-[30px] py-40 text-center">
            CHART
          </span>
        </div>
      </section>
    </BaseLayout>
  )
}

export default Advices