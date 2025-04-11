import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">Daily Exposed</h3>
            <p className="mt-4 text-sm text-gray-600">
              Uncovering the truth behind the news through investigative
              journalism.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/articles?category=News" className="text-gray-600 hover:text-gray-900">
                  News
                </Link>
              </li>
              <li>
                <Link href="/articles?category=Investigation" className="text-gray-600 hover:text-gray-900">
                  Investigation
                </Link>
              </li>
              <li>
                <Link href="/articles?category=Scam" className="text-gray-600 hover:text-gray-900">
                  Scam
                </Link>
              </li>
              <li>
                <Link href="/articles?category=Technology" className="text-gray-600 hover:text-gray-900">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/articles?category=Politics" className="text-gray-600 hover:text-gray-900">
                  Politics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://twitter.com/dailyexposed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/dailyexposed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/dailyexposed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Daily Exposed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 