export function PaletteDetailsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Palette Hero */}
      <section className="space-y-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Palette Preview */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border">
              <div className="grid h-64 grid-cols-5 sm:h-80">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse bg-muted" />
                ))}
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="size-6 animate-pulse rounded-full bg-muted"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Palette Information */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            </div>

            <div className="space-y-3">
              <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            </div>

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-7 w-20 animate-pulse rounded-full bg-muted"
                />
              ))}
            </div>

            <div className="mt-auto flex items-center gap-3">
              <div className="size-9 animate-pulse rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Adjustment Controls */}
        <div className="rounded-xl border p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          </div>

          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-10 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Color Breakdown */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-52 animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
        </div>

        {/* Color Tabs */}
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-28 shrink-0 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>

        {/* Main Color & Variations */}
        <div className="grid gap-4 lg:grid-cols-[0.6fr_1.4fr]">
          <div className="overflow-hidden rounded-xl border">
            <div className="h-52 animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="grid h-16 grid-cols-8 overflow-hidden rounded-md">
                  {Array.from({ length: 8 }).map((_, colorIndex) => (
                    <div key={colorIndex} className="animate-pulse bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Harmonies */}
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="h-5 w-36 animate-pulse rounded bg-muted" />
            <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                </div>
                <div className="grid h-12 grid-flow-col auto-cols-fr overflow-hidden rounded-md">
                  {Array.from({ length: 4 }).map((_, colorIndex) => (
                    <div key={colorIndex} className="animate-pulse bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Color Vision Simulation */}
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                </div>
                <div className="grid h-24 grid-flow-col auto-cols-fr overflow-hidden rounded-md">
                  <div className="animate-pulse bg-muted" />
                  <div className="animate-pulse bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Palette Color Vision Overview */}
      <section className="space-y-5">
        <div className="space-y-2">
          <div className="h-5 w-52 animate-pulse rounded bg-muted" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-28 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>

        <div className="grid grid-cols-5 overflow-hidden rounded-lg">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse bg-muted" />
          ))}
        </div>

        {/* Potential Color Confusion */}
        <div className="space-y-4 rounded-xl border p-4">
          <div className="space-y-2">
            <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-lg bg-muted/60"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contrast Analysis */}
      <section className="space-y-5">
        <div className="space-y-2">
          <div className="h-6 w-44 animate-pulse rounded bg-muted" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
        </div>

        {/* Summary */}
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="space-y-2 rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              <div className="h-7 w-12 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-28 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>

        {/* Contrast Pair Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border/60 bg-card"
            >
              <div className="flex items-center justify-between gap-3 border-b p-4">
                <div className="space-y-2">
                  <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
              </div>

              <div className="space-y-4 p-4">
                <div className="h-28 animate-pulse rounded-lg bg-muted" />

                <div className="flex items-center justify-between gap-3">
                  <div className="h-7 w-28 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-5 animate-pulse rounded bg-muted" />
                  <div className="h-7 w-28 animate-pulse rounded-md bg-muted" />
                </div>

                <div className="h-10 animate-pulse rounded-lg bg-muted/60" />

                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, checkIndex) => (
                    <div
                      key={checkIndex}
                      className="flex items-center justify-between"
                    >
                      <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="space-y-4">
        <div className="h-7 w-48 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        </div>
      </section>

      {/* Characteristics */}
      <section className="space-y-5">
        <div className="h-7 w-56 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>
      </section>

      {/* Design Context */}
      <section className="space-y-5">
        <div className="h-7 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>
      </section>

      {/* Similar Palettes */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border">
              <div className="grid h-40 grid-cols-5">
                {Array.from({ length: 5 }).map((_, colorIndex) => (
                  <div key={colorIndex} className="animate-pulse bg-muted" />
                ))}
              </div>

              <div className="space-y-3 p-4">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-48 max-w-full animate-pulse rounded bg-muted" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, tagIndex) => (
                    <div
                      key={tagIndex}
                      className="h-5 w-14 animate-pulse rounded-full bg-muted"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
        </div>
      </section>
    </main>
  );
}
