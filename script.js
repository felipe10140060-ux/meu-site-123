/* ================================================================
       CONFIGURAÇÃO SUPABASE
       ================================================================ */
    const SUPABASE_URL = 'https://fzwkjrksbonirunfmexm.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_DJZq6j_mIhKJBLyQMex8eg_LGKyUOwI';

    let db = null;
    try {
      if (typeof supabase === 'undefined') throw new Error('Biblioteca Supabase não carregou');
      db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('[OK] Supabase inicializado.');
    } catch (err) {
      console.error('[ERRO] Falha ao iniciar Supabase:', err);
    }

    /* ================================================================
       CONTEÚDO DAS MATÉRIAS (BLOG)
       ================================================================ */
    const materias = {
      1: {
        titulo: "Inteligência Artificial no Dia a Dia",
        meta: "Artigo 01 • Tecnologia & Sociedade",
        imagem: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
        texto: `
          <p>A Inteligência Artificial (IA) deixou de ser um tema de ficção científica para se tornar parte integrante do nosso cotidiano. Muitas vezes, nem percebemos, mas ela já está presente em ações simples. Quando o seu celular sugere a próxima palavra que você vai digitar no WhatsApp, ou quando o aplicativo de streaming recomenda aquele filme baseado no que você assistiu semana passada, a IA está trabalhando nos bastidores.</p>
          <p>No setor financeiro, os bancos utilizam IA para monitorar transações em tempo real. Se você tenta comprar algo em um horário incomum ou em uma cidade diferente, o sistema pode bloquear a compra preventivamente para proteger seu dinheiro. Isso é a IA analisando padrões de comportamento.</p>
          <p>Para nós, que estamos estudando tecnologia, entender como esses algoritmos funcionam é essencial. A IA não veio para substituir o ser humano, mas para automatizar o trabalho repetitivo, permitindo que foquemos no que realmente exige nossa criatividade e capacidade de resolver problemas complexos.</p>
        `
      },
      2: {
        titulo: "IA Revolucionando a Saúde",
        meta: "Artigo 02 • Inovação",
        imagem: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        texto: `
          <p>A área da saúde é uma das que mais se beneficia com o avanço da Inteligência Artificial. Algoritmos de aprendizado de máquina (Machine Learning) estão sendo treinados para analisar exames de imagem, como raios-X e ressonâncias magnéticas, com um nível de precisão que, em alguns casos, supera o olho humano.</p>
          <p>Isso permite que doenças como o câncer sejam detectadas em estágios muito iniciais, aumentando drasticamente as chances de cura dos pacientes. Além do diagnóstico, a IA também atua na descoberta de novos medicamentos. Em vez de testar milhares de combinações químicas em laboratório (o que levaria anos), os supercomputadores simulam essas interações em questão de dias.</p>
          <p>Com a telemedicina e o uso de dispositivos vestíveis (como relógios que medem batimentos cardíacos), a IA poderá prever ataques cardíacos antes mesmo de eles acontecerem, salvando milhares de vidas.</p>
        `
      },
      3: {
        titulo: "O Futuro da Educação com a IA",
        meta: "Artigo 03 • Educação",
        imagem: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
        texto: `
          <p>A educação está passando por uma transformação profunda com o auxílio da Inteligência Artificial. O modelo tradicional de ensinar a mesma coisa para 40 alunos no mesmo ritmo está com os dias contados. A IA permite a chamada "aprendizagem adaptativa".</p>
          <p>Plataformas educacionais inteligentes podem identificar exatamente onde um aluno está tendo dificuldades e adaptar o conteúdo para as necessidades dele. Se um estudante aprende rápido, o sistema oferece desafios maiores. Se ele está com dificuldade em matemática, o sistema fornece exercícios e explicações extras naquele tópico específico.</p>
          <p>Além disso, ferramentas de IA podem ajudar os professores a corrigir provas e redações, economizando tempo precioso que pode ser usado para o contato humano e o mentoreamento dos alunos. O professor do futuro não será substituído pela IA, mas será um orientador que usa a tecnologia a seu favor.</p>
        `
      },
      4: {
        titulo: "O Mercado de Trabalho e a IA",
        meta: "Artigo 04 • Carreiras",
        imagem: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
        texto: `
          <p>"A IA vai roubar os meus empregos?" Essa é uma das perguntas mais comuns. A resposta curta é: profissões que fazem tarefas repetitivas e mecânicas serão automatizadas. No entanto, a IA também está criando novas funções que nem existiam há dez anos, como Engenheiro de Prompt, Especialista em Ética de IA e Auditor de Algoritmos.</p>
          <p>O segredo para não ser substituído é a adaptabilidade. Profissionais que aprendem a usar a IA como uma ferramenta de produtividade (copilots) se tornam muito mais valiosos. A tecnologia é uma aliada para aumentar a nossa capacidade de produzir e não uma inimiga.</p>
          <p>As habilidades mais valorizadas no futuro serão aquelas genuinamente humanas: empatia, criatividade, pensamento crítico e inteligência emocional. Saber programar será ótimo, mas saber resolver problemas complexos usando a tecnologia será o verdadeiro diferencial competitivo.</p>
        `
      },
      5: {
        titulo: "Ética, Segurança e os Limites da IA",
        meta: "Artigo 05 • Segurança Digital",
        imagem: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
        texto: `
          <p>A Inteligência Artificial é uma ferramenta incrível, mas como toda ferramenta poderosa, ela pode ser mal utilizada. A ética na IA é um dos temas mais discutidos atualmente. Como garantir que os algoritmos não perpetuem preconceitos ou discriminação? Isso acontece porque a IA aprende com os dados que recebe. Se os dados forem tendenciosos, a IA também será.</p>
          <p>Outro ponto crítico é a privacidade. Ferramentas de IA coletam quantidades massivas de dados para treinar seus modelos. Como proteger as informações pessoais dos usuários? Governos ao redor do mundo estão criando leis (como a LGPD no Brasil) para regulamentar o uso desses dados.</p>
          <p>Além disso, a segurança contra deepfakes (vídeos e áudios falsos criados por IA) é um desafio crescente. Desenvolver sistemas de detecção e promover a educação digital são passos fundamentais para vivermos em uma sociedade segura e ética na era da IA.</p>
        `
      }
    };

    /* ================================================================
       ESTADO GLOBAL
       ================================================================ */
    let cacheProjetos = [];
    let cacheProjetosPublicos = [];
    let confirmResolve = null;

    /* ================================================================
       UTILITÁRIOS
       ================================================================ */
    function esc(str) {
      if (str == null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function toast(msg, tipo = 'info', duracao = 3500) {
      const container = document.getElementById('toast-container');
      const el = document.createElement('div');
      el.className = 'toast ' + tipo;
      const icon = { sucesso: '✓', erro: '✕', info: 'ℹ' }[tipo] || 'ℹ';
      el.innerHTML = `<span style="font-weight:700;font-size:16px;">${icon}</span><span>${esc(msg)}</span>`;
      container.appendChild(el);
      setTimeout(() => {
        el.classList.add('saindo');
        setTimeout(() => el.remove(), 300);
      }, duracao);
    }

    function confirmar(titulo, msg) {
      return new Promise((resolve) => {
        confirmResolve = resolve;
        document.getElementById('confirm-titulo').textContent = titulo;
        document.getElementById('confirm-msg').textContent = msg;
        document.getElementById('confirm-modal').classList.add('ativo');
      });
    }

    function fecharConfirm(resposta) {
      document.getElementById('confirm-modal').classList.remove('ativo');
      if (confirmResolve) {
        confirmResolve(resposta);
        confirmResolve = null;
      }
    }

    /* ================================================================
       NAVEGAÇÃO SPA
       ================================================================ */
    function navegar(pagina) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));

      const paginaAlvo = document.getElementById('page-' + pagina);
      if (paginaAlvo) paginaAlvo.classList.add('active');

      const linkMenu = document.getElementById('nav-' + pagina);
      if (linkMenu) linkMenu.classList.add('active-link');

      window.scrollTo(0, 0);

      if (pagina === 'portfolio') {
        carregarPortfolio();
      }
    }

    /* ================================================================
       ABRIR MATÉRIA
       ================================================================ */
    function abrirMateria(id) {
      const materia = materias[id];
      if (!materia) return;

      document.getElementById('materia-meta').innerText = materia.meta;
      document.getElementById('materia-titulo').innerText = materia.titulo;
      document.getElementById('materia-conteudo').innerHTML = `
        <img src="${materia.imagem}" class="artigo-img-principal" alt="${materia.titulo}">
        <div class="artigo-texto">${materia.texto}</div>
      `;

      navegar('materia');
      document.title = materia.titulo + ' | Felipe Argolo';
    }

    /* ================================================================
       PORTFÓLIO PÚBLICO
       ================================================================ */
    async function carregarPortfolio() {
      const grid = document.getElementById('grid-portfolio');
      if (!grid) return;

      if (!db) {
        grid.innerHTML = `<div class="estado erro">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <h3>Erro de conexão</h3>
          <p>Não foi possível conectar ao banco de dados.</p>
        </div>`;
        return;
      }

      grid.innerHTML = `<div class="estado"><div class="spinner"></div><p>Carregando projetos...</p></div>`;

      try {
        const { data, error } = await db
          .from('projetos')
          .select('*')
          .eq('publicado', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        cacheProjetosPublicos = data || [];
        renderizarPortfolio(cacheProjetosPublicos);
      } catch (err) {
        console.error('[portfolio] Erro:', err);
        grid.innerHTML = `<div class="estado erro">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <h3>Erro ao carregar</h3>
          <p>${esc(err.message)}</p>
        </div>`;
      }
    }

    function renderizarPortfolio(projetos) {
      const grid = document.getElementById('grid-portfolio');
      const contadorNum = document.getElementById('contador-num');
      const contadorTxt = document.getElementById('contador-txt');

      contadorNum.textContent = projetos.length;
      contadorTxt.textContent = projetos.length === 1 ? 'projeto' : 'projetos';

      if (projetos.length === 0) {
        grid.innerHTML = `<div class="estado">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <h3>Nenhum projeto encontrado</h3>
          <p>Tente outra busca ou aguarde novos projetos.</p>
        </div>`;
        return;
      }

      grid.innerHTML = projetos.map((p, i) => `
        <article class="port-card" style="animation-delay:${Math.min(i * 40, 400)}ms">
          <div class="port-img-wrap">
            ${p.imagem_url
              ? `<img src="${esc(p.imagem_url)}" class="port-img" alt="${esc(p.titulo)}" loading="lazy" onerror="this.parentNode.innerHTML='<div class=&quot;port-img port-img-vazia&quot;>Imagem indisponível</div>'">`
              : `<div class="port-img port-img-vazia">Sem Imagem</div>`}
          </div>
          <div class="port-body">
            <h3>${esc(p.titulo)}</h3>
            <p>${esc(p.descricao || 'Sem descrição.')}</p>
            ${p.link_projeto ? `<a href="${esc(p.link_projeto)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Acessar Projeto →</a>` : ''}
          </div>
        </article>
      `).join('');
    }

    function filtrarProjetos() {
      const termo = document.getElementById('busca').value.toLowerCase().trim();
      if (!termo) {
        renderizarPortfolio(cacheProjetosPublicos);
        return;
      }
      const filtrados = cacheProjetosPublicos.filter(p =>
        (p.titulo || '').toLowerCase().includes(termo) ||
        (p.descricao || '').toLowerCase().includes(termo)
      );
      renderizarPortfolio(filtrados);
    }

    /* ================================================================
       ADMIN: ABRIR / FECHAR
       ================================================================ */
    function abrirAdmin() {
      document.getElementById('admin-overlay').classList.add('ativo');
      document.body.classList.add('bloqueado');

      if (!db) {
        toast('Erro: banco não conectado.', 'erro');
        return;
      }

      db.auth.getSession().then(({ data }) => {
        if (data.session) {
          mostrarDashboard();
        } else {
          document.getElementById('tela-login').style.display = 'block';
          document.getElementById('tela-dash').style.display = 'none';
          setTimeout(() => document.getElementById('l-email').focus(), 100);
        }
      });
    }

    function fecharAdmin() {
      document.getElementById('admin-overlay').classList.remove('ativo');
      document.body.classList.remove('bloqueado');
    }

    function mostrarDashboard() {
      document.getElementById('tela-login').style.display = 'none';
      document.getElementById('tela-dash').style.display = 'block';
      carregarTudoAdmin();
    }

    function carregarTudoAdmin() {
      carregarLeads();
      carregarProjetosAdmin();
    }

    /* ================================================================
       LOGIN
       ================================================================ */
    document.getElementById('form-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-entrar');
      const status = document.getElementById('status-login');

      btn.textContent = 'Verificando...';
      btn.disabled = true;
      status.textContent = '';
      status.style.color = '';

      try {
        const { error } = await db.auth.signInWithPassword({
          email: document.getElementById('l-email').value.trim(),
          password: document.getElementById('l-senha').value
        });
        if (error) throw error;

        document.getElementById('form-login').reset();
        toast('Login realizado com sucesso!', 'sucesso');
        mostrarDashboard();
      } catch (err) {
        console.error('[login] Erro:', err);
        status.style.color = 'var(--erro)';
        status.textContent = 'Acesso negado: ' + err.message;
      } finally {
        btn.textContent = 'Entrar no Painel';
        btn.disabled = false;
      }
    });

    /* ================================================================
       LOGOUT
       ================================================================ */
    async function sairDoPainel() {
      try {
        await db.auth.signOut();
        fecharAdmin();
        toast('Sessão encerrada.', 'info');
      } catch (err) {
        toast('Erro ao sair: ' + err.message, 'erro');
      }
    }

    /* ================================================================
       TABS
       ================================================================ */
    function mudarAba(aba, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('ativo'));
      document.querySelectorAll('.tab-conteudo').forEach(c => c.classList.remove('ativo'));
      btn.classList.add('ativo');
      document.getElementById('aba-' + aba).classList.add('ativo');
    }

    /* ================================================================
       LEADS
       ================================================================ */
    async function carregarLeads() {
      const lista = document.getElementById('lista-leads');
      lista.innerHTML = `<div class="estado"><div class="spinner"></div><p>Buscando mensagens...</p></div>`;

      try {
        const { data, error } = await db
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        document.getElementById('stat-leads').textContent = (data || []).length;

        if (!data || data.length === 0) {
          lista.innerHTML = `<div class="estado">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
            </svg>
            <h3>Nenhuma mensagem</h3>
            <p>Você ainda não recebeu contatos.</p>
          </div>`;
          return;
        }

        lista.innerHTML = data.map(m => `
          <div class="lead-card">
            <div class="lead-header">
              <h4>${esc(m.nome)}</h4>
              <time>${new Date(m.created_at).toLocaleString('pt-BR')}</time>
            </div>
            <div class="lead-info">
              📞 <strong>Telefone:</strong> ${esc(m.telefone)}<br>
              ✉️ <strong>E-mail:</strong> ${esc(m.email)}<br>
              📌 <strong>Assunto:</strong> ${esc(m.assunto)}
            </div>
            <div class="lead-msg">${esc(m.mensagem)}</div>
          </div>
        `).join('');
      } catch (err) {
        console.error('[leads] Erro:', err);
        lista.innerHTML = `<div class="estado erro"><h3>Erro ao carregar</h3><p>${esc(err.message)}</p></div>`;
      }
    }

    /* ================================================================
       PROJETOS ADMIN
       ================================================================ */
    async function carregarProjetosAdmin() {
      const lista = document.getElementById('lista-projetos-admin');
      lista.innerHTML = `<div class="estado"><div class="spinner"></div><p>Carregando...</p></div>`;

      try {
        const { data, error } = await db
          .from('projetos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        cacheProjetos = data || [];

        const pub = cacheProjetos.filter(p => p.publicado).length;
        document.getElementById('stat-projetos').textContent = cacheProjetos.length;
        document.getElementById('stat-publicados').textContent = pub;
        document.getElementById('stat-ocultos').textContent = cacheProjetos.length - pub;
        document.getElementById('num-projetos-admin').textContent = cacheProjetos.length;

        if (cacheProjetos.length === 0) {
          lista.innerHTML = `<div class="estado">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            </svg>
            <h3>Nenhum projeto cadastrado</h3>
            <p>Use o formulário acima para criar o primeiro.</p>
          </div>`;
          return;
        }

        lista.innerHTML = cacheProjetos.map(p => `
          <div class="proj-admin-card">
            ${p.imagem_url
              ? `<img src="${esc(p.imagem_url)}" alt="${esc(p.titulo)}">`
              : `<div class="sem-img">Sem Imagem</div>`}
            <div class="proj-admin-info">
              <h4>
                ${esc(p.titulo)}
                <span class="badge ${p.publicado ? 'badge-pub' : 'badge-oculto'}">
                  ${p.publicado ? 'Publicado' : 'Oculto'}
                </span>
              </h4>
              <small>${esc(p.descricao || '—')}</small>
            </div>
            <div class="proj-admin-botoes">
              <button class="btn btn-outline btn-pequeno" onclick="editarProjeto('${p.id}')">Editar</button>
              <button class="btn btn-perigo btn-pequeno" onclick="excluirProjeto('${p.id}')">Excluir</button>
            </div>
          </div>
        `).join('');
      } catch (err) {
        console.error('[projetos admin] Erro:', err);
        lista.innerHTML = `<div class="estado erro"><h3>Erro</h3><p>${esc(err.message)}</p></div>`;
      }
    }

    /* ================================================================
       SALVAR PROJETO
       ================================================================ */
    document.getElementById('form-projeto').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-salvar-proj');
      const id = document.getElementById('p-id').value;
      const fileInput = document.getElementById('p-imagem');

      btn.disabled = true;
      const txtOriginal = btn.innerHTML;
      btn.innerHTML = 'Salvando...';

      try {
        let imagem_url = null;

        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          if (file.size > 5 * 1024 * 1024) {
            throw new Error('Imagem muito grande (máx 5MB).');
          }
          const ext = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;

          const { error: upErr } = await db.storage.from('projetos').upload(fileName, file);
          if (upErr) throw new Error('Upload: ' + upErr.message);

          const { data: urlData } = db.storage.from('projetos').getPublicUrl(fileName);
          imagem_url = urlData.publicUrl;
        }

        const payload = {
          titulo: document.getElementById('p-titulo').value.trim(),
          descricao: document.getElementById('p-descricao').value.trim() || null,
          link_projeto: document.getElementById('p-link').value.trim() || null,
          publicado: document.getElementById('p-publicado').checked
        };
        if (imagem_url) payload.imagem_url = imagem_url;

        let error;
        if (id) {
          ({ error } = await db.from('projetos').update(payload).eq('id', id));
        } else {
          ({ error } = await db.from('projetos').insert([payload]));
        }
        if (error) throw error;

        toast(id ? 'Projeto atualizado!' : 'Projeto criado!', 'sucesso');
        limparFormProjeto();
        carregarProjetosAdmin();
        carregarPortfolio();
      } catch (err) {
        console.error('[salvar] Erro:', err);
        toast(err.message, 'erro');
      } finally {
        btn.innerHTML = txtOriginal;
        btn.disabled = false;
      }
    });

    /* ================================================================
       EDITAR / EXCLUIR / LIMPAR
       ================================================================ */
    function editarProjeto(id) {
      const p = cacheProjetos.find(x => x.id === id);
      if (!p) return;

      document.getElementById('p-id').value = p.id;
      document.getElementById('p-titulo').value = p.titulo || '';
      document.getElementById('p-descricao').value = p.descricao || '';
      document.getElementById('p-link').value = p.link_projeto || '';
      document.getElementById('p-publicado').checked = !!p.publicado;
      document.getElementById('p-imagem').value = '';

      document.getElementById('btn-cancelar-proj').style.display = 'inline-block';
      document.getElementById('p-titulo').focus();
      document.getElementById('aba-projetos').scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast('Editando projeto…', 'info', 2000);
    }

    async function excluirProjeto(id) {
      const ok = await confirmar('Excluir projeto?', 'Esta ação não pode ser desfeita.');
      if (!ok) return;

      try {
        const { error } = await db.from('projetos').delete().eq('id', id);
        if (error) throw error;
        toast('Projeto excluído.', 'sucesso');
        carregarProjetosAdmin();
        carregarPortfolio();
      } catch (err) {
        console.error('[excluir] Erro:', err);
        toast('Erro ao excluir: ' + err.message, 'erro');
      }
    }

    function limparFormProjeto() {
      document.getElementById('form-projeto').reset();
      document.getElementById('p-id').value = '';
      document.getElementById('btn-cancelar-proj').style.display = 'none';
    }

    /* ================================================================
       FORMULÁRIO DE CONTATO
       ================================================================ */
    document.getElementById('form-contato').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-enviar');
      const status = document.getElementById('status-contato');

      btn.textContent = 'Enviando...';
      btn.disabled = true;
      status.textContent = '';
      status.className = 'alerta';

      try {
        const { error } = await db.from('leads').insert([{
          nome: document.getElementById('c-nome').value.trim(),
          telefone: document.getElementById('c-telefone').value.trim(),
          email: document.getElementById('c-email').value.trim(),
          assunto: document.getElementById('c-assunto').value.trim(),
          mensagem: document.getElementById('c-mensagem').value.trim()
        }]);
        if (error) throw error;

        status.className = 'alerta sucesso';
        status.style.color = 'var(--sucesso)';
        status.textContent = 'Mensagem enviada com sucesso!';
        e.target.reset();
        toast('Mensagem enviada!', 'sucesso');
      } catch (err) {
        console.error('[contato] Erro:', err);
        status.className = 'alerta erro';
        status.style.color = 'var(--erro)';
        status.textContent = 'Erro: ' + err.message;
      } finally {
        btn.textContent = 'Enviar Mensagem';
        btn.disabled = false;
      }
    });

    /* ================================================================
       ATALHOS DE TECLADO
       ================================================================ */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('confirm-modal').classList.contains('ativo')) {
          fecharConfirm(false);
        } else if (document.getElementById('admin-overlay').classList.contains('ativo')) {
          fecharAdmin();
        }
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (!document.getElementById('admin-overlay').classList.contains('ativo')) {
          abrirAdmin();
        }
      }
    });

    /* ================================================================
       FECHAR ADMIN CLICANDO FORA
       ================================================================ */
    document.getElementById('admin-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'admin-overlay') fecharAdmin();
    });

    /* ================================================================
       INIT
       ================================================================ */
    document.addEventListener('DOMContentLoaded', () => {
      carregarPortfolio();
    });