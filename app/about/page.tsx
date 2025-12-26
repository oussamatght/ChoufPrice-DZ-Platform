import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Shield, TrendingUp, Eye } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                  <MapPin className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-balance">
                À Propos de <span className="text-primary">ChoufPrice DZ</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                La première plateforme communautaire de surveillance des prix en Algérie. Ensemble, nous rendons les
                prix transparents et accessibles à tous.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Notre Mission</h2>
              <p className="text-muted-foreground text-center text-pretty mb-12">
                ChoufPrice DZ a été créé pour aider les citoyens algériens à suivre l&apos;évolution des prix des
                produits de première nécessité et à détecter les pratiques de spéculation. Notre plateforme permet à
                chacun de contribuer en signalant les prix observés dans leur région.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Transparence</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Rendez les prix visibles pour tous et contribuez à un marché plus équitable.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <Users className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <CardTitle className="text-lg">Communauté</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Une plateforme construite par et pour les citoyens algériens.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/50">
                        <TrendingUp className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <CardTitle className="text-lg">Alertes</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Détection automatique des prix anormaux et alertes en temps réel.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <Shield className="h-5 w-5 text-destructive" />
                      </div>
                      <CardTitle className="text-lg">Protection</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Contribuez anonymement et en toute sécurité à la surveillance des prix.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">Comment ça marche?</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Inscrivez-vous ou continuez en anonyme</h3>
                    <p className="text-sm text-muted-foreground">
                      Créez un compte pour accéder à toutes les fonctionnalités ou contribuez anonymement.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Signalez les prix</h3>
                    <p className="text-sm text-muted-foreground">
                      Indiquez le produit, le prix et la localisation. C&apos;est rapide et simple.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Consultez la carte</h3>
                    <p className="text-sm text-muted-foreground">
                      Visualisez les prix en temps réel sur la carte interactive de l&apos;Algérie.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Votez et discutez</h3>
                    <p className="text-sm text-muted-foreground">
                      Validez les prix signalés par d&apos;autres et échangez avec la communauté.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
