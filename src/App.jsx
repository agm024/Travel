import { createContext, useContext, useEffect, useState } from 'react'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { fetchTravelContent } from './lib/sanity'

const shellClass = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'
const SiteContentContext = createContext(null)

const buildPackagesPath = (destination, month) => {
  const params = new URLSearchParams()

  if (destination) {
    params.set('destination', destination)
  }

  if (month) {
    params.set('month', month)
  }

  const query = params.toString()
  return query ? `/packages?${query}` : '/packages'
}

function App() {
  const [siteContent, setSiteContent] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true

    fetchTravelContent()
      .then((nextContent) => {
        if (!active) {
          return
        }

        setSiteContent(nextContent)
        setStatus('ready')
      })
      .catch((error) => {
        if (!active) {
          return
        }

        console.error('Failed to load Sanity content', error)
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (status === 'error' || !siteContent) {
    return <ErrorScreen />
  }

  return (
    <SiteContentContext.Provider value={siteContent}>
      <AppShell />
    </SiteContentContext.Provider>
  )
}

function AppShell() {
  const siteContent = useSiteContent()

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.22),transparent_26%),linear-gradient(180deg,#f8fbff_0%,#eef7ff_46%,#fffdf7_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-24 -z-10 mx-auto h-[26rem] w-[26rem] rounded-full bg-cyan-200/40 blur-3xl"
      />
      <ScrollManager />
      <Header />
      <main className="pb-24 pt-10 sm:pt-14">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:slug" element={<PackageDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      <a
        href={siteContent.contact.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Travel Luxe on WhatsApp"
        className="fixed bottom-5 right-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white shadow-[0_18px_40px_rgba(16,185,129,0.35)] transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
      >
        💬
      </a>
    </div>
  )
}

function useSiteContent() {
  const context = useContext(SiteContentContext)

  if (!context) {
    throw new Error('useSiteContent must be used within SiteContentContext')
  }

  return context
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-slate-800">
      <div className="rounded-[2rem] border border-white/70 bg-white/80 px-8 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        Loading Sanity content...
      </div>
    </div>
  )
}

function ErrorScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-slate-800">
      <div className="max-w-xl rounded-[2rem] border border-rose-200 bg-white/90 px-8 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <h1 className="text-2xl font-semibold text-slate-950">Sanity content could not load</h1>
        <p className="mt-3 leading-7 text-slate-600">
          Check that your Sanity environment variables are set in a <code>.env</code> file and that the project has published documents.
        </p>
      </div>
    </div>
  )
}

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash)

      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location])

  return null
}

function Header() {
  const siteContent = useSiteContent()
  const navClass = ({ isActive }) =>
    [
      'rounded-full px-4 py-2 text-sm font-medium transition',
      isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:bg-white hover:text-slate-900',
    ].join(' ')

  return (
    <header className="sticky top-0 z-30">
      <div className={`${shellClass} pt-4`}>
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/70 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-fuchsia-400 text-lg font-semibold text-white shadow-lg shadow-cyan-200/70">
              TL
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight text-slate-900">
                {siteContent.brand}
              </span>
              <span className="block text-sm text-slate-500">Bright escapes, curated smoothly.</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <Link to="/#about" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900">
              About
            </Link>
            <NavLink to="/packages" className={navClass}>
              Packages
            </NavLink>
            <Link to="/#reviews" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900">
              Reviews
            </Link>
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

function HomePage() {
  const siteContent = useSiteContent()
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [month, setMonth] = useState('')

  useEffect(() => {
    setDestination(siteContent.destinations[0] ?? '')
    setMonth(siteContent.months[0] ?? '')
  }, [siteContent.destinations, siteContent.months])

  const handleSearch = (event) => {
    event.preventDefault()
    navigate(buildPackagesPath(destination, month))
  }

  return (
    <div className={`${shellClass} space-y-10`}>
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
            {siteContent.heroTagline}
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {siteContent.heroHeadline}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700">
              {siteContent.heroDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/packages"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5"
            >
              Browse packages
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-slate-200 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
            >
              Talk to an advisor
            </Link>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3">
            {siteContent.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
              >
                <dt className="text-sm text-slate-600">{stat.label}</dt>
                <dd className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="absolute -left-6 top-12 h-24 w-24 rounded-full bg-fuchsia-200/70 blur-2xl" />
          <div className="absolute -right-8 bottom-16 h-28 w-28 rounded-full bg-cyan-200/80 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.1)] backdrop-blur-xl">
            <img
              src={siteContent.heroImage}
              alt="Elegant tropical waterfront resort"
              className="h-[24rem] w-full rounded-[1.6rem] object-cover"
            />
            <div className="absolute inset-x-9 bottom-9 rounded-[1.6rem] border border-white/60 bg-white/65 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.1)] backdrop-blur-2xl">
              <p className="text-sm font-semibold text-cyan-800">Concierge-led planning</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Flexible itineraries, handpicked stays, and end-to-end support in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="search-title"
        className="rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">
              Glassmorphism search
            </p>
            <div>
              <h2 id="search-title" className="text-3xl font-semibold tracking-tight text-slate-950">
                Search your next holiday
              </h2>
              <p className="mt-2 text-slate-700">
                Pick a destination and season to see the trips that match your pace.
              </p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            Clear inputs, bright contrast, and keyboard-friendly controls keep the experience smooth
            and accessible.
          </p>
        </div>
        <form className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr_auto]" onSubmit={handleSearch}>
          <SelectField
            id="destination"
            label="Destination"
            value={destination}
            options={siteContent.destinations}
            onChange={setDestination}
          />
          <SelectField
            id="month"
            label="Travel month"
            value={month}
            options={siteContent.months}
            onChange={setMonth}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-300/40 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500"
          >
            Explore packages
          </button>
        </form>
      </section>

      <section id="about" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-700">
              About us
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              A travel partner focused on elegant planning and calm execution.
            </h2>
          </div>
          <p className="max-w-xl text-slate-700">{siteContent.about.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {siteContent.about.points.map((point) => (
            <article
              key={point.title}
              className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg text-white">
                {point.icon}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">{point.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Featured journeys
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Trending packages with bright, refined stays
            </h2>
          </div>
          <Link to="/packages" className="text-sm font-semibold text-slate-800 transition hover:text-cyan-800">
            View all packages →
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {siteContent.packages.slice(0, 3).map((travelPackage) => (
            <PackageCard key={travelPackage.slug} travelPackage={travelPackage} />
          ))}
        </div>
      </section>

      <section id="reviews" className="space-y-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-700">
            Guest reviews
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Fake testimonials for the concept, styled like glowing word-of-mouth.
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {siteContent.reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-[2rem] border border-white/70 bg-white/78 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
            >
              <p className="text-sm font-semibold text-amber-600">{'★'.repeat(review.rating)}</p>
              <p className="mt-4 text-sm leading-7 text-slate-700">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-6">
                <p className="font-semibold text-slate-950">{review.name}</p>
                <p className="text-sm text-slate-600">{review.trip}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-[0_22px_65px_rgba(15,23,42,0.18)] sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Smooth support
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Need a custom route, honeymoon plan, or premium group departure?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              We shape every journey around pace, preferences, and practical details so your trip
              feels elevated from the first call.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              Start planning
            </Link>
            <a
              href={siteContent.contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function PackagesPage() {
  const siteContent = useSiteContent()
  const [searchParams, setSearchParams] = useSearchParams()
  const destination = searchParams.get('destination') ?? ''
  const month = searchParams.get('month') ?? ''

  const filteredPackages = siteContent.packages.filter((travelPackage) => {
    const matchesDestination = !destination || travelPackage.country === destination
    const matchesMonth = !month || travelPackage.month === month
    return matchesDestination && matchesMonth
  })

  const updateFilters = (nextDestination, nextMonth) => {
    setSearchParams(
      nextDestination || nextMonth
        ? {
            ...(nextDestination ? { destination: nextDestination } : {}),
            ...(nextMonth ? { month: nextMonth } : {}),
          }
        : {},
    )
  }

  return (
    <div className={`${shellClass} space-y-8`}>
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">
            Curated collection
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">All travel packages</h1>
          <p className="mt-3 text-slate-700">
            Browse every destination with simple filters and quick detail access.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip label={destination ? `Destination: ${destination}` : 'All destinations'} />
          <FilterChip label={month ? `Month: ${month}` : 'All months'} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto]">
          <SelectField
            id="packages-destination"
            label="Destination"
            value={destination}
            options={siteContent.destinations}
            placeholder="All destinations"
            onChange={(value) => updateFilters(value, month)}
          />
          <SelectField
            id="packages-month"
            label="Travel month"
            value={month}
            options={siteContent.months}
            placeholder="All months"
            onChange={(value) => updateFilters(destination, value)}
          />
          <button
            type="button"
            onClick={() => updateFilters(destination, month)}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Refresh list
          </button>
          <button
            type="button"
            onClick={() => updateFilters('', '')}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Clear filters
          </button>
        </div>
      </section>

      {filteredPackages.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredPackages.map((travelPackage) => (
            <PackageCard key={travelPackage.slug} travelPackage={travelPackage} />
          ))}
        </section>
      ) : (
        <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <h2 className="text-2xl font-semibold text-slate-900">No package found</h2>
          <p className="mt-3 text-slate-600">
            Try another destination or month combination to reveal more journeys.
          </p>
          <button
            type="button"
            onClick={() => updateFilters('', '')}
            className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Show all packages
          </button>
        </section>
      )}
    </div>
  )
}

function PackageDetailsPage() {
  const siteContent = useSiteContent()
  const { slug } = useParams()
  const travelPackage = siteContent.packages.find((item) => item.slug === slug)

  if (!travelPackage) {
    return (
      <div className={`${shellClass}`}>
        <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Package not found</h1>
          <p className="mt-4 text-slate-600">Please return to the packages page and choose another itinerary.</p>
          <Link
            to="/packages"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Back to packages
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className={`${shellClass} space-y-8`}>
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <img
            src={travelPackage.image}
            alt={travelPackage.title}
            className="h-full min-h-[20rem] w-full object-cover"
          />
          <div className="space-y-5 p-8">
            <span className="inline-flex rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              {travelPackage.country} · {travelPackage.month}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{travelPackage.title}</h1>
            <p className="text-lg leading-8 text-slate-600">{travelPackage.description}</p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <dt className="text-sm text-slate-500">Duration</dt>
                <dd className="mt-2 text-lg font-semibold text-slate-900">{travelPackage.duration}</dd>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <dt className="text-sm text-slate-500">Starting price</dt>
                <dd className="mt-2 text-lg font-semibold text-slate-900">{travelPackage.price}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-6 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">
              Highlights
            </p>
            <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
              {travelPackage.highlights.map((highlight) => (
                <li key={highlight} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">Itinerary</p>
            <ol className="mt-4 grid gap-3">
              {travelPackage.itinerary.map((stop, index) => (
                <li key={stop} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
                  <span className="mr-2 font-semibold text-slate-900">Day {index + 1}</span>
                  {stop}
                </li>
              ))}
            </ol>
          </div>
        </article>

        <aside className="space-y-6 rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">
              Inquire &amp; book
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Reserve your spot with a travel advisor
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Tell us your travel window, room preference, or special request and we&apos;ll shape the
              trip around it.
            </p>
          </div>
          <InquiryForm defaultMessage={`I’m interested in the ${travelPackage.title} package.`} buttonText="Submit inquiry" />
        </aside>
      </section>
    </div>
  )
}

function ContactPage() {
  const siteContent = useSiteContent()

  return (
    <div className={`${shellClass} grid gap-6 lg:grid-cols-[0.95fr_1.05fr]`}>
      <section className="space-y-6 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">Contact us</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Let&apos;s build your next escape together
          </h1>
          <p className="mt-3 text-slate-700">{siteContent.contact.intro}</p>
        </div>
        <div className="grid gap-4">
          <ContactCard label="Phone" value={siteContent.contact.phone} href={`tel:${siteContent.contact.phone}`} />
          <ContactCard label="Email" value={siteContent.contact.email} href={`mailto:${siteContent.contact.email}`} />
          <ContactCard label="Address" value={siteContent.contact.address} />
          <ContactCard label="Hours" value={siteContent.contact.hours} />
        </div>
        <div className="rounded-[1.75rem] bg-slate-900 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">Why travelers choose us</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
            {siteContent.contact.promises.map((promise) => (
              <li key={promise}>• {promise}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-700">Plan with us</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Share your idea and we&apos;ll map the next step
          </h2>
        </div>
        <InquiryForm buttonText="Send inquiry" />
      </section>
    </div>
  )
}

function PackageCard({ travelPackage }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.1)]">
      <img
        src={travelPackage.image}
        alt={travelPackage.title}
        className="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full bg-cyan-50 px-3 py-1 font-medium text-cyan-700">
            {travelPackage.country}
          </span>
          <span>{travelPackage.month}</span>
          <span>•</span>
          <span>{travelPackage.duration}</span>
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            {travelPackage.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{travelPackage.description}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Starting from</p>
            <p className="text-lg font-semibold text-slate-900">{travelPackage.price}</p>
          </div>
          <Link
            to={`/packages/${travelPackage.slug}`}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  )
}

function SelectField({ id, label, onChange, options, placeholder, value }) {
  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-medium text-slate-600">
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/70 bg-white/85 px-4 py-4 text-base font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function FilterChip({ label }) {
  return (
    <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
      {label}
    </span>
  )
}

function InquiryForm({ buttonText, defaultMessage = '' }) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    const form = event.currentTarget
    form.reset()

    const messageField = form.elements.namedItem('message')
    if (messageField instanceof HTMLTextAreaElement) {
      messageField.value = defaultMessage
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} onInput={() => setSubmitted(false)}>
      <FormField id="name" label="Name" type="text" autoComplete="name" required />
      <FormField id="email" label="Email" type="email" autoComplete="email" required />
      <FormField id="phone" label="Phone" type="tel" autoComplete="tel" required />
      <FormField
        id="message"
        label="Message"
        type="textarea"
        name="message"
        defaultValue={defaultMessage}
        required
      />
      <button
        type="submit"
        className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-300/35 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500"
      >
        {buttonText}
      </button>
      <p className={`text-sm ${submitted ? 'text-emerald-600' : 'text-slate-500'}`}>
        {submitted
          ? 'Thanks! A Travel Luxe advisor will reach out shortly.'
          : 'We usually respond within one business day.'}
      </p>
    </form>
  )
}

function FormField({ defaultValue, id, label, name, type, ...rest }) {
  const baseClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100'

  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-medium text-slate-600">
      {label}
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name ?? id}
          rows="5"
          defaultValue={defaultValue}
          className={baseClass}
          {...rest}
        />
      ) : (
        <input
          id={id}
          name={name ?? id}
          type={type}
          defaultValue={defaultValue}
          className={baseClass}
          {...rest}
        />
      )}
    </label>
  )
}

function ContactCard({ href, label, value }) {
  const content = href ? (
    <a href={href} className="mt-2 block text-base font-semibold text-slate-950 transition hover:text-cyan-800">
      {value}
    </a>
  ) : (
    <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
  )

  return (
    <article className="rounded-[1.75rem] bg-slate-50 p-5">
      <p className="text-sm text-slate-600">{label}</p>
      {content}
    </article>
  )
}

function Footer() {
  const siteContent = useSiteContent()

  return (
    <footer className="border-t border-white/60 bg-white/50 backdrop-blur-xl">
      <div className={`${shellClass} flex flex-col gap-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <p className="font-semibold text-slate-900">{siteContent.brand}</p>
          <p className="mt-1">Minimal, elegant travel planning with bright contemporary design.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/" className="transition hover:text-slate-900">
            Home
          </Link>
          <Link to="/packages" className="transition hover:text-slate-900">
            Packages
          </Link>
          <Link to="/contact" className="transition hover:text-slate-900">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default App
