import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4">
      <nav className="mx-auto flex max-w-5xl items-center gap-x-4 py-3">
        <h2 className="m-0 text-base font-semibold tracking-tight">
          <Link to="/" className="text-gray-900 no-underline">
            ddasangfolio
          </Link>
        </h2>

        <div className="flex items-center gap-x-4 text-sm font-medium">
          <Link
            to="/"
            className="text-gray-500 no-underline hover:text-gray-900"
            activeProps={{ className: 'text-gray-900 no-underline' }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-500 no-underline hover:text-gray-900"
            activeProps={{ className: 'text-gray-900 no-underline' }}
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  )
}
