import { Button } from "$/lib/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "$/lib/components/ui/card";
import { Antenna, Grid, SquareStack } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  return (
    <>
      <header className="mx-auto my-14 flex max-w-[80%] flex-col items-center gap-5 px-4 text-center">
        <h1 className="text-4xl font-black sm:text-6xl">
          Learning from experience
        </h1>
        <h2 className="max-w-lg text-lg text-muted-foreground sm:text-xl">
          My playground for experimenting with web technologies and docummenting
          my journey.
        </h2>
      </header>

      <div className="mx-auto mb-10 grid max-w-5xl gap-4 px-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <Grid strokeWidth="1" size="48px" className="mb-2" />

            <CardTitle>Editable Grid</CardTitle>
            <CardDescription>
              A WIP project to implement an editable grid system based on css
              grid
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button asChild>
              <Link href="/editable-grid">See it in action</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Antenna strokeWidth="1" size="48px" className="mb-2" />

            <CardTitle>Wonder Event Emitter</CardTitle>
            <CardDescription>
              A small package for defining type-safe event emitters
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button variant="secondary" asChild>
              <Link href="https://www.npmjs.com/package/@grekomp/wonder-event-emitter">
                View on npm
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <SquareStack strokeWidth="1" size="48px" className="mb-2" />

            <CardTitle>Wonder Interaction Stack</CardTitle>
            <CardDescription>
              A small package for modeling non-instant user interactions, like
              drag&apos;n&apos;drop
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button variant="secondary" asChild>
              <Link href="https://www.npmjs.com/package/@grekomp/wonder-interaction-stack">
                View on npm
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
