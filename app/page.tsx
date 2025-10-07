"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

type Idea = { id: number; text: string; votes: number; created_at: string }

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export default function HomeAndBoardPage() {
  const [view, setView] = useState<"home" | "board">("home")

  const { data, error, isLoading, mutate } = useSWR<Idea[]>(view === "board" ? "/ideas" : null, fetcher, {
    refreshInterval: 2000,
    revalidateOnFocus: true,
  })

  const [text, setText] = useState("")
  const remaining = useMemo(() => 280 - text.length, [text])

  const submit = async () => {
    try {
      if (!text.trim()) return
      if (text.length > 280) {
        toast({ title: "Too long", description: "Ideas are limited to 280 characters.", variant: "destructive" })
        return
      }
      await api.post("/ideas", { text })
      setText("")
      toast({ title: "Idea added", description: "Thanks for sharing!" })
      mutate && mutate()
    } catch (e: any) {
      toast({
        title: "Add failed",
        description: e?.response?.data?.error || "Please try again.",
        variant: "destructive",
      })
    }
  }

  const upvote = async (id: number) => {
    try {
      mutate &&
        mutate(
          async (current) => {
            if (!current) return current
            const next = current.map((i) => (i.id === id ? { ...i, votes: i.votes + 1 } : i))
            api.post(`/ideas/${id}/upvote`).catch(() => mutate && mutate())
            toast({ title: "Upvoted", description: "Thanks for the feedback!" })
            return next
          },
          { revalidate: false },
        )
    } catch (e: any) {
      toast({
        title: "Upvote failed",
        description: e?.response?.data?.error || "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {view === "home" ? (
        <>
          <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
            <span className="text-lg font-semibold">IdeaBoard</span>
            <nav className="flex items-center gap-4">
              <a href="#features" className="text-sm hover:underline">
                Features
              </a>
              <Button onClick={() => setView("board")} className="bg-primary text-primary-foreground rounded-full px-5">
                Open the App
              </Button>
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
                <Button onClick={() => setView("board")} className="bg-primary text-primary-foreground rounded-full px-6 py-6 text-base">
                  Try the Idea Board
                </Button>
                <a href="#features">
                  <Button variant="outline" className="rounded-full px-6 py-6 text-base bg-transparent">
                    Explore features
                  </Button>
                </a>
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
        </>
      ) : (
        <>
          <header className="mx-auto max-w-4xl px-6 py-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">The Idea Board</h1>
            <button onClick={() => setView("home")} className="text-sm underline">
              Back to landing
            </button>
          </header>

          <section className="mx-auto max-w-4xl px-6">
            <Card className="border">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  <label htmlFor="idea" className="text-sm">
                    Share an idea
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="idea"
                      placeholder="Max 280 characters"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={280}
                      className="flex-1"
                    />
                    <Button onClick={submit} className="bg-primary text-primary-foreground rounded-full px-6">
                      Add
                    </Button>
                  </div>
                  <div className={cn("text-xs", remaining < 0 ? "text-destructive" : "text-muted-foreground")}>
                    {remaining} characters left
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {isLoading && <p className="text-sm text-muted-foreground">Loading ideas…</p>}
              {error && <p className="text-sm text-destructive">Failed to load ideas.</p>}
              {data?.length === 0 && <p className="text-sm text-muted-foreground">No ideas yet. Be the first!</p>}
              {data?.map((idea) => (
                <Card key={idea.id} className="border">
                  <CardContent className="p-4 flex items-start gap-3">
                    <button
                      className="rounded-full border px-3 py-2 bg-secondary text-secondary-foreground hover:bg-accent"
                      onClick={() => upvote(idea.id)}
                      aria-label="Upvote idea"
                    >
                      ▲ {idea.votes}
                    </button>
                    <div>
                      <p className="font-medium">{idea.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(idea.created_at).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
