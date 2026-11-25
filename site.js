/* ============ SUPABASE ============ */
    const SUPABASE_URL = 'https://fzwkjrksbonirunfmexm.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_DJZq6j_mIhKJBLyQMex8eg_LGKyUOwI';

    let db = null;
    try {
      if (typeof supabase === 'undefined') throw new Error('CDN Supabase não carregou');
      db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('[OK] Supabase inicializado.');
    } catch (err) {
      console.error('[ERRO] Supabase:', err);
    }

    /* ============ ESTADO ============ */
    let cacheProjetos = [];
    let cacheProjetosPublicos = [];
    let confirmResolve = null;

    /* ============ UTILITÁRIOS ============ */
    function esc(str) {
      if (str == null) return '';
      return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function toast(msg, tipo = 'info', duracao = 3500) {
      const container = document.getElementById('toast-container');
      const el = document.createElement('div');
      el.className = 'toast ' + tipo;
      const icon = { sucesso: '✓', erro: '✕', info: 'ℹ' }[tipo] || 'ℹ';
      el.innerHTML = `<span style="font-weight:700;font-size:16px;">${icon}</span><span>${esc(msg)}</span>`;
      container.appendChild(el);
      setTimeout(() => { el.classList.add('saindo'); setTimeout(() => el.remove(), 300); }, duracao);
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
      if (confirmResolve) { confirmResolve(resposta); confirmResolve = null; }
    }

    function voltarAoTopo() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    function toggleMenu() { document.getElementById('nav-links').classList.toggle('mobile-open'); }

    /* ============ NAVEGAÇÃO ============ */
    function navegar(pagina) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));
      document.getElementById('nav-links').classList.remove('mobile-open');

      const paginaAlvo = document.getElementById('page-' + pagina);
      if (paginaAlvo) paginaAlvo.classList.add('active');

      const linkMenu = document.getElementById('nav-' + pagina);
      if (linkMenu) linkMenu.classList.add('active-link');

      window.scrollTo(0, 0);

      if (pagina === 'portfolio') carregarPortfolio();
    }

    /* ============ PORTFÓLIO PÚBLICO ============ */
    async function carregarPortfolio() {
      const grid = document.getElementById('grid-portfolio');
      if (!grid) return;
      if (!db) {
        grid.innerHTML = `<div class="estado erro"><h3>Erro de conexão</h3><p>Não foi possível conectar ao banco de dados.</p></div>`;
        return;
      }
      grid.innerHTML = `<div class="estado"><div class="spinner"></div><p>Carregando projetos...</p></div>`;
      try {
        const { data, error } = await db.from('projetos').select('*').eq('publicado', true).order('created_at', { ascending: false });
        if (error) throw error;
        cacheProjetosPublicos = data || [];
        renderizarPortfolio(cacheProjetosPublicos);
      } catch (err) {
        console.error('[portfolio]', err);
        grid.innerHTML = `<div class="estado erro"><h3>Erro ao carregar</h3><p>${esc(err.message)}</p></div>`;
      }
    }

    function renderizarPortfolio(projetos) {
      const grid = document.getElementById('grid-portfolio');
      const contadorNum = document.getElementById('contador-num');
      const contadorTxt = document.getElementById('contador-txt');
      if (contadorNum) contadorNum.textContent = projetos.length;
      if (contadorTxt) contadorTxt.textContent = projetos.length === 1 ? 'projeto' : 'projetos';

      if (projetos.length === 0) {
        grid.innerHTML = `<div class="estado"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg><h3>Nenhum projeto encontrado</h3><p>Tente outra busca ou aguarde novos projetos.</p></div>`;
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
            ${p.link_projeto ? `<a href="${esc(p.link_projeto)}" target="_blank" rel="noopener" class="btn btn-outline">Acessar Projeto →</a>` : ''}
          </div>
        </article>`).join('');
    }

    function filtrarProjetos() {
      const termo = document.getElementById('busca').value.toLowerCase().trim();
      if (!termo) { renderizarPortfolio(cacheProjetosPublicos); return; }
      const filtrados = cacheProjetosPublicos.filter(p =>
        (p.titulo || '').toLowerCase().includes(termo) ||
        (p.descricao || '').toLowerCase().includes(termo));
      renderizarPortfolio(filtrados);
    }

    /* ============ CONTATO ============ */
    document.getElementById('form-contato').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-enviar');
      const status = document.getElementById('status-contato');
      btn.textContent = 'Enviando...'; btn.disabled = true;
      status.textContent = ''; status.className = 'alerta';
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
        console.error('[contato]', err);
        status.className = 'alerta erro';
        status.style.color = 'var(--erro)';
        status.textContent = 'Erro: ' + err.message;
      } finally {
        btn.textContent = 'Enviar Mensagem'; btn.disabled = false;
      }
    });

    /* ============ ATALHOS ============ */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('confirm-modal').classList.contains('ativo')) fecharConfirm(false);
        else if (document.getElementById('admin-overlay').classList.contains('ativo')) fecharAdmin();
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (!document.getElementById('admin-overlay').classList.contains('ativo')) abrirAdmin();
      }
    });

    document.getElementById('admin-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'admin-overlay') fecharAdmin();
    });

    /* ============ INIT ============ */
    document.addEventListener('DOMContentLoaded', () => {
      carregarPortfolio();
      const anoEl = document.getElementById('footer-ano');
      if (anoEl) anoEl.textContent = new Date().getFullYear();
    });
