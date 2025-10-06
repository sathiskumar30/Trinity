"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <span className="text-lg font-semibold">IdeaBoard</span>
        <nav className="flex items-center gap-4">
          <Link href="#features" className="text-sm hover:underline">
            Features
          </Link>
          <Link href="/app">
            <Button className="bg-primary text-primary-foreground rounded-full px-5">Open the App</Button>
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-semibold text-balance">Share ideas. Upvote what matters.</h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            A lightweight, real-time board for capturing and curating ideas. Submit anonymously, vote instantly, and
            watch priorities emerge.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link href="/app">
              <Button className="bg-primary text-primary-foreground rounded-full px-6 py-6 text-base">
                Try the Idea Board
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="rounded-full px-6 py-6 text-base bg-transparent">
                Explore features
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-card">
          <Image
            src="/images/hero.jpg"
            alt="People brainstorming with sticky notes"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>
      </section>

      <section id="features" className="bg-card border-t">
        <div className="mx-auto max-w-6xl px-6 py-14 grid md:grid-cols-4 gap-6">
          {[
            {
              title: "Anonymous by default",
              body: "Lower the bar to share ideas. No sign up required.",
              img: "/images/feature-1.jpg",
            },
            {
              title: "Real-time feel",
              body: "Long polling keeps the board feeling live and fresh.",
              img: "/images/feature-2.jpg",
            },
            {
              title: "One-click upvotes",
              body: "Promote the best ideas fast with simple upvoting.",
              img: "/images/feature-3.jpg",
            },
            {
              title: "Runs anywhere",
              body: "Containerized stack: Next.js, Express, and PostgreSQL.",
              img: "/images/feature-4.jpg",
            },
          ].map((f, i) => (
            <div key={i} className="rounded-xl overflow-hidden border bg-background">
              <div className="relative h-36 w-full">
                <Image
                  src={f.img || "/placeholder.svg"}
                  alt={f.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 25vw, 100vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        Built with Next.js, Express, and PostgreSQL.
      </footer>
    </main>
  )
}
