# Allure Store - Lista de Tarefas

## Banco de Dados
- [x] Criar tabela de produtos (nome, descrição, preço, imagem, estoque, categoria)
- [x] Criar tabela de pedidos (usuário, produtos, total, status, data)
- [x] Criar tabela de itens do pedido (relação entre pedidos e produtos)
- [x] Executar migração do banco de dados

## Backend (tRPC)
- [x] Criar procedimento para listar produtos
- [x] Criar procedimento para obter detalhes de um produto
- [x] Criar procedimento para criar pedido
- [x] Criar procedimento para listar pedidos do usuário (área admin)
- [x] Criar procedimento para atualizar status do pedido

## Frontend - Layout e Navegação
- [x] Criar página inicial com catálogo de produtos
- [x] Criar página de detalhes do produto
- [x] Criar carrinho de compras (componente)
- [x] Criar página de checkout
- [x] Criar página de confirmação de pedido
- [x] Criar área administrativa para gerenciar pedidos

## Design e Estilo
- [x] Definir paleta de cores e tipografia
- [x] Criar logo e identidade visual
- [x] Implementar design responsivo
- [x] Adicionar imagens de produtos

## Integração de Pagamento
- [x] Configurar integração com PayPal
- [x] Implementar fluxo de pagamento no checkout
- [x] Adicionar confirmação de pagamento
- [x] Testar transações

## Funcionalidades Adicionais
- [ ] Sistema de busca de produtos
- [ ] Filtros por categoria
- [x] Gerenciamento de estoque
- [x] Notificações de novos pedidos para o proprietário

## Testes e Deploy
- [x] Testar fluxo completo de compra
- [x] Verificar responsividade em diferentes dispositivos
- [x] Criar checkpoint final
- [x] Documentar instruções de uso

## Email e Notificações
- [x] Criar template de nota fiscal/recibo em HTML
- [x] Implementar envio de email com nota fiscal após pagamento confirmado
- [x] Incluir detalhes do pedido na nota fiscal (produtos, valores, dados do cliente)


## Correções
- [x] Corrigir erro de elementos <a> aninhados no componente Home
- [x] Corrigir elementos <a> aninhados no Header


## Integração Stripe
- [x] Adicionar feature Stripe ao projeto
- [x] Criar endpoint para criar sessão de checkout do Stripe
- [x] Atualizar página de pagamento com botão do Stripe
- [x] Implementar webhook para confirmar pagamentos
- [x] Testar fluxo de pagamento com Stripe
