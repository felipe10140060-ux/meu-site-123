 // CONEXÃO SUPABASE OFICIAL
    const SUPABASE_URL = 'https://fzwkjrksbonirunfmexm.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_DJZq6j_mIhKJBLyQMex8eg_LGKyUOwI';

    const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    /* ================= 1. CARREGAR PORTFÓLIO ================= */
    async function carregarPortfolio() {
      const grid = document.getElementById('port-grid');
      const { data, error } = await db.from('projetos').select('*').eq('publicado', true).order('created_at', { ascending: false });
      if (error || !data || data.length === 0) { grid.innerHTML = '<p style="color:var(--cinza);">Nenhum projeto publicado no momento.</p>'; return; }
      grid.innerHTML = data.map(p => `
        <article class="port-card">
          ${p.imagem_url ? `<img src="${p.imagem_url}" class="port-img" alt="${p.titulo}">` : `<div class="port-img"></div>`}
          <div class="port-body"><h3>${p.titulo}</h3><p>${p.descricao || 'Sem descrição.'}</p>${p.link_projeto ? `<a href="${p.link_projeto}" target="_blank">Ver projeto &rarr;</a>` : ''}</div>
        </article>`).join('');
    }

    /* ================= 2. ENVIAR FORMULÁRIO DE CONTATO ================= */
    document.getElementById('form-contato').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-enviar');
      const status = document.getElementById('status-contato');
      btn.innerText = 'Enviando...'; btn.disabled = true; status.className = 'alerta'; status.innerText = '';

      const { error } = await db.from('leads').insert([{
        nome: document.getElementById('c-nome').value, telefone: document.getElementById('c-telefone').value,
        email: document.getElementById('c-email').value, assunto: document.getElementById('c-assunto').value,
        mensagem: document.getElementById('c-mensagem').value
      }]);

      btn.innerText = 'Enviar Mensagem'; btn.disabled = false;
      if (error) { status.className = 'alerta erro'; status.innerText = 'Erro: ' + error.message; } 
      else { status.className = 'alerta sucesso'; status.innerText = 'Mensagem enviada com sucesso!'; e.target.reset(); }
    });

    /* ================= 3. CONTROLE DO PAINEL ADMIN ================= */
    function abrirAdmin() {
      document.getElementById('admin-overlay').classList.add('ativo');
      db.auth.getSession().then(({ data }) => {
        if (data.session) mostrarDashboard();
        else { document.getElementById('tela-login').style.display = 'block'; document.getElementById('tela-dash').style.display = 'none'; }
      });
    }
    function fecharAdmin() { document.getElementById('admin-overlay').classList.remove('ativo'); }

    function mostrarDashboard() {
      document.getElementById('tela-login').style.display = 'none';
      document.getElementById('tela-dash').style.display = 'block';
      carregarLeads();
      carregarProjetosAdmin();
    }

    /* ================= 4. LOGIN ================= */
    document.getElementById('form-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-entrar');
      const status = document.getElementById('status-login');
      btn.innerText = 'Verificando...'; btn.disabled = true; status.className = 'alerta'; status.innerText = '';

      const { error } = await db.auth.signInWithPassword({
        email: document.getElementById('l-email').value, password: document.getElementById('l-senha').value
      });

      btn.innerText = 'Entrar no Painel'; btn.disabled = false;
      if (error) { status.className = 'alerta erro'; status.innerText = 'Acesso negado: ' + error.message; } 
      else { document.getElementById('form-login').reset(); mostrarDashboard(); }
    });

    /* ================= 5. LOGOUT ================= */
    async function sairDoPainel() {
      await db.auth.signOut(); fecharAdmin();
      document.getElementById('tela-login').style.display = 'block'; document.getElementById('tela-dash').style.display = 'none';
    }

    /* ================= 6. ABAS DO DASHBOARD ================= */
    function mudarAba(aba, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('ativo'));
      document.querySelectorAll('.tab-conteudo').forEach(c => c.classList.remove('ativo'));
      btn.classList.add('ativo'); document.getElementById('aba-' + aba).classList.add('ativo');
    }

    /* ================= 7. LER LEADS (MENSAGENS) ================= */
    async function carregarLeads() {
      const lista = document.getElementById('lista-leads');
      lista.innerHTML = '<p style="color:var(--cinza);">Buscando mensagens...</p>';
      const { data, error } = await db.from('leads').select('*').order('created_at', { ascending: false });
      if (error) { lista.innerHTML = `<p class="alerta erro">Erro: ${error.message}</p>`; return; }
      if (!data || data.length === 0) { lista.innerHTML = '<p style="color:var(--cinza);">Nenhuma mensagem recebida ainda.</p>'; return; }
      lista.innerHTML = data.map(m => `
        <div class="lead-card">
          <div class="lead-header"><h3>${m.nome}</h3><small style="color:var(--cinza);">${new Date(m.created_at).toLocaleString('pt-BR')}</small></div>
          <div class="lead-info">📞 <strong>Telefone:</strong> ${m.telefone} <br>✉️ <strong>E-mail:</strong> ${m.email} <br>📌 <strong>Assunto:</strong> ${m.assunto} <br>🚦 <strong>Status:</strong> ${m.status ? m.status.toUpperCase() : 'PENDENTE'}</div>
          <div class="lead-msg">${m.mensagem}</div>
        </div>`).join('');
    }

    /* ================= 8. CRUD PROJETOS (ADMIN) ================= */
    let cacheProjetos = [];
    async function carregarProjetosAdmin() {
      const lista = document.getElementById('lista-projetos-admin');
      lista.innerHTML = '<p style="color:var(--cinza);">Carregando...</p>';
      const { data, error } = await db.from('projetos').select('*').order('created_at', { ascending: false });
      if (error) { lista.innerHTML = `<p class="alerta erro">Erro: ${error.message}</p>`; return; }
      cacheProjetos = data || [];
      if (cacheProjetos.length === 0) { lista.innerHTML = '<p style="color:var(--cinza);">Nenhum projeto cadastrado.</p>'; return; }
      lista.innerHTML = cacheProjetos.map(p => `
        <div class="proj-admin-card">
          ${p.imagem_url ? `<img src="${p.imagem_url}">` : `<div style="width:100px;height:70px;background:#000;border-radius:4px;"></div>`}
          <div class="proj-admin-info"><h4>${p.titulo} ${p.publicado ? '<span style="color:var(--sucesso);font-size:12px;">(Publicado)</span>' : '<span style="color:var(--erro);font-size:12px;">(Oculto)</span>'}</h4><small style="color:var(--cinza);">${p.descricao || ''}</small></div>
          <div class="proj-admin-botoes">
            <button class="btn btn-outline" onclick="editarProjeto('${p.id}')" style="padding:8px 12px; font-size:13px;">Editar</button>
            <button class="btn btn-perigo" onclick="excluirProjeto('${p.id}')" style="padding:8px 12px; font-size:13px;">Excluir</button>
          </div>
        </div>`).join('');
    }

    document.getElementById('form-projeto').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-salvar-proj'), status = document.getElementById('status-proj');
      const id = document.getElementById('p-id').value;
      const fileInput = document.getElementById('p-imagem');
      btn.innerText = 'Salvando...'; btn.disabled = true; status.className = 'alerta'; status.innerText = '';

      try {
        let imagem_url = null;
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const fileName = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
          const { error: uploadError } = await db.storage.from('projetos').upload(fileName, file);
          if (uploadError) throw new Error("Erro na imagem: " + uploadError.message);
          const { data: publicUrlData } = db.storage.from('projetos').getPublicUrl(fileName);
          imagem_url = publicUrlData.publicUrl;
        }
        const payload = {
          titulo: document.getElementById('p-titulo').value, descricao: document.getElementById('p-descricao').value,
          link_projeto: document.getElementById('p-link').value || null, publicado: document.getElementById('p-publicado').checked
        };
        if (imagem_url) payload.imagem_url = imagem_url;

        let error;
        if (id) { ({ error } = await db.from('projetos').update(payload).eq('id', id)); } 
        else { ({ error } = await db.from('projetos').insert([payload])); }
        if (error) throw error;

        status.className = 'alerta sucesso'; status.innerText = 'Projeto salvo com sucesso!';
        limparFormProjeto(); carregarProjetosAdmin(); carregarPortfolio();
      } catch (err) { status.className = 'alerta erro'; status.innerText = err.message; } 
      finally { btn.innerText = 'Salvar Projeto'; btn.disabled = false; }
    });

    function editarProjeto(id) {
      const p = cacheProjetos.find(x => x.id === id); if (!p) return;
      document.getElementById('p-id').value = p.id; document.getElementById('p-titulo').value = p.titulo;
      document.getElementById('p-descricao').value = p.descricao || ''; document.getElementById('p-link').value = p.link_projeto || '';
      document.getElementById('p-publicado').checked = p.publicado; document.getElementById('p-imagem').value = '';
      document.getElementById('btn-cancelar-proj').style.display = 'inline-block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function excluirProjeto(id) {
      if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
      const { error } = await db.from('projetos').delete().eq('id', id);
      if (error) { alert('Erro ao excluir: ' + error.message); return; }
      carregarProjetosAdmin(); carregarPortfolio();
    }

    function limparFormProjeto() {
      document.getElementById('form-projeto').reset(); document.getElementById('p-id').value = '';
      document.getElementById('btn-cancelar-proj').style.display = 'none'; document.getElementById('status-proj').innerText = '';
    }

    /* ================= INICIALIZAÇÃO ================= */
    carregarPortfolio();
  