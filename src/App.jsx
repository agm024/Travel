import { createContext, useContext, useEffect, useMemo, useState } from 'react'
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
          <Route path="/upcoming-tours" element={<UpcomingToursPage />} />
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

function SeoMeta({ title, description }) {
  useEffect(() => {
    document.title = title

    const ensureMeta = (name, attribute = 'name') => {
      let tag = document.head.querySelector(`meta[${attribute}="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, name)
        document.head.appendChild(tag)
      }
      return tag
    }

    ensureMeta('description').setAttribute('content', description)
    ensureMeta('og:title', 'property').setAttribute('content', title)
    ensureMeta('og:description', 'property').setAttribute('content', description)
  }, [description, title])

  return null
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-slate-800">
      <div className="w-full max-w-3xl space-y-4 rounded-[2rem] border border-white/70 bg-white/80 px-8 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <p className="font-semibold">Loading Your Website</p>
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-200" />
        <div className="h-44 w-full animate-pulse rounded-[1.5rem] bg-slate-200" />
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
            <NavLink to="/upcoming-tours" className={navClass}>
              Upcoming tours
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
  const popularDestinations = useMemo(
    () =>
      Array.from(new Map(siteContent.packages.map((travelPackage) => [travelPackage.country, travelPackage])).values()).slice(0, 8),
    [siteContent.packages],
  )

  const destinationValue = destination || siteContent.destinations[0] || ''
  const monthValue = month || siteContent.months[0] || ''

  const handleSearch = (event) => {
    event.preventDefault()
    navigate(buildPackagesPath(destinationValue, monthValue))
  }

  return (
    <div className={`${shellClass} space-y-10`}>
      <SeoMeta
        title="Fly With Ranjita | Premium Travel Tours"
        description="Discover upcoming tours, curated packages, and premium destination planning with Fly With Ranjita."
      />

      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-white/30 bg-slate-950">
        {siteContent.heroVideo ? (
          <video
            className="h-[27rem] w-full object-cover sm:h-[34rem] lg:h-[38rem]"
            src={siteContent.heroVideo}
            poster={siteContent.heroImage}
            aria-label="Hero background video showing travel destinations"
            title="Hero travel video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img src={siteContent.heroImage} alt="Travel highlights" className="h-[27rem] w-full object-cover sm:h-[34rem] lg:h-[38rem]" loading="eager" fetchPriority="high" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/55 to-slate-900/15" />
        <div className={`${shellClass} absolute inset-0 flex items-center`}>
          <div className="max-w-3xl space-y-5 text-white">
            <p className="inline-flex rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] backdrop-blur-xl">
              {siteContent.heroTagline}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Fly With Ranjita</h1>
            <p className="text-base leading-7 text-slate-100 sm:text-lg">{siteContent.heroDescription}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/upcoming-tours"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5"
              >
                Upcoming Tours
              </Link>
              <Link
                to="/packages"
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
              >
                Explore Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="search-title"
        className="rounded-[2rem] border border-white/70 bg-white/45 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">
              Smart search
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
             Filter by destination and month for upcoming tours.
          </p>
        </div>
        <form className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr_auto]" onSubmit={handleSearch}>
          <SelectField
            id="destination"
            label="Destination"
            value={destinationValue}
            options={siteContent.destinations}
            onChange={setDestination}
          />
          <SelectField
            id="month"
            label="Travel month"
            value={monthValue}
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

      <PopularDestinationsCarousel destinations={popularDestinations} />

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

function PopularDestinationsCarousel({ destinations }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!destinations.length) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % destinations.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [destinations.length])

  if (!destinations.length) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">Popular destinations</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Trending places people are booking now</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex - 1 + destinations.length) % destinations.length)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            aria-label="Previous destination"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex + 1) % destinations.length)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            aria-label="Next destination"
          >
            →
          </button>
        </div>
      </div>
      <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
          <img
            src={destinations[activeIndex].image}
            alt={`${destinations[activeIndex].title} in ${destinations[activeIndex].country}`}
            className="h-72 w-full object-cover md:h-full"
            loading="lazy"
          />
          <div className="space-y-3 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              {destinations[activeIndex].country}
            </p>
            <h3 className="text-3xl font-semibold tracking-tight text-slate-950">{destinations[activeIndex].title}</h3>
            <p className="text-sm leading-7 text-slate-600">{destinations[activeIndex].description}</p>
            <p className="text-sm text-slate-500">
              Best month: {destinations[activeIndex].month} · {destinations[activeIndex].duration}
            </p>
            <Link
              to={`/packages/${destinations[activeIndex].slug}`}
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              View destination
            </Link>
          </div>
        </div>
      </article>
    </section>
  )
}

function UpcomingToursPage() {
  const siteContent = useSiteContent()

  return (
    <div className={`${shellClass} space-y-8`}>
      <SeoMeta
        title="Upcoming Tours | Fly With Ranjita"
        description="Browse all upcoming tours and seasonal packages from Fly With Ranjita."
      />
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">Upcoming Tours</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Plan your next departure</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Explore all upcoming tours and package options in one place, then open each package for full details.
        </p>
      </section>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {siteContent.packages.map((travelPackage) => (
          <PackageCard key={travelPackage.slug} travelPackage={travelPackage} />
        ))}
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
      <SeoMeta
        title="Tour Packages | Fly With Ranjita"
        description="Filter premium tour packages by destination and month and find your ideal trip."
      />
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
  const [activeTab, setActiveTab] = useState('overview')
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const gallery = travelPackage?.gallery ?? []
  const currentGalleryIndex = gallery.length ? activeGalleryIndex % gallery.length : 0

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
      <SeoMeta
        title={`${travelPackage.title} | Fly With Ranjita`}
        description={`Explore itinerary, pricing, and gallery for ${travelPackage.title} in ${travelPackage.country}.`}
      />
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <img
            src={travelPackage.image}
            alt={travelPackage.title}
            className="h-full min-h-[20rem] w-full object-cover"
            loading="eager"
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
          <div className="flex flex-wrap gap-3">
            {['overview', 'costing'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">Highlights</p>
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
            </div>
          ) : (
            <div className="space-y-4 rounded-3xl bg-slate-50 p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Costing</h2>
              <p className="text-sm leading-7 text-slate-600">
                Starting from <strong className="text-slate-900">{travelPackage.price}</strong>. Final costing depends on departure date, room occupancy, and optional activities.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Curated stays and core transfers are included in base pricing.</li>
                <li>• Taxes/fees and add-on experiences are shared in the final proposal.</li>
                <li>• Group departures can be customized with special rates on request.</li>
              </ul>
            </div>
          )}
          {gallery.length ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-800">Gallery</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveGalleryIndex((currentGalleryIndex - 1 + gallery.length) % gallery.length)
                    }
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGalleryIndex((currentGalleryIndex + 1) % gallery.length)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700"
                    aria-label="Next image"
                  >
                    →
                  </button>
                </div>
              </div>
              <img
                src={gallery[currentGalleryIndex]}
                alt={`${travelPackage.title} package gallery image ${currentGalleryIndex + 1}`}
                className="h-72 w-full rounded-3xl object-cover"
                loading="lazy"
              />
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveGalleryIndex(index)}
                    className={`overflow-hidden rounded-2xl border ${currentGalleryIndex === index ? 'border-cyan-500' : 'border-transparent'}`}
                  >
                    <img
                      src={image}
                      alt={`${travelPackage.title} thumbnail ${index + 1}`}
                      className="h-20 w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
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
          <InquiryForm
            defaultMessage={`I’m interested in the ${travelPackage.title} package.`}
            buttonText="Submit inquiry"
            travelPackageTitle={travelPackage.title}
            sourcePage={`/packages/${travelPackage.slug}`}
          />
        </aside>
      </section>
    </div>
  )
}

function ContactPage() {
  const siteContent = useSiteContent()

  return (
    <div className={`${shellClass} grid gap-6 lg:grid-cols-[0.95fr_1.05fr]`}>
      <SeoMeta
        title="Travel Inquiry | Fly With Ranjita"
        description="Send your travel inquiry with package details and guest counts to Fly With Ranjita."
      />
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
        <InquiryForm buttonText="Send inquiry" sourcePage="/contact" />
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
        loading="lazy"
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

function InquiryForm({ buttonText, defaultMessage = '', travelPackageTitle = '', sourcePage = '' }) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      numberOfGuests: Number(formData.get('numberOfGuests') ?? 0),
      numberOfChildren: Number(formData.get('numberOfChildren') ?? 0),
      message: String(formData.get('message') ?? '').trim(),
      travelPackage: travelPackageTitle,
      sourcePage,
    }

    try {
      const response = await fetch('/.netlify/functions/contact-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setSubmitted(true)
      form.reset()

      const messageField = form.elements.namedItem('message')
      if (messageField instanceof HTMLTextAreaElement) {
        messageField.value = defaultMessage
      }
    } catch (error) {
      console.error('Unable to submit inquiry', error)
      setSubmitError('We could not submit the form right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit}
      onInput={() => {
        setSubmitted(false)
        setSubmitError('')
      }}
    >
      <FormField id="name" label="Name" type="text" autoComplete="name" required />
      <FormField id="email" label="Email" type="email" autoComplete="email" required />
      <FormField id="phone" label="Phone" type="tel" autoComplete="tel" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="numberOfGuests" label="Number of Guests" type="number" min="1" defaultValue="1" required />
        <FormField id="numberOfChildren" label="Number of Children" type="number" min="0" defaultValue="0" required />
      </div>
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
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-300/35 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting…' : buttonText}
      </button>
      {submitted ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              ✓
            </span>
            <div>
              <p className="font-semibold">Form submitted</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Our team will contact you in 24 hrs.
              </p>
            </div>
          </div>
        </div>
      ) : submitError ? (
        <p className="text-sm text-rose-600">{submitError}</p>
      ) : (
        <p className="text-sm text-slate-500">We usually respond within one business day.</p>
      )}
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
