import { getPackageBySlug, getSiteContent } from "/js/content-service.js";

const page = window.location.pathname.split("/").pop() || "index.html";
const params = new URLSearchParams(window.location.search);

const escapeHTML = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const packageCardTemplate = (pkg) => `
  <article class="package-card section-fade">
    <img src="${escapeHTML(pkg.image)}" alt="${escapeHTML(pkg.title)}" loading="lazy" />
    <div class="card-body">
      <h3>${escapeHTML(pkg.title)}</h3>
      <p class="meta">${escapeHTML(pkg.country)} • ${escapeHTML(pkg.month)} • ${escapeHTML(pkg.duration)}</p>
      <p>${escapeHTML(pkg.description)}</p>
      <p class="price">Starting from ${escapeHTML(pkg.price)}</p>
      <a class="btn-primary" href="/package-details.html?slug=${encodeURIComponent(pkg.slug)}">View Details</a>
    </div>
  </article>
`;

const bindInquiryForms = () => {
  document.querySelectorAll(".inquiry-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Thank you! Our travel advisor will contact you shortly.");
      form.reset();
    });
  });
};

const renderHome = async () => {
  const content = await getSiteContent();
  const destinationSelect = document.querySelector("#destination");
  const monthSelect = document.querySelector("#month");
  const trendingList = document.querySelector("#trending-list");

  destinationSelect.innerHTML = content.destinations
    .map((destination) => `<option value="${escapeHTML(destination)}">${escapeHTML(destination)}</option>`)
    .join("");

  monthSelect.innerHTML = content.months
    .map((month) => `<option value="${escapeHTML(month)}">${escapeHTML(month)}</option>`)
    .join("");

  trendingList.innerHTML = content.packages.slice(0, 3).map(packageCardTemplate).join("");

  document.querySelector("#explore-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const destination = encodeURIComponent(destinationSelect.value);
    const month = encodeURIComponent(monthSelect.value);
    window.location.href = `/packages.html?destination=${destination}&month=${month}`;
  });
};

const renderPackages = async () => {
  const content = await getSiteContent();
  const destination = params.get("destination");
  const month = params.get("month");
  const activeFilters = document.querySelector("#active-filters");

  const filtered = content.packages.filter((pkg) => {
    const destinationMatch = !destination || pkg.country === destination;
    const monthMatch = !month || pkg.month === month;
    return destinationMatch && monthMatch;
  });

  activeFilters.innerHTML = [destination && `Destination: ${destination}`, month && `Month: ${month}`]
    .filter(Boolean)
    .map((item) => `<span class="chip">${escapeHTML(item)}</span>`)
    .join("") || '<span class="chip">Showing all packages</span>';

  const list = document.querySelector("#packages-list");
  list.innerHTML = filtered.length
    ? filtered.map(packageCardTemplate).join("")
    : '<div class="panel"><h2>No package found</h2><p>Try another destination or month combination.</p></div>';
};

const renderPackageDetails = async () => {
  const slug = params.get("slug");
  const packageData = slug ? await getPackageBySlug(slug) : null;
  const root = document.querySelector("#package-content");

  if (!packageData) {
    root.innerHTML = '<section class="panel"><h1>Package not found</h1><p>Please return to packages and select another plan.</p></section>';
    return;
  }

  root.innerHTML = `
    <section class="package-detail">
      <div class="package-hero">
        <img src="${escapeHTML(packageData.image)}" alt="${escapeHTML(packageData.title)}" />
        <h1>${escapeHTML(packageData.title)}</h1>
      </div>
      <div class="package-content">
        <section>
          <p class="meta">${escapeHTML(packageData.country)} • ${escapeHTML(packageData.month)} • ${escapeHTML(packageData.duration)}</p>
          <p>${escapeHTML(packageData.description)}</p>
          <h2>Package Highlights</h2>
          <ul>${packageData.highlights.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
          <h2>Itinerary</h2>
          <ul>${packageData.itinerary.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
          <h2>Pricing</h2>
          <p class="price">${escapeHTML(packageData.price)} per traveler (double sharing)</p>
        </section>
        <section class="panel">
          <h2>Inquire & Book</h2>
          <form class="inquiry-form">
            <label>
              Name
              <input type="text" name="name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" required />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" required />
            </label>
            <label>
              Message
              <textarea name="message" rows="4" required>I'm interested in ${escapeHTML(packageData.title)}.</textarea>
            </label>
            <button type="submit" class="btn-primary">Submit Inquiry</button>
          </form>
        </section>
      </div>
    </section>
  `;

  bindInquiryForms();
};

const init = async () => {
  if (page === "index.html" || page === "") {
    await renderHome();
  }

  if (page === "packages.html") {
    await renderPackages();
  }

  if (page === "package-details.html") {
    await renderPackageDetails();
  }

  bindInquiryForms();
};

init();
