import { MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">
              ChoufPrice<span className="text-primary">DZ</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Plateforme communautaire de surveillance des prix en Algérie
          </p>

          <p className="text-sm text-muted-foreground">
            Fait avec <span className="text-destructive">&#9829;</span> en Algérie
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ChoufPrice DZ. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
