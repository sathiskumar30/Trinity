"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

type Idea = { id: number; text: string; votes: number; created_at: string }

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export default function IdeaBoardPage() {
  const { data, error, isLoading, mutate } = useSWR<Idea[]>("/ideas", fetcher, {
    refreshInterval: 2000, // long polling feel
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
      mutate() // refresh after add
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
      // optimistic update
      mutate(
        async (current) => {
          if (!current) return current
          const next = current.map((i) => (i.id === id ? { ...i, votes: i.votes + 1 } : i))
          api.post(`/ideas/${id}/upvote`).catch(() => mutate()) // rollback by refetch if fails
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
    <main className="min-h-screen bg-background">
      <header className="mx-auto max-w-4xl px-6 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">The Idea Board</h1>
        <a href="/" className="text-sm underline">
          Back to landing
        </a>
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
    </main>
  )
}
