export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
      <p className="m-0">&copy; {year} fireballing</p>
    </footer>
  )
}
