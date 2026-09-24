$(function () {
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

    function mostrarMenu() {
        menu.css('display', 'flex')
            .removeClass('animate__fadeOutRight')
            .addClass('animate__animated animate__fadeInRight animate__slow');
        btnMenu.css('display', 'none');
        btnClose.css('display', 'flex');
    }

    function esconderMenu() {
        menu.css('display', 'none')
            .removeClass('animate__animated animate__fadeInRight animate__fadeOutRight');
        btnMenu.css('display', 'flex');
        btnClose.css('display', 'none');
    }

    btnMenu.on('click', mostrarMenu);
    btnClose.on('click', esconderMenu);

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

    const lista = $('#menu-pratos');
    const descricao = $('#categoria-descricao');
    const botaoVerMais = $('#mostrar-mais');
    const pedidoLista = $('#pedido-resumo-lista');
    const pedidoTotal = $('#pedido-total');
    const taxaDelivery = $('#taxa-delivery');
    const btnLocalizacao = $('#btn-localizacao');
    const statusLocalizacao = $('#localizacao-status');
    const nomePedido = $('#nome-pedido');
    const localPedido = $('#local-pedido');
    const pedido = [];
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

    let categoriaAtual = 'pequeno-almoco';
    let itensExibidos = 15;

    function obterImagem(nome) {
        const imagem = Object.entries(imagens).find(([termo]) => nome.toLowerCase().includes(termo.toLowerCase()));
        return imagem ? imagem[1] : 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80';
    }

    function mostrarCategoria(chave, resetar = true) {
        const categoria = categorias[chave];
        if (!categoria) return;

        categoriaAtual = chave;
        if (resetar) {
            itensExibidos = 15;
        }

        const totalItens = categoria.itens.length;
        const itensMostrados = Math.min(itensExibidos, totalItens);

        descricao.text(`${categoria.descricao} ${itensMostrados} de ${totalItens} opções exibidas.`);
        lista.empty();

        categoria.itens.slice(0, itensMostrados).forEach(([nome, preco]) => {
            const cartao = $('<article>', { class: 'prato' });
            const conteudo = $('<div>', { class: 'prato-conteudo' });
            const imagem = obterImagem(nome);
            const quantidadeWrap = $('<div>', { class: 'quantidade-controle' });
            const btnMenos = $('<button>', { type: 'button', class: 'btn-quantidade', text: '−' });
            const inputQuantidade = $('<input>', {
                type: 'number',
                min: 1,
                max: 99,
                value: 1,
                'aria-label': `Quantidade de ${nome}`
            });
            const btnMais = $('<button>', { type: 'button', class: 'btn-quantidade', text: '+' });
            const btnPedido = $('<button>', {
                type: 'button',
                class: 'btn btn-primary',
                text: 'Adicionar ao pedido',
                'aria-label': `Adicionar ${nome} ao pedido`
            });

            btnMenos.on('click', function () {
                const valor = Number(inputQuantidade.val()) || 1;
                inputQuantidade.val(Math.max(1, valor - 1));
            });

            btnMais.on('click', function () {
                const valor = Number(inputQuantidade.val()) || 1;
                inputQuantidade.val(Math.min(99, valor + 1));
            });

            btnPedido.on('click', function () {
                const qtd = Number(inputQuantidade.val()) || 1;
                const itemExistente = pedido.find(item => item.nome === nome);

                if (itemExistente) {
                    itemExistente.quantidade += qtd;
                } else {
                    pedido.push({ nome, preco, quantidade: qtd });
                }

                atualizarResumoPedido();
                $('html, body').animate({ scrollTop: $('#pedido').offset().top - 80 }, 500);
            });

            $('<img>', {
                class: 'prato-imagem',
                src: imagem,
                alt: nome,
                loading: 'lazy',
                decoding: 'async'
            }).appendTo(cartao);

            $('<span>', { class: 'prato-categoria', text: categoria.nome }).appendTo(conteudo);
            $('<h3>', { text: nome }).appendTo(conteudo);
            $('<p>', { text: categoria.frase }).appendTo(conteudo);
            $('<strong>', { text: `${preco} MT` }).appendTo(conteudo);

            quantidadeWrap.append(btnMenos, inputQuantidade, btnMais);
            quantidadeWrap.appendTo(conteudo);
            btnPedido.appendTo(conteudo);

            conteudo.appendTo(cartao);
            cartao.appendTo(lista);
        });

        if (itensMostrados >= totalItens) {
            botaoVerMais.attr('hidden', true);
        } else {
            botaoVerMais.removeAttr('hidden');
            botaoVerMais.text(`Ver mais (${Math.min(8, totalItens - itensMostrados)} a mais)`);
        }
    }

    $('.categoria-btn').on('click', function () {
        $('.categoria-btn').removeClass('ativo').attr('aria-selected', 'false');
        $(this).addClass('ativo').attr('aria-selected', 'true');
        mostrarCategoria($(this).data('categoria'));
    });

    function atualizarResumoPedido() {
        if (!pedido.length) {
            pedidoLista.html('<li>Nenhum prato adicionado ainda.</li>');
            pedidoTotal.text('0 MT');
            taxaDelivery.text('0 MT');
            return;
        }

        let total = 0;
        pedidoLista.empty();

        pedido.forEach(item => {
            const valorItem = item.preco * item.quantidade;
            total += valorItem;
            $('<li>', {
                html: `<span>${item.nome} x${item.quantidade}</span><strong>${valorItem} MT</strong>`
            }).appendTo(pedidoLista);
        });

        pedidoTotal.text(`${total} MT`);

        const tipoPedido = $('input[name="tipo-pedido"]:checked').val();
        const taxa = tipoPedido === 'delivery' ? 150 : 0;
        taxaDelivery.text(`${taxa} MT`);
    }

    $('input[name="tipo-pedido"]').on('change', atualizarResumoPedido);

    btnLocalizacao.on('click', function () {
        if (!navigator.geolocation) {
            statusLocalizacao.text('Geolocalização não suportada pelo navegador.');
            return;
        }

        statusLocalizacao.text('A obter a sua localização...');
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude.toFixed(5);
            const longitude = position.coords.longitude.toFixed(5);
            localPedido.val(`Delivery em: Lat ${latitude}, Lng ${longitude}`);
            statusLocalizacao.text('Localização obtida. O restaurante vai confirmar o melhor ponto de entrega.');
            $('#tipo-pedido-delivery').prop('checked', true);
            atualizarResumoPedido();
        }, function () {
            statusLocalizacao.text('Não foi possível obter a localização. Digite o endereço manualmente.');
        }, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        });
    });

    $('.acesso-btn').on('click', function () {
        const acesso = $(this).data('acesso');

        $('.acesso-btn').removeClass('ativo').attr('aria-selected', 'false');
        $(this).addClass('ativo').attr('aria-selected', 'true');

        $('.acesso-painel').removeClass('ativo');
        $(`.acesso-painel[data-painel="${acesso}"]`).addClass('ativo');
    });

    $('#form-reserva').on('submit', function (event) {
        event.preventDefault();
        const nome = $('#nome-reserva').val().trim();
        const telefone = $('#telefone-reserva').val().trim();
        const data = $('#data-reserva').val();
        const hora = $('#hora-reserva').val();
        const pessoas = $('#pessoas-reserva').val();
        const taxa = 200;

        if (!nome || !telefone || !data || !hora || !pessoas) {
            $('#reserva-mensagem').text('Preencha todos os campos da reserva.');
            return;
        }

        $('#reserva-mensagem').text(`Reserva confirmada para ${nome} para ${pessoas} pessoas em ${data} às ${hora}. Taxa de confirmação: ${taxa} MT.`);
        this.reset();
        $('#pessoas-reserva').val('2');
    });

    botaoVerMais.on('click', function () {
        itensExibidos = Math.min(itensExibidos + 8, categorias[categoriaAtual].itens.length);
        mostrarCategoria(categoriaAtual, false);
    });

    mostrarCategoria('pequeno-almoco');
    atualizarResumoPedido();
});
