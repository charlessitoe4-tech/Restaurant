$(function () {
    const STORAGE_KEY = 'restaurante_estado_v1';
    const USERS_KEY = 'restaurante_usuarios_v1';
    let usuarioLogado = null;

    function carregarUsuarios() {
        const usuariosSalvos = JSON.parse(localStorage.getItem(USERS_KEY) || 'null');
        const usuariosPadrao = [
            { nome: 'Garçom', usuario: 'garcom', email: 'garcom@restaurante.com', senha: 'G@rcom2025', role: 'garcom' },
            { nome: 'Delivery', usuario: 'delivery', email: 'delivery@restaurante.com', senha: 'D3liVery#2025', role: 'delivery' },
            { nome: 'Admin', usuario: 'admin', email: 'admin@restaurante.com', senha: 'Adm!nRest2025', role: 'admin' },
            { nome: 'Caixa', usuario: 'caixa', email: 'caixa@restaurante.com', senha: 'C@ixa2025', role: 'caixa' }
        ];

        if (Array.isArray(usuariosSalvos) && usuariosSalvos.length) {
            return usuariosSalvos;
        }

        localStorage.setItem(USERS_KEY, JSON.stringify(usuariosPadrao));
        return usuariosPadrao;
    }

    const USERS = carregarUsuarios();

    function salvarUsuarios() {
        localStorage.setItem(USERS_KEY, JSON.stringify(USERS));
    }

    function gerarUsuarioCliente(nome, email) {
        const base = (nome || email || 'cliente')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '')
            .slice(0, 12);

        const sufixo = Math.floor(Math.random() * 900 + 100);
        return `${base || 'cliente'}${sufixo}`;
    }

    function cadastrarCliente(nome, email, telefone, senha) {
        if (!nome || !email || !telefone || !senha) {
            $('#login-mensagem').text('Preencha nome, email, telefone e senha para criar a conta.');
            return false;
        }

        const existe = USERS.some(item => item.email === email || item.usuario === gerarUsuarioCliente(nome, email));
        if (existe) {
            $('#login-mensagem').text('Já existe uma conta com este e-mail ou nome de utilizador.');
            return false;
        }

        const usuario = gerarUsuarioCliente(nome, email);
        const novaConta = {
            nome: nome.trim(),
            usuario,
            email: email.trim(),
            telefone: telefone.trim(),
            senha,
            role: 'cliente'
        };

        USERS.push(novaConta);
        salvarUsuarios();
        $('#login-mensagem').text(`Conta criada com sucesso! Utilize o utilizador ${usuario} ou o email ${email}.`);
        $('#usuario-login').val(usuario);
        $('#senha-login').val(senha);
        return true;
    }

    $('body').removeClass('logado');

    const categorias = {
        'pequeno-almoco': {
            nome: 'Pequeno-almoço',
            descricao: 'Comece o dia com opções quentes, frescas e preparadas na hora.',
            frase: 'Servido com ingredientes frescos e o tempero da casa.',
            itens: [
                ['Ovos mexidos com pão', 180], ['Omelete de queijo e tomate', 220], ['Omelete de camarão', 320],
                ['Sanduíche de ovo e queijo', 200], ['Sanduíche de frango', 250], ['Tosta mista', 180],
                ['Tosta de abacate e ovo', 280], ['Panquecas com mel', 220], ['Panquecas de banana', 230],
                ['Crepes de chocolate', 260], ['Mandioca cozida com ovos', 200], ['Xima de milho com caril', 260],
                ['Matapa de pequeno-almoço', 280], ['Badjias com pão', 160], ['Chamussas de frango', 180],
                ['Chamussas de carne', 190], ['Pão com chouriço', 240], ['Pão com atum', 230],
                ['Croissant simples', 150], ['Croissant de queijo', 190], ['Bolo de milho', 160],
                ['Bolo de banana', 160], ['Iogurte com fruta', 220], ['Salada de frutas', 200],
                ['Papa de aveia', 180], ['Cuscuz com leite', 180], ['Café e torradas', 140],
                ['Chá e torradas', 120], ['Leite com chocolate', 150], ['Pequeno-almoço continental', 350],
                ['Pequeno-almoço tropical', 380], ['Fígado acebolado com pão', 300], ['Salsicha com ovos', 260],
                ['Feijão com ovo e pão', 230], ['Cachupa de pequeno-almoço', 300]
            ]
        },
        'fast-food': {
            nome: 'Fast food',
            descricao: 'Clássicos rápidos e saborosos para qualquer hora do dia.',
            frase: 'Montado na hora, com acompanhamentos frescos.',
            itens: [
                ['Hambúrguer clássico', 350], ['Cheeseburger da casa', 400], ['Hambúrguer duplo', 520],
                ['Hambúrguer de frango', 380], ['Hambúrguer de peixe', 400], ['Hambúrguer de feijão', 320],
                ['Cachorro-quente completo', 300], ['Cachorro-quente com queijo', 340], ['Bifana no pão', 350],
                ['Prego no pão', 400], ['Frango no pão', 330], ['Kebab de frango', 380],
                ['Kebab de carne', 420], ['Wrap de frango', 380], ['Wrap vegetariano', 320],
                ['Wrap de atum', 360], ['Sanduíche de bife', 450], ['Sanduíche club', 480],
                ['Sanduíche de presunto e queijo', 300], ['Sanduíche de queijo grelhado', 260],
                ['Pizza de frango', 550], ['Pizza de atum', 580], ['Pizza de legumes', 500],
                ['Pizza de quatro queijos', 650], ['Pizza portuguesa', 620], ['Pizza de camarão', 750],
                ['Fatia de pizza', 180], ['Frango frito crocante', 450], ['Asas de frango picantes', 420],
                ['Nuggets de frango', 350], ['Batata frita', 180], ['Batata com queijo', 280],
                ['Batata doce frita', 220], ['Tiras de frango', 400], ['Tábua de petiscos', 650]
            ]
        },
        'almoco': {
            nome: 'Almoço',
            descricao: 'Pratos completos com sabores de Moçambique e da cozinha internacional.',
            frase: 'Acompanhado de arroz, salada ou batata, conforme a escolha.',
            itens: [
                ['Frango à zambeziana', 550], ['Frango à cafreal', 520], ['Frango grelhado', 480],
                ['Frango à passarinho', 500], ['Frango com amendoim', 540], ['Caril de frango', 500],
                ['Caril de camarão', 750], ['Caril de peixe', 580], ['Matapa de camarão', 650],
                ['Matapa de caranguejo', 720], ['Matapa vegetariana', 450], ['Camarão grelhado', 780],
                ['Camarão à alho', 760], ['Lulas grelhadas', 680], ['Peixe grelhado', 600],
                ['Peixe à escabeche', 560], ['Peixe com molho de coco', 620], ['Bife à casa', 700],
                ['Bife com pimenta', 720], ['Bife de vitela', 700], ['Bife acebolado', 680],
                ['Costeleta de porco', 620], ['Carne de porco à africana', 600], ['Caril de carne', 580], ['Guisado de carne', 560], ['Estufado de vaca', 650], ['Lasanha de carne', 550],
                ['Esparguete à bolonhesa', 500], ['Massa de camarão', 680], ['Risoto de cogumelos', 520],
                ['Arroz de marisco', 850], ['Xima com caril de cabrito', 650], ['Chima com caril de peixe', 580],
                ['Feijoada à transmontana', 580], ['Prato vegetariano da casa', 480]
            ]
        },
        'jantar': {
            nome: 'Jantar',
            descricao: 'Receitas reconfortantes e porções generosas para terminar bem o dia.',
            frase: 'Cozinhado lentamente e finalizado com ervas frescas.',
            itens: [
                ['Sopa de legumes', 180], ['Sopa de cebola', 220], ['Sopa de galinha', 250],
                ['Creme de abóbora', 220], ['Caldo de peixe', 280], ['Salada tropical', 380],
                ['Salada de frango grelhado', 450], ['Salada de camarão', 580], ['Salada caprese', 420],
                ['Carpaccio de carne', 550], ['Tábua de queijos', 750], ['Tábua de enchidos', 680],
                ['Risoto de camarão', 720], ['Risoto de frango', 560], ['Risoto de peixe', 650],
                ['Arroz de frango no forno', 520], ['Arroz de pato', 680], ['Arroz de marisco', 850],
                ['Bacalhau à brás', 720], ['Bacalhau com natas', 750], ['Peixe ao molho de limão', 620],
                ['Peixe no forno com legumes', 650], ['Camarão ao molho de coco', 780], ['Caril de cabrito', 700], ['Cabrito assado', 750], ['Costelas barbecue', 680], ['Bife à portuguesa', 760],
                ['Medalhões de filé', 850], ['Lombo de porco assado', 650], ['Massa carbonara', 550],
                ['Massa ao pesto', 520], ['Massa de marisco', 780], ['Pizza italiana', 620],
                ['Pizza mexicana', 550], ['Prato do chefe', 900]
            ]
        },
        'sobremesas': {
            nome: 'Sobremesas',
            descricao: 'Doces e frutas para fechar a refeição com um toque especial.',
            frase: 'Sobremesa feita na casa ou escolhida entre os nossos favoritos.',
            itens: [
                ['Bolo de chocolate', 220], ['Bolo de cenoura', 200], ['Bolo de coco', 200],
                ['Bolo de banana', 200], ['Cheesecake de maracujá', 300], ['Cheesecake de frutos vermelhos', 320],
                ['Tarte de maçã', 240], ['Tarte de limão', 240], ['Tarte de coco', 230],
                ['Brownie com gelado', 350], ['Mousse de chocolate', 260], ['Mousse de maracujá', 240],
                ['Mousse de manga', 240], ['Pudim de leite', 220], ['Pudim de coco', 220],
                ['Arroz doce', 180], ['Leite-creme', 220], ['Baba de camelo', 240],
                ['Doce de amendoim', 180], ['Bolo de bolacha', 260], ['Salada de frutas', 220],
                ['Fruta da época', 180], ['Manga com hortelã', 220], ['Banana caramelizada', 240],
                ['Crepe de banana', 280], ['Crepe de chocolate', 280], ['Panqueca doce', 260],
                ['Gelado de baunilha', 180], ['Gelado de chocolate', 180], ['Gelado de coco', 180],
                ['Gelado de manga', 180], ['Taça de gelado', 320], ['Açaí com frutas', 350],
                ['Café com bolo', 280], ['Prato de doces da casa', 450]
            ]
        },
        'bebidas-sem-alcool': {
            nome: 'Bebidas sem álcool',
            descricao: 'Bebidas refrescantes para acompanhar a sua refeição.',
            frase: 'Servido fresco, com gelo quando desejar.',
            itens: [
                ['Água mineral 500 ml', 60], ['Água mineral 1,5 L', 100], ['Água com gás', 100],
                ['Refrigerante cola', 120], ['Refrigerante laranja', 120], ['Refrigerante limão', 120],
                ['Ginger ale', 130], ['Tónica', 130], ['Chá gelado de limão', 150],
                ['Chá gelado de pêssego', 150], ['Limonada', 180], ['Limonada de hortelã', 200],
                ['Limonada de gengibre', 220], ['Sumo de laranja natural', 220], ['Sumo de manga', 220],
                ['Sumo de ananás', 220], ['Sumo de maracujá', 220], ['Sumo de papaia', 220],
                ['Sumo de goiaba', 220], ['Sumo de tamarindo', 220], ['Batido de banana', 280],
                ['Batido de manga', 280], ['Batido de morango', 300], ['Batido de abacate', 300],
                ['Batido de chocolate', 300], ['Água de coco', 200], ['Mocktail tropical', 300],
                ['Mocktail de maracujá', 300], ['Mocktail de frutos vermelhos', 320], ['Sumo detox verde', 280],
                ['Café expresso', 120], ['Café americano', 140], ['Café com leite', 160],
                ['Chá de hortelã', 120], ['Chá de gengibre e limão', 150]
            ]
        },
        'bebidas-com-alcool': {
            nome: 'Bebidas com álcool',
            descricao: 'Cervejas, vinhos e cocktails para brindar em boa companhia.',
            frase: 'Servido bem fresco; consumo responsável recomendado.',
            itens: [
                ['2M lager', 150], ['Laurentina clara', 160], ['Laurentina preta', 170],
                ['Manica lager', 150], ['Impala lager', 160], ['Cerveja sem álcool', 150],
                ['Cerveja artesanal', 280], ['Cerveja de gengibre', 220], ['Sidra de maçã', 250],
                ['Copo de vinho tinto', 280], ['Copo de vinho branco', 280], ['Copo de vinho rosé', 280],
                ['Garrafa de vinho da casa', 1200], ['Garrafa de vinho tinto premium', 1800],
                ['Garrafa de vinho branco premium', 1800], ['Espumante taça', 350], ['Espumante garrafa', 2200],
                ['Gin tónico', 420], ['Gin com frutos vermelhos', 480], ['Caipirinha', 350],
                ['Caipirosca de maracujá', 380], ['Mojito clássico', 380], ['Mojito de manga', 420],
                ['Margarita', 420], ['Margarita de morango', 450], ['Daiquiri de ananás', 420],
                ['Cuba libre', 380], ['Whisky com gelo', 450], ['Rum com cola', 350],
                ['Tequila', 350], ['Amarula com gelo', 420], ['Licor de café', 350],
                ['Cocktail da casa', 500], ['Jarro de sangria', 1100], ['Ponche de fruta', 450]
            ]
        }
    };

    const estadoPadrao = {
        orders: [
            { id: 101, cliente: 'Ana Costa', email: 'ana@cliente.com', telefone: '+258 84 111 2233', local: 'Mesa 3', tipoPedido: 'mesa', total: 950, taxaEntrega: 0, itens: [{ nome: 'Frango à cafreal', preco: 520, quantidade: 1 }, { nome: 'Refrigerante cola', preco: 120, quantidade: 2 }], data: '2026-09-25 12:40' },
            { id: 102, cliente: 'Paulo Nhamposse', email: 'paulo@cliente.com', telefone: '+258 86 555 9988', local: 'Rua 1, Bairro da Luz', tipoPedido: 'delivery', total: 1280, taxaEntrega: 150, itens: [{ nome: 'Hambúrguer clássico', preco: 350, quantidade: 2 }, { nome: 'Batata frita', preco: 180, quantidade: 2 }], data: '2026-09-25 13:05' }
        ],
        reservas: [
            { id: 1, nome: 'Marta Silva', telefone: '+258 84 740 1001', data: '2026-09-30', hora: '19:30', pessoas: 4, mesa: 'Mesa 5', taxa: 200, status: 'pendente', dataConfirmacao: '2026-09-25 09:30' },
            { id: 2, nome: 'Carlos Nhamposse', telefone: '+258 86 200 3300', data: '2026-10-02', hora: '20:15', pessoas: 6, mesa: 'Mesa 8', taxa: 200, status: 'confirmada', dataConfirmacao: '2026-09-25 10:00' }
        ],
        receipts: []
    };

    const estado = carregarEstado();
    const pedido = [];
    let categoriaAtual = 'pequeno-almoco';
    let itensExibidos = 15;

    function carregarEstado() {
        const dadosSalvos = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        const base = JSON.parse(JSON.stringify(estadoPadrao));
        if (!dadosSalvos) return base;

        if (Array.isArray(dadosSalvos.orders)) base.orders = dadosSalvos.orders;
        if (Array.isArray(dadosSalvos.reservas)) base.reservas = dadosSalvos.reservas;
        if (Array.isArray(dadosSalvos.receipts)) base.receipts = dadosSalvos.receipts;
        if (dadosSalvos.categorias) {
            Object.keys(categorias).forEach((chave) => {
                if (dadosSalvos.categorias[chave]) {
                    categorias[chave] = dadosSalvos.categorias[chave];
                }
            });
        }
        return base;
    }

    function salvarEstado() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ categorias, orders: estado.orders, reservas: estado.reservas, receipts: estado.receipts }));
    }

    function formatarMoeda(valor) {
        return `${Number(valor).toFixed(0)} MT`;
    }

    function renderGarcom() {
        const tabela = $('#garcom-lista');
        tabela.empty();
        const pedidosMesa = estado.orders.filter(item => item.tipoPedido === 'mesa');

        if (!pedidosMesa.length) {
            tabela.append('<tr><td colspan="5">Nenhum pedido para garçom.</td></tr>');
            return;
        }

        pedidosMesa.forEach((pedidoAtual) => {
            const itensTexto = pedidoAtual.itens.map(item => `${item.nome} x${item.quantidade}`).join(', ');
            const imagem = pedidoAtual.itens[0] ? obterImagem(pedidoAtual.itens[0].nome) : obterImagem('Prato');
            tabela.append(`
                <tr>
                    <td>
                        <div class="pedido-cliente">
                            <img src="${imagem}" alt="${pedidoAtual.itens[0] ? pedidoAtual.itens[0].nome : 'Prato'}" class="pedido-miniatura">
                            <div>
                                <strong>${pedidoAtual.cliente}</strong><br>
                                <span>${pedidoAtual.telefone || pedidoAtual.email}</span>
                            </div>
                        </div>
                    </td>
                    <td>${pedidoAtual.local}</td>
                    <td>${itensTexto}</td>
                    <td>${formatarMoeda(pedidoAtual.total)}</td>
                    <td>Em espera</td>
                </tr>
            `);
        });
    }

    function renderDelivery() {
        const tabela = $('#delivery-lista');
        tabela.empty();
        const pedidosDelivery = estado.orders.filter(item => item.tipoPedido === 'delivery');

        if (!pedidosDelivery.length) {
            tabela.append('<tr><td colspan="5">Nenhum pedido para delivery.</td></tr>');
            return;
        }

        pedidosDelivery.forEach((pedidoAtual) => {
            const primeiroItem = pedidoAtual.itens[0] || { nome: 'Pedido', preco: 0, quantidade: 1 };
            const ruaBusca = encodeURIComponent(pedidoAtual.local || 'Endereço do cliente');
            const mapaUrl = `https://www.google.com/maps/search/?api=1&query=${ruaBusca}`;
            const taxa = Number(pedidoAtual.taxaEntrega || 150);

            tabela.append(`
                <tr>
                    <td>
                        <div class="pedido-cliente">
                            <img src="${obterImagem(primeiroItem.nome)}" alt="${primeiroItem.nome}" class="pedido-miniatura">
                            <div>
                                <strong>${pedidoAtual.cliente}</strong><br>
                                <span>${pedidoAtual.telefone || pedidoAtual.email}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <a href="${mapaUrl}" target="_blank" rel="noopener noreferrer">${pedidoAtual.local}</a><br>
                        <small>Taxa: ${formatarMoeda(taxa)}</small>
                    </td>
                    <td>${pedidoAtual.email}</td>
                    <td>${formatarMoeda(pedidoAtual.total)}</td>
                    <td>
                        <div class="acoes-em-coluna">
                            <a class="btn-mini email" href="tel:${encodeURIComponent(pedidoAtual.telefone || '')}" target="_blank">Contactar</a>
                            <button type="button" class="btn-mini email" data-email="${pedidoAtual.email}" data-nome="${pedidoAtual.cliente}">Enviar recibo</button>
                        </div>
                    </td>
                </tr>
            `);
        });

        $('.btn-mini.email').on('click', function () {
            const email = $(this).data('email');
            const nome = $(this).data('nome');
            const pedidoAtual = estado.orders.find(item => item.email === email && item.cliente === nome);
            if (pedidoAtual) {
                const recibo = gerarRecibo(pedidoAtual);
                enviarReciboPorEmail(email, nome, recibo);
            }
        });
    }

    function renderAdminMenu() {
        const lista = $('#admin-menu-lista');
        lista.empty();

        Object.entries(categorias).forEach(([chave, categoria]) => {
            categoria.itens.forEach(([nome, preco], index) => {
                const item = $('<div>', { class: 'item-admin' });
                const info = $('<div>').html(`<strong>${nome}</strong><br><span>${categoria.nome} · ${formatarMoeda(preco)}</span>`);
                const acoes = $('<div>', { class: 'acoes' });

                const editar = $('<button>', { type: 'button', class: 'btn-mini editar', text: 'Editar' });
                editar.on('click', function () {
                    $('#admin-prato-nome').val(nome);
                    $('#admin-prato-preco').val(preco);
                    $('#admin-prato-categoria').val(chave);
                    $('#form-admin-menu').data('edit', { categoria: chave, index });
                });

                const excluir = $('<button>', { type: 'button', class: 'btn-mini excluir', text: 'Excluir' });
                excluir.on('click', function () {
                    categorias[chave].itens.splice(index, 1);
                    salvarEstado();
                    renderAdminMenu();
                    renderRelatorio();
                });

                acoes.append(editar, excluir);
                item.append(info, acoes);
                lista.append(item);
            });
        });
    }

    function renderRelatorio() {
        const relatorio = $('#admin-relatorio');
        relatorio.empty();

        const faturamento = estado.orders.reduce((total, pedidoAtual) => total + Number(pedidoAtual.total || 0), 0);
        const pedidosDelivery = estado.orders.filter(item => item.tipoPedido === 'delivery').length;
        const pedidosMesa = estado.orders.filter(item => item.tipoPedido === 'mesa').length;
        const recibosEnviados = estado.receipts.filter(item => item.enviadoEmail).length;
        const reservasPendentes = estado.reservas.filter(item => item.status === 'pendente').length;
        const reservasConfirmadas = estado.reservas.filter(item => item.status === 'confirmada').length;

        const metricas = [
            ['Total de pedidos', estado.orders.length],
            ['Faturamento', formatarMoeda(faturamento)],
            ['Delivery', pedidosDelivery],
            ['Consumo no restaurante', pedidosMesa],
            ['Recibos enviados', recibosEnviados],
            ['Reservas pendentes', reservasPendentes],
            ['Reservas confirmadas', reservasConfirmadas]
        ];

        metricas.forEach(([label, valor]) => {
            const card = $('<div>', { class: 'card-metrica' });
            card.append($('<span>', { text: label }));
            card.append($('<strong>', { text: valor }));
            relatorio.append(card);
        });

        const reservas = $('<div>', { class: 'lista-admin' });
        reservas.append($('<h5>', { text: 'Reservas do restaurante' }));

        if (!estado.reservas.length) {
            reservas.append('<p>Nenhuma reserva registada.</p>');
        } else {
            estado.reservas.forEach((reserva) => {
                const item = $('<div>', { class: 'reserva-item' });
                item.html(`
                    <div>
                        <strong>${reserva.nome}</strong><br>
                        <span>${reserva.data} às ${reserva.hora}</span><br>
                        <span>${reserva.pessoas} pessoas · ${reserva.mesa}</span>
                    </div>
                    <div>
                        <span class="status-badge ${reserva.status}">${reserva.status}</span>
                        <small>Taxa: ${formatarMoeda(reserva.taxa || 200)}</small>
                    </div>
                `);
                reservas.append(item);
            });
        }

        relatorio.append(reservas);
    }

    function renderCaixa() {
        const lista = $('#caixa-lista');
        lista.empty();

        const aprovacoes = [
            ...estado.orders.map((pedido) => ({
                tipo: 'pedido',
                id: pedido.id,
                nome: pedido.cliente,
                valor: pedido.total,
                data: pedido.data,
                email: pedido.email,
                status: 'pendente',
                item: pedido
            })),
            ...estado.reservas.map((reserva) => ({
                tipo: 'reserva',
                id: reserva.id,
                nome: reserva.nome,
                valor: Number(reserva.taxa || 200),
                data: `${reserva.data} ${reserva.hora}`,
                email: '',
                status: reserva.status,
                item: reserva
            }))
        ];

        if (!aprovacoes.length) {
            lista.append('<div class="caixa-item"><span>Nenhum pagamento pendente.</span></div>');
            return;
        }

        aprovacoes.forEach((aprovacao) => {
            const item = $('<div>', { class: 'caixa-item' });
            const dados = $('<div>').html(`<strong>${aprovacao.nome}</strong><br><span>${aprovacao.tipo === 'pedido' ? 'Pedido' : 'Reserva'}</span><br><span>${aprovacao.data}</span><br><span>${formatarMoeda(aprovacao.valor)}</span>`);
            const acoes = $('<div>', { class: 'acoes' });

            const confirmar = $('<button>', { type: 'button', class: 'btn-mini email', text: aprovacao.tipo === 'pedido' ? 'Aprovar pagamento' : 'Confirmar reserva' });
            confirmar.on('click', function () {
                if (aprovacao.tipo === 'pedido') {
                    const recibo = gerarRecibo(aprovacao.item);
                    const pedidoIndex = estado.orders.findIndex(p => p.id === aprovacao.item.id);
                    if (pedidoIndex >= 0) {
                        estado.orders[pedidoIndex].statusPagamento = 'aprovado';
                    }
                    enviarReciboPorEmail(aprovacao.email, aprovacao.nome, recibo);
                    const janela = window.open('', '_blank');
                    janela.document.write(criarHtmlRecibo(recibo));
                    janela.document.close();
                    janela.focus();
                    janela.print();
                } else {
                    const reservaIndex = estado.reservas.findIndex(r => r.id === aprovacao.item.id);
                    if (reservaIndex >= 0) {
                        estado.reservas[reservaIndex].status = 'confirmada';
                    }
                    salvarEstado();
                    renderRelatorio();
                    renderCaixa();
                    $('#reserva-mensagem').text(`Reserva confirmada para ${aprovacao.nome}. Taxa recebida e recibo emitido.`);
                }
            });

            const verDigital = $('<button>', { type: 'button', class: 'btn-mini email', text: 'Ver digital' });
            verDigital.on('click', function () {
                const janela = window.open('', '_blank');
                const html = aprovacao.tipo === 'pedido' ? criarHtmlRecibo(aprovacao.item) : criarHtmlReserva(aprovacao.item);
                janela.document.write(html);
                janela.document.close();
            });

            acoes.append(confirmar, verDigital);
            item.append(dados, acoes);
            lista.append(item);
        });
    }

    function criarHtmlRecibo(recibo) {
        const itens = recibo.itens.map(item => `<li>${item.nome} x${item.quantidade} — ${formatarMoeda(item.preco * item.quantidade)}</li>`).join('');
        return `
            <html>
            <head><title>Recibo digital</title></head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #333;">
                <h2>Recibo Digital</h2>
                <p><strong>Cliente:</strong> ${recibo.cliente}</p>
                <p><strong>Email:</strong> ${recibo.email}</p>
                <p><strong>Data:</strong> ${recibo.data}</p>
                <p><strong>Tipo:</strong> ${recibo.tipoPedido}</p>
                <ul>${itens}</ul>
                <p><strong>Total:</strong> ${formatarMoeda(recibo.total)}</p>
                <p><strong>Responsável:</strong> ${recibo.usuarioResponsavel || 'Sistema'}</p>
            </body>
            </html>
        `;
    }

    function criarHtmlReserva(reserva) {
        return `
            <html>
            <head><title>Recibo da reserva</title></head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #333;">
                <h2>Recibo da reserva</h2>
                <p><strong>Cliente:</strong> ${reserva.nome}</p>
                <p><strong>Telefone:</strong> ${reserva.telefone}</p>
                <p><strong>Data:</strong> ${reserva.data} às ${reserva.hora}</p>
                <p><strong>Mesas:</strong> ${reserva.mesa}</p>
                <p><strong>Pessoas:</strong> ${reserva.pessoas}</p>
                <p><strong>Taxa de confirmação:</strong> ${formatarMoeda(reserva.taxa || 200)}</p>
            </body>
            </html>
        `;
    }

    function gerarRecibo(order) {
        const recibo = {
            id: order.id,
            cliente: order.cliente,
            email: order.email,
            tipoPedido: order.tipoPedido,
            total: order.total,
            itens: order.itens,
            data: new Date().toLocaleString(),
            usuarioResponsavel: usuarioLogado ? usuarioLogado.nome : 'Sistema',
            enviadoEmail: false
        };

        const jaExiste = estado.receipts.find(item => item.id === order.id);
        if (!jaExiste) {
            estado.receipts.unshift(recibo);
        }

        salvarEstado();
        renderRelatorio();
        renderCaixa();
        return recibo;
    }

    function enviarReciboPorEmail(email, nome, reciboOriginal) {
        const recibo = reciboOriginal || { cliente: nome, email, data: new Date().toLocaleString(), tipoPedido: 'pedido', total: 0, itens: [], usuarioResponsavel: usuarioLogado ? usuarioLogado.nome : 'Sistema', enviadoEmail: false };
        const assunto = encodeURIComponent('Recibo digital da sua compra');
        const corpo = encodeURIComponent(`Olá ${nome},\n\nSegue o seu recibo digital:\n\nEmitido por: ${recibo.usuarioResponsavel}\n\n${recibo.itens.map(item => `${item.nome} x${item.quantidade} - ${formatarMoeda(item.preco * item.quantidade)}`).join('\n')}\n\nTotal: ${formatarMoeda(recibo.total)}\n\nObrigado pela preferência!`);

        if (email) {
            window.location.href = `mailto:${email}?subject=${assunto}&body=${corpo}`;
        }

        if (reciboOriginal) {
            recibo.enviadoEmail = true;
            const existente = estado.receipts.find(item => item.id === reciboOriginal.id);
            if (existente) existente.enviadoEmail = true;
        }

        salvarEstado();
        renderRelatorio();
    }

    function entrarNoSistema(usuario, senha) {
        const conta = USERS.find(item => (item.usuario === usuario || item.email === usuario) && item.senha === senha);
        if (!conta) {
            $('#login-mensagem').text('Utilizador ou palavra-passe inválidos.');
            return;
        }

        usuarioLogado = { nome: conta.nome, usuario: conta.usuario, email: conta.email, role: conta.role, telefone: conta.telefone || '' };
        $('body').addClass('logado');
        $('#usuario-ativo').text(`${conta.nome} (${conta.role})`);
        $('#dashboard').removeClass('oculto').show();
        $('#login-mensagem').text(`Bem-vindo(a), ${conta.nome}.`);
        aplicarPermissoesAcesso(conta.role);

        const tabsPermitidos = {
            admin: ['admin', 'garcom', 'delivery', 'caixa'],
            garcom: ['garcom'],
            delivery: ['delivery'],
            caixa: ['caixa'],
            cliente: ['garcom']
        };

        $('.dashboard-tab').hide().removeClass('ativo').addClass('hidden');
        $('.dashboard-panel').hide().removeClass('ativo');

        const tabs = tabsPermitidos[conta.role] || ['garcom'];
        tabs.forEach((role) => {
            const tab = $(`.dashboard-tab[data-role="${role}"]`);
            const painel = $(`.dashboard-panel[data-panel="${role}"]`);
            tab.show().removeClass('hidden');
            painel.show();
        });

        const painelInicial = tabs[0];
        $(`.dashboard-tab[data-role="${painelInicial}"]`).addClass('ativo');
        $(`.dashboard-panel[data-panel="${painelInicial}"]`).addClass('ativo').show();

        renderGarcom();
        renderDelivery();
        renderAdminMenu();
        renderRelatorio();
        renderCaixa();
    }

    function redefinirSenha(identificador, novaSenha) {
        const conta = USERS.find(item => item.usuario === identificador || item.email === identificador);

        if (!conta) {
            $('#login-mensagem').text('Não foi encontrado nenhum utilizador com esses dados.');
            return false;
        }

        if (!novaSenha || novaSenha.length < 4) {
            $('#login-mensagem').text('A nova palavra-passe deve ter pelo menos 4 caracteres.');
            return false;
        }

        conta.senha = novaSenha;
        salvarUsuarios();
        $('#login-mensagem').text(`Palavra-passe redefinida com sucesso para ${conta.nome}.`);
        return true;
    }

    function aplicarPermissoesAcesso(role) {
        const eCliente = role === 'cliente';
        $('body').toggleClass('modo-cliente', eCliente).toggleClass('modo-funcionario', !eCliente);
        $('#site-aplicacao').toggle(eCliente);
        $('#menu').toggle(eCliente);
        $('#pedido').toggle(eCliente);
        $('#btn-confirmar-pedido').prop('disabled', !eCliente);

        if (!eCliente) {
            $('#pedido-status').text('Apenas o cliente pode fazer pedidos e confirmar encomendas.');
        }
    }

    function sairDoSistema() {
        usuarioLogado = null;
        $('body').removeClass('logado');
        $('#dashboard').addClass('oculto').hide();
        $('#form-login')[0].reset();
        $('#recuperar-senha-box').addClass('oculto');
        $('#form-recuperar-senha')[0].reset();
        $('#pedido-status').text('');
        $('#login-mensagem').text('Sessão terminada.');
    }

    function obterImagem(nome) {
        const imagens = {
            'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
            'Bife': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
            'Massa': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80',
            'Esparguete': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80',
            'Sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
            'Kebab': 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
            'Wrap': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80',
            'Camarão': 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
            'Peixe': 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=900&q=80',
            'Frango': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
            'Sobremesa': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
            'Bebida': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80'
        };

        const match = Object.entries(imagens).find(([termo]) => nome.toLowerCase().includes(termo.toLowerCase()));
        return match ? match[1] : 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80';
    }

    function mostrarCategoria(chave, resetar = true) {
        const categoria = categorias[chave];
        if (!categoria) return;

        categoriaAtual = chave;
        if (resetar) itensExibidos = 15;

        const totalItens = categoria.itens.length;
        const itensMostrados = Math.min(itensExibidos, totalItens);
        $('#categoria-descricao').text(`${categoria.descricao} ${itensMostrados} de ${totalItens} opções exibidas.`);
        const lista = $('#menu-pratos');
        lista.empty();

        categoria.itens.slice(0, itensMostrados).forEach(([nome, preco]) => {
            const cartao = $('<article>', { class: 'prato' });
            const conteudo = $('<div>', { class: 'prato-conteudo' });
            const quantidadeWrap = $('<div>', { class: 'quantidade-controle' });
            const menos = $('<button>', { type: 'button', class: 'btn-quantidade', text: '−' });
            const quantidade = $('<input>', { type: 'number', min: 1, max: 99, value: 1, 'aria-label': `Quantidade de ${nome}` });
            const mais = $('<button>', { type: 'button', class: 'btn-quantidade', text: '+' });
            const adicionar = $('<button>', { type: 'button', class: 'btn btn-primary', text: 'Adicionar ao pedido', 'aria-label': `Adicionar ${nome} ao pedido` });

            menos.on('click', function () {
                const atual = Number(quantidade.val()) || 1;
                quantidade.val(Math.max(1, atual - 1));
            });

            mais.on('click', function () {
                const atual = Number(quantidade.val()) || 1;
                quantidade.val(Math.min(99, atual + 1));
            });

            adicionar.on('click', function () {
                const qtd = Number(quantidade.val()) || 1;
                const existente = pedido.find(item => item.nome === nome);
                if (existente) existente.quantidade += qtd;
                else pedido.push({ nome, preco, quantidade: qtd });
                atualizarResumoPedido();
                $('html, body').animate({ scrollTop: $('#pedido').offset().top - 80 }, 500);
            });

            $('<img>', { class: 'prato-imagem', src: obterImagem(nome), alt: nome, loading: 'lazy', decoding: 'async' }).appendTo(cartao);
            $('<span>', { class: 'prato-categoria', text: categoria.nome }).appendTo(conteudo);
            $('<h3>', { text: nome }).appendTo(conteudo);
            $('<p>', { text: categoria.frase }).appendTo(conteudo);
            $('<strong>', { text: `${preco} MT` }).appendTo(conteudo);

            quantidadeWrap.append(menos, quantidade, mais);
            quantidadeWrap.appendTo(conteudo);
            adicionar.appendTo(conteudo);
            conteudo.appendTo(cartao);
            cartao.appendTo(lista);
        });

        const botaoVerMais = $('#mostrar-mais');
        if (itensMostrados >= totalItens) botaoVerMais.attr('hidden', true);
        else {
            botaoVerMais.removeAttr('hidden');
            botaoVerMais.text(`Ver mais (${Math.min(8, totalItens - itensMostrados)} a mais)`);
        }
    }

    function atualizarResumoPedido() {
        if (!pedido.length) {
            $('#pedido-resumo-lista').html('<li>Nenhum prato adicionado ainda.</li>');
            $('#pedido-total').text('0 MT');
            $('#taxa-delivery').text('0 MT');
            return;
        }

        let total = 0;
        $('#pedido-resumo-lista').empty();

        pedido.forEach(item => {
            const valorItem = item.preco * item.quantidade;
            total += valorItem;
            $('<li>', { html: `<span>${item.nome} x${item.quantidade}</span><strong>${valorItem} MT</strong>` }).appendTo('#pedido-resumo-lista');
        });

        $('#pedido-total').text(`${total} MT`);
        const tipoPedido = $('input[name="tipo-pedido"]:checked').val();
        const taxa = tipoPedido === 'delivery' ? 150 : 0;
        $('#taxa-delivery').text(`${taxa} MT`);
    }

    function confirmarPedido() {
        if (!usuarioLogado || usuarioLogado.role !== 'cliente') {
            $('#pedido-status').text('Apenas o cliente pode confirmar pedidos.');
            return;
        }

        const nome = $('#nome-pedido').val().trim();
        const email = $('#email-pedido').val().trim();
        const telefone = $('#telefone-pedido').val().trim();
        const local = $('#local-pedido').val().trim();
        const tipoPedido = $('input[name="tipo-pedido"]:checked').val();

        if (!pedido.length) {
            $('#pedido-status').text('Adicione pelo menos um prato antes de confirmar.');
            return;
        }

        if (!nome || !email || !telefone || !local) {
            $('#pedido-status').text('Preencha nome, email, contacto e mesa/endereço antes de confirmar.');
            return;
        }

        const taxaEntrega = tipoPedido === 'delivery' ? 150 : 0;
        const totalPedido = pedido.reduce((soma, item) => soma + (item.preco * item.quantidade), 0) + taxaEntrega;
        const novoPedido = {
            id: Date.now(),
            cliente: nome,
            email,
            telefone,
            local,
            tipoPedido,
            total: totalPedido,
            taxaEntrega,
            itens: pedido.map(item => ({ ...item })),
            data: new Date().toLocaleString()
        };

        estado.orders.unshift(novoPedido);
        salvarEstado();
        renderGarcom();
        renderDelivery();
        renderRelatorio();

        const recibo = gerarRecibo(novoPedido);
        $('#pedido-status').text(`Pedido confirmado para ${nome}. Recibo gerado e pronto para envio.`);
        $('#nome-pedido').val('');
        $('#email-pedido').val('');
        $('#telefone-pedido').val('');
        $('#local-pedido').val('');
        pedido.length = 0;
        atualizarResumoPedido();
        enviarReciboPorEmail(email, nome, recibo);
    }

    function inicializarEventos() {
        const menu = $('nav#nav-esquerda ul.menu-principal');
        const btnMenu = $('#menu-toggle');
        const btnClose = $('#menu-close');
        const nav = $('#nav-esquerda');
        let ultimoScroll = 0;

        function atualizarPosicaoNav() {
            const scrollAtual = $(window).scrollTop();
            const deslocamento = scrollAtual > ultimoScroll ? 18 : -10;
            nav.css('transform', `translateX(-50%) translateY(${deslocamento}px)`);
            ultimoScroll = scrollAtual;
        }

        $(window).on('scroll', atualizarPosicaoNav);

        function mostrarMenu() { menu.css('display', 'flex').removeClass('animate__fadeOutRight').addClass('animate__animated animate__fadeInRight animate__slow'); btnMenu.css('display', 'none'); btnClose.css('display', 'flex'); }
        function esconderMenu() { menu.css('display', 'none').removeClass('animate__animated animate__fadeInRight animate__fadeOutRight'); btnMenu.css('display', 'flex'); btnClose.css('display', 'none'); }

        btnMenu.on('click', mostrarMenu);
        btnClose.on('click', esconderMenu);

        $('.categoria-btn').on('click', function () {
            $('.categoria-btn').removeClass('ativo').attr('aria-selected', 'false');
            $(this).addClass('ativo').attr('aria-selected', 'true');
            mostrarCategoria($(this).data('categoria'));
        });

        $('input[name="tipo-pedido"]').on('change', atualizarResumoPedido);

        $('#btn-localizacao').on('click', function () {
            if (!navigator.geolocation) {
                $('#localizacao-status').text('Geolocalização não suportada pelo navegador.');
                return;
            }

            $('#localizacao-status').text('A obter a sua localização...');
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude.toFixed(5);
                const longitude = position.coords.longitude.toFixed(5);
                $('#local-pedido').val(`Delivery em: Lat ${latitude}, Lng ${longitude}`);
                $('#localizacao-status').text('Localização obtida. O restaurante vai confirmar o melhor ponto de entrega.');
                $('#tipo-pedido-delivery').prop('checked', true);
                atualizarResumoPedido();
            }, function () {
                $('#localizacao-status').text('Não foi possível obter a localização. Digite o endereço manualmente.');
            }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
        });

        $('#btn-confirmar-pedido').on('click', confirmarPedido);

        $('#form-login').on('submit', function (event) {
            event.preventDefault();
            const usuario = $('#usuario-login').val().trim().toLowerCase();
            const senha = $('#senha-login').val().trim();
            entrarNoSistema(usuario, senha);
        });

        $('#btn-logout').on('click', sairDoSistema);

        $('#btn-criar-conta').on('click', function () {
            $('#cadastro-box').removeClass('oculto');
            $('#recuperar-senha-box').addClass('oculto');
            $('#nome-cadastro').focus();
        });

        $('#btn-cancelar-cadastro').on('click', function () {
            $('#cadastro-box').addClass('oculto');
            $('#form-cadastro')[0].reset();
        });

        $('#form-cadastro').on('submit', function (event) {
            event.preventDefault();
            const nome = $('#nome-cadastro').val().trim();
            const email = $('#email-cadastro').val().trim();
            const telefone = $('#telefone-cadastro').val().trim();
            const senha = $('#senha-cadastro').val().trim();

            if (cadastrarCliente(nome, email, telefone, senha)) {
                $('#cadastro-box').addClass('oculto');
                $('#form-cadastro')[0].reset();
            }
        });

        $('#btn-recuperar-senha').on('click', function () {
            $('#recuperar-senha-box').removeClass('oculto');
            $('#cadastro-box').addClass('oculto');
            $('#usuario-recuperar').focus();
        });

        $('#btn-cancelar-recuperacao').on('click', function () {
            $('#recuperar-senha-box').addClass('oculto');
            $('#form-recuperar-senha')[0].reset();
        });

        $('#form-recuperar-senha').on('submit', function (event) {
            event.preventDefault();
            const identificador = $('#usuario-recuperar').val().trim().toLowerCase();
            const novaSenha = $('#nova-senha').val().trim();

            if (!identificador || !novaSenha) {
                $('#login-mensagem').text('Preencha o utilizador/e-mail e a nova palavra-passe.');
                return;
            }

            const redefiniu = redefinirSenha(identificador, novaSenha);
            if (redefiniu) {
                $('#recuperar-senha-box').addClass('oculto');
                $('#form-recuperar-senha')[0].reset();
                $('#usuario-login').val(identificador);
                $('#senha-login').val(novaSenha);
            }
        });

        $('.dashboard-tab').on('click', function () {
            const role = $(this).data('role');
            $('.dashboard-tab').removeClass('ativo');
            $(this).addClass('ativo');
            $('.dashboard-panel').removeClass('ativo');
            $(`.dashboard-panel[data-panel="${role}"]`).addClass('ativo');
        });

        $('#form-admin-menu').on('submit', function (event) {
            event.preventDefault();
            const nome = $('#admin-prato-nome').val().trim();
            const preco = Number($('#admin-prato-preco').val());
            const categoria = $('#admin-prato-categoria').val();

            if (!nome || !preco || !categoria) {
                $('#login-mensagem').text('Preencha corretamente o nome, preço e categoria.');
                return;
            }

            const editInfo = $(this).data('edit');
            if (editInfo) {
                categorias[editInfo.categoria].itens[editInfo.index] = [nome, preco];
                $(this).removeData('edit');
            } else {
                categorias[categoria].itens.push([nome, preco]);
            }

            salvarEstado();
            renderAdminMenu();
            renderRelatorio();
            this.reset();
        });

        $('#btn-limpar-admin').on('click', function () {
            $('#form-admin-menu').removeData('edit');
            $('#form-admin-menu')[0].reset();
        });

        $('#form-reserva').on('submit', function (event) {
            event.preventDefault();
            const nome = $('#nome-reserva').val().trim();
            const telefone = $('#telefone-reserva').val().trim();
            const data = $('#data-reserva').val();
            const hora = $('#hora-reserva').val();
            const pessoas = Number($('#pessoas-reserva').val());
            const taxa = 200;

            if (!nome || !telefone || !data || !hora || !pessoas) {
                $('#reserva-mensagem').text('Preencha todos os campos da reserva.');
                return;
            }

            const novaReserva = {
                id: Date.now(),
                nome,
                telefone,
                data,
                hora,
                pessoas,
                mesa: `Mesa ${Math.max(1, Math.min(10, pessoas))}`,
                taxa,
                status: 'pendente',
                dataConfirmacao: new Date().toLocaleString()
            };

            estado.reservas.unshift(novaReserva);
            salvarEstado();
            renderRelatorio();
            renderCaixa();

            $('#reserva-mensagem').text(`Reserva registada para ${nome} em ${data} às ${hora}. Taxa de confirmação: ${taxa} MT. Aguardando aprovação do caixa.`);
            this.reset();
            $('#pessoas-reserva').val('2');
        });

        $('#mostrar-mais').on('click', function () {
            itensExibidos = Math.min(itensExibidos + 8, categorias[categoriaAtual].itens.length);
            mostrarCategoria(categoriaAtual, false);
        });
    }

    inicializarEventos();
    renderGarcom();
    renderDelivery();
    renderAdminMenu();
    renderRelatorio();
    renderCaixa();
    mostrarCategoria('pequeno-almoco');
    atualizarResumoPedido();
});
