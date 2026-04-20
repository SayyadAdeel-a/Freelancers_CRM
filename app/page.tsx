import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <main className="max-w-md w-full space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Freelancer CRM
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your clients without the 747 cockpit.
          </p>
        </div>

        <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Get Started</h2>
            <p className="text-sm text-muted-foreground">
              Sign up or log in to manage your freelance business.
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="sara@example.com"
              />
            </div>
            
            <div className="pt-2 space-y-3">
              <Button type="button" className="w-full h-12 text-base">
                Start for free
              </Button>
              <Button variant="secondary" type="button" className="w-full h-12 text-base">
                See our plans
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
