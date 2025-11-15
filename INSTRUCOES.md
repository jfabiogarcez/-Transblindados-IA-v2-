# 🛍️ Allure Store - Instruções de Uso

## 📋 Visão Geral

O site da **Allure** é uma loja online completa para venda de roupas elegantes, com sistema de carrinho de compras, checkout e envio automático de nota fiscal por email.

---

## 🎯 Funcionalidades Principais

### Para Clientes

1. **Navegação e Catálogo**
   - Visualizar produtos em destaque na página inicial
   - Ver todos os produtos disponíveis
   - Informações detalhadas de cada produto (nome, descrição, preço, estoque)

2. **Carrinho de Compras**
   - Adicionar produtos ao carrinho
   - Ajustar quantidades
   - Remover itens
   - Ver total em tempo real

3. **Processo de Compra**
   - Preencher dados de entrega (nome, email, telefone, endereço)
   - Revisar pedido antes de finalizar
   - Receber instruções de pagamento (PIX ou transferência)
   - Confirmar pagamento

4. **Nota Fiscal Automática**
   - Após confirmar o pagamento, o cliente recebe automaticamente por email:
     - Nota fiscal/recibo em HTML elegante
     - Detalhes completos do pedido
     - Informações de entrega

### Para Administradores

1. **Painel Administrativo** (`/admin`)
   - Visualizar todos os pedidos
   - Ver estatísticas (total, pendentes, pagos, entregues)
   - Atualizar status dos pedidos
   - Gerenciar fluxo de vendas

2. **Notificações**
   - Receber notificação automática quando um novo pedido é confirmado

---

## 🚀 Como Usar

### Acesso ao Site

- **URL do site:** Disponível no painel de preview
- **Painel Admin:** Clique em "Admin" no menu (requer login)

### Fluxo de Compra do Cliente

1. **Navegar pelos produtos** na página inicial
2. **Clicar em "Adicionar ao Carrinho"** no produto desejado
3. **Abrir o carrinho** clicando no ícone de sacola no topo
4. **Clicar em "Finalizar Compra"**
5. **Preencher dados de entrega:**
   - Nome completo
   - Email (onde receberá a nota fiscal)
   - Telefone (opcional)
   - Endereço completo de entrega
6. **Clicar em "Continuar para Pagamento"**
7. **Realizar o pagamento:**
   - **Opção 1 - PIX:** Copiar a chave PIX e fazer a transferência
   - **Opção 2 - Transferência:** Usar os dados bancários fornecidos
8. **Clicar em "Confirmar Pagamento"** após realizar a transferência
9. **Receber nota fiscal por email** automaticamente

### Gerenciamento de Pedidos (Admin)

1. **Fazer login** com sua conta de administrador
2. **Acessar `/admin`** ou clicar em "Admin" no menu
3. **Visualizar todos os pedidos** na tabela
4. **Atualizar status** usando o dropdown em cada pedido:
   - **Pendente:** Aguardando pagamento
   - **Pago:** Pagamento confirmado
   - **Processando:** Pedido sendo preparado
   - **Enviado:** Pedido despachado
   - **Entregue:** Pedido recebido pelo cliente
   - **Cancelado:** Pedido cancelado

---

## 💳 Sistema de Pagamento

### Configuração Atual

O site está configurado com **pagamento manual** via PIX ou transferência bancária:

- **Chave PIX:** contato@allure.com.br
- **Banco:** Banco do Brasil
- **Agência:** 1234-5
- **Conta:** 12345-6
- **Favorecido:** Allure Moda Ltda

### ⚠️ Importante

Você deve **atualizar os dados de pagamento** com suas informações reais:

1. Editar o arquivo: `client/src/pages/Payment.tsx`
2. Procurar pela seção "Instruções de Pagamento"
3. Substituir pelos seus dados bancários reais

### Integração com PayPal (Opcional)

Para integrar pagamento automático via PayPal:

1. O servidor MCP do PayPal está disponível mas requer autenticação OAuth
2. Entre em contato com o suporte para configurar a integração completa
3. Após configurado, o pagamento será processado automaticamente

---

## 📧 Sistema de Email

### Envio de Nota Fiscal

O sistema envia automaticamente uma nota fiscal elegante por email quando:
- O cliente confirma o pagamento na página de pagamento
- O administrador marca um pedido como "Pago" no painel admin

### Configuração do Email

O sistema usa o **Gmail MCP Server** para envio de emails. Para funcionar:

1. A autenticação OAuth do Gmail deve estar configurada
2. O sistema enviará emails do seu Gmail conectado
3. A nota fiscal inclui:
   - Logo e branding da Allure
   - Detalhes completos do pedido
   - Informações do cliente
   - Lista de produtos com preços
   - Total do pedido

---

## 🗄️ Gerenciamento de Produtos

### Produtos Atuais

O banco de dados já contém 8 produtos de exemplo:
- Vestido Longo Elegante (R$ 299,00)
- Blazer Alfaiataria Premium (R$ 399,00)
- Calça Pantalona Clássica (R$ 199,00)
- Blusa de Seda Delicada (R$ 249,00)
- Saia Midi Plissada (R$ 179,00)
- Conjunto Social Completo (R$ 549,00)
- Vestido Tubinho Executivo (R$ 279,00)
- Casaco Trench Coat (R$ 499,00)

### Adicionar Novos Produtos

**Via Banco de Dados:**

1. Acesse o painel "Database" na interface de gerenciamento
2. Abra a tabela `products`
3. Clique em "Add Row" e preencha:
   - **name:** Nome do produto
   - **description:** Descrição detalhada
   - **price:** Preço em centavos (ex: 29900 = R$ 299,00)
   - **imageUrl:** URL da imagem do produto
   - **category:** Categoria (Vestidos, Blusas, etc)
   - **stock:** Quantidade em estoque
   - **isActive:** 1 (ativo) ou 0 (inativo)

**Dica:** Para adicionar imagens dos seus produtos reais:
1. Coloque as imagens na pasta `client/public/images/`
2. Use o caminho `/images/nome-da-imagem.jpg` no campo imageUrl

---

## 🎨 Personalização

### Alterar Cores e Estilo

Edite o arquivo `client/src/index.css` para mudar:
- Cores primárias e secundárias
- Tipografia
- Espaçamentos

### Alterar Informações de Contato

Edite o arquivo `client/src/components/Footer.tsx` para atualizar:
- Email de contato
- Telefone
- Endereço

### Alterar Logo

1. Substitua o logo no arquivo `client/src/const.ts`
2. Atualize o favicon no painel de gerenciamento (Settings → General)

---

## 📊 Banco de Dados

### Acesso ao Banco

Use o painel "Database" na interface de gerenciamento para:
- Visualizar todos os pedidos
- Ver produtos cadastrados
- Editar informações diretamente
- Exportar dados

### Tabelas Principais

- **products:** Catálogo de produtos
- **orders:** Pedidos realizados
- **orderItems:** Itens de cada pedido
- **users:** Usuários do sistema

---

## 🔒 Segurança

### Acesso Administrativo

- Apenas usuários com role "admin" podem acessar o painel administrativo
- O proprietário do projeto é automaticamente admin
- Para promover outros usuários a admin, edite o campo `role` na tabela `users`

---

## 🐛 Solução de Problemas

### Email não está sendo enviado

1. Verifique se a autenticação OAuth do Gmail está configurada
2. Execute: `manus-mcp-cli tool list --server gmail` para testar
3. Siga o fluxo de autenticação se necessário

### Produtos não aparecem

1. Verifique se há produtos no banco de dados (painel Database)
2. Confirme que o campo `isActive` está como 1
3. Verifique se há estoque disponível (`stock > 0`)

### Erro ao criar pedido

1. Verifique se os produtos têm estoque suficiente
2. Confirme que todos os campos obrigatórios estão preenchidos
3. Verifique os logs do servidor no terminal

---

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktops
- 🖥️ Monitores grandes

---

## 🚀 Próximos Passos

1. **Substituir produtos de exemplo** pelos seus produtos reais
2. **Atualizar dados de pagamento** com suas informações bancárias
3. **Adicionar fotos reais** dos seus produtos
4. **Testar fluxo completo** de compra
5. **Configurar domínio personalizado** (se desejar)
6. **Divulgar o site** para seus clientes!

---

## 📞 Suporte

Para dúvidas ou problemas técnicos, entre em contato através do painel de suporte da Manus.

---

**Boa sorte com suas vendas! 🎉**
