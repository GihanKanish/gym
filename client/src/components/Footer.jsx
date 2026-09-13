export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-ink-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-display text-xl text-white mb-3">
            IRON<span className="text-volt-500">CORE</span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Train harder. Recover smarter. IronCore Gym is your home for group classes,
            personal training, and a community that pushes you further.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase text-sm tracking-wide mb-3">Location &amp; Hours</h4>
          <p className="text-zinc-400 text-sm leading-relaxed">
            221 Foundry Street<br />
            Riverside District, Springfield<br /><br />
            Mon &ndash; Fri: 5:00 AM &ndash; 10:00 PM<br />
            Sat &ndash; Sun: 7:00 AM &ndash; 8:00 PM
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase text-sm tracking-wide mb-3">Contact</h4>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Phone: (555) 234-9981<br />
            Email: hello@ironcoregym.com
          </p>
          <a
            href="/admin/login"
            className="inline-block mt-4 text-xs uppercase tracking-wide text-zinc-500 hover:text-volt-500 transition-colors"
          >
            Staff Login
          </a>
        </div>
      </div>
      <div className="text-center text-zinc-600 text-xs pb-6">
        &copy; {new Date().getFullYear()} IronCore Gym. All rights reserved.
      </div>
    </footer>
  );
}
