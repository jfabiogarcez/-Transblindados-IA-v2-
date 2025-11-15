import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Copy, CreditCard } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function Payment() {
  const [, params] = useRoute("/pagamento/:orderId");
  const [, setLocation] = useLocation();
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const orderId = params?.orderId ? parseInt(params.orderId) : null;

  const { data: order, isLoading } = trpc.orders.getById.useQuery(
    { id: orderId! },
    { enabled: !!orderId }
  );

  const confirmPaymentMutation = trpc.orders.confirmPayment.useMutation({
    onSuccess: () => {
      setPaymentConfirmed(true);
      toast.success("Pagamento confirmado! Nota fiscal enviada por email.");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao confirmar pagamento");
    },
  });

  const handleConfirmPayment = () => {
    if (!orderId) return;
    confirmPaymentMutation.mutate({
      orderId,
      paymentMethod: "PIX/Transferência",
    });
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("contato@allure.com.br");
    toast.success("Chave PIX copiada!");
  };

  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Pedido não encontrado</h2>
            <Button onClick={() => setLocation("/")}>Voltar para a loja</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Pedido não encontrado</h2>
            <Button onClick={() => setLocation("/")}>Voltar para a loja</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (paymentConfirmed || order.status === 'paid') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 bg-muted/30">
          <div className="container max-w-2xl">
            <Card className="text-center">
              <CardContent className="pt-12 pb-12">
                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Pagamento Confirmado!</h1>
                <p className="text-muted-foreground text-lg mb-6">
                  Seu pedido #{order.id} foi confirmado com sucesso.
                </p>
                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Uma nota fiscal foi enviada para:
                  </p>
                  <p className="font-semibold text-lg">{order.customerEmail}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Você receberá atualizações sobre o status do seu pedido por email.
                </p>
                <Button size="lg" onClick={() => setLocation("/")}>
                  Voltar para a loja
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Pagamento</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Instructions */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Instruções de Pagamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Opção 1: PIX</h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Faça um PIX para a chave abaixo:
                      </p>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-background px-4 py-3 rounded border text-sm">
                          contato@allure.com.br
                        </code>
                        <Button variant="outline" size="icon" onClick={copyPixKey}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold">
                        Valor: R$ {(order.totalAmount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Opção 2: Transferência Bancária</h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                      <p><strong>Banco:</strong> Banco do Brasil</p>
                      <p><strong>Agência:</strong> 1234-5</p>
                      <p><strong>Conta:</strong> 12345-6</p>
                      <p><strong>Favorecido:</strong> Allure Moda Ltda</p>
                      <p className="font-semibold pt-2">
                        Valor: R$ {(order.totalAmount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Após realizar o pagamento, clique no botão abaixo para confirmar. Você receberá
                      uma nota fiscal por email automaticamente.
                    </p>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleConfirmPayment}
                      disabled={confirmPaymentMutation.isPending}
                    >
                      {confirmPaymentMutation.isPending
                        ? "Processando..."
                        : "Confirmar Pagamento"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pedido</span>
                      <span className="font-semibold">#{order.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Itens</span>
                      <span>{order.items.length}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        R$ {(order.totalAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 text-sm text-muted-foreground">
                    <p className="mb-2"><strong>Entregar para:</strong></p>
                    <p>{order.customerName}</p>
                    <p className="mt-2 text-xs">{order.shippingAddress}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
