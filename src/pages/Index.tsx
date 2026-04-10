import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, PhoneForwarded } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Index() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-slate-50 to-white pt-20 pb-32 px-4">
        <div className="container max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-secondary">
            Mude para a Voacell com <span className="text-primary">Segurança</span> e Rapidez
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Processo de portabilidade 100% digital, validado por biometria e em conformidade com a
            LGPD. Traga seu número hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/portabilidade">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg h-14 px-8 shadow-lg shadow-primary/20"
              >
                Solicitar Portabilidade <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8">
                Já sou cliente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-slate-50 border-t">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">Como funciona o processo?</h2>
            <p className="text-muted-foreground">
              Simples, digital e totalmente seguro para sua empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-elevation hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary">
                  <PhoneForwarded className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">1. Dados Básicos</h3>
                <p className="text-muted-foreground">
                  Informe seus dados e os números que deseja trazer para a Voacell.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-elevation hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">2. Documentação</h3>
                <p className="text-muted-foreground">
                  Envie sua última fatura e documentos de forma digital e rápida.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-elevation hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center text-green-600">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">3. Vídeo Autorização</h3>
                <p className="text-muted-foreground">
                  Grave um vídeo curto para confirmar sua identidade e evitar fraudes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
