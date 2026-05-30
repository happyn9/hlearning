export default function TuitionSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_2fr_2.4fr] gap-6 animate-pulse">

      {/* LEFT CARDS */}
      <div className="col-span-2 space-y-6">

        {[1,2,3,4].map((i)=>(
          <div
            key={i}
            className="bg-white rounded-2xl p-8 flex justify-between"
          >
            <div className="space-y-4 w-full">

              <div className="h-6 bg-gray-200 rounded w-40"></div>

              <div className="h-4 bg-gray-200 rounded w-3/4"></div>

              <div className="flex gap-3">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>

              <div className="h-5 w-24 bg-gray-200 rounded"></div>

            </div>

            <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>

          </div>
        ))}

      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6">

        <div className="bg-gray-200 rounded-2xl h-44"></div>

        <div className="bg-gray-200 rounded-2xl h-28"></div>

        <div className="bg-gray-200 rounded-2xl h-36"></div>

      </div>

    </div>
  );
}