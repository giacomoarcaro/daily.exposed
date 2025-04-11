'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Daily Exposed
        </Link>

        <nav className="hidden space-x-8 md:flex">
          <Link
            href="/"
            className={`text-sm font-medium ${
              isActive('/') ? 'text-black' : 'text-gray-500'
            }`}
          >
            Home
          </Link>
          <Link
            href="/articles"
            className={`text-sm font-medium ${
              isActive('/articles') ? 'text-black' : 'text-gray-500'
            }`}
          >
            Articles
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium ${
              isActive('/about') ? 'text-black' : 'text-gray-500'
            }`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              {session.user.role === 'admin' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {session.user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 