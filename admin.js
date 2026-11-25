    /* ============ ADMIN ============ */
    function abrirAdmin() {
      document.getElementById('admin-overlay').classList.add('ativo');
      document.body.classList.add('bloqueado');
      if (!db) { toast('Erro: banco não conectado.', 'erro'); return; }
      db.auth.getSession().then(({ data }) => {
        if (data.session) mostrarDashboard();
        else {
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

    /* ============ LOGIN ============ */
    document.getElementById('form-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-entrar');
      const status = document.getElementById('status-login');
      btn.textContent = 'Verificando...'; btn.disabled = true;
      status.textContent = ''; status.style.color = '';
      try {
        const { error } = await db.auth.signInWithPassword({
          email: document.getElementById('l-email').value.trim(),
          password: document.getElementById('l-senha').value
        });
        if (error) throw error;
        document.getElementById('form-login').reset();
        toast('Login realizado!', 'sucesso');
        mostrarDashboard();
      } catch (err) {
        console.error('[login]', err);
        status.style.color = 'var(--erro)';
        status.textContent = 'Acesso negado: ' + err.message;
      } finally {
        btn.textContent = 'Entrar no Painel'; btn.disabled = false;
      }
    });

    /* ============ LOGOUT ============ */
    async function sairDoPainel() {
      try {
        await db.auth.signOut();
        fecharAdmin();
        toast('Sessão encerrada.', 'info');
      } catch (err) { toast('Erro: ' + err.message, 'erro'); }
    }

    /* ============ TABS ============ */
    function mudarAba(aba, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('ativo'));
      document.querySelectorAll('.tab-conteudo').forEach(c => c.classList.remove('ativo'));
      btn.classList.add('ativo');
      document.getElementById('aba-' + aba).classList.add('ativo');
    }

    /* ============ LEADS ============ */
    async function carregarLeads() {
      const lista = document.getElementById('lista-leads');
      lista.innerHTML = `<div class="estado"><div class="spinner"></div><p>Buscando...</p></div>`;
      try {
        const { data, error } = await db.from('leads').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        document.getElementById('stat-leads').textContent = (data || []).length;
        if (!data || data.length === 0) {
          lista.innerHTML = `<div class="estado"><h3>Nenhuma mensagem</h3><p>Você ainda não recebeu contatos.</p></div>`;
          return;
        }
        lista.innerHTML = data.map(m => `
          <div class="lead-card">
            <div class="lead-header"><h4>${esc(m.nome)}</h4><time>${new Date(m.created_at).toLocaleString('pt-BR')}</time></div>
            <div class="lead-info">📞 <strong>Telefone:</strong> ${esc(m.telefone)}<br>✉️ <strong>E-mail:</strong> ${esc(m.email)}<br>📌 <strong>Assunto:</strong> ${esc(m.assunto)}</div>
            <div class="lead-msg">${esc(m.mensagem)}</div>
          </div>`).join('');
      } catch (err) {
        console.error('[leads]', err);
        lista.innerHTML = `<div class="estado erro"><h3>Erro</h3><p>${esc(err.message)}</p></div>`;
      }
    }

    /* ============ PROJETOS ADMIN ============ */
    async function carregarProjetosAdmin() {
      const lista = document.getElementById('lista-projetos-admin');
      lista.innerHTML = `<div class="estado"><div class="spinner"></div><p>Carregando...</p></div>`;
      try {
        const { data, error } = await db.from('projetos').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        cacheProjetos = data || [];
        const pub = cacheProjetos.filter(p => p.publicado).length;
        document.getElementById('stat-projetos').textContent = cacheProjetos.length;
        document.getElementById('stat-publicados').textContent = pub;
        document.getElementById('stat-ocultos').textContent = cacheProjetos.length - pub;
        document.getElementById('num-projetos-admin').textContent = cacheProjetos.length;
        if (cacheProjetos.length === 0) {
          lista.innerHTML = `<div class="estado"><h3>Nenhum projeto</h3><p>Use o formulário acima para criar o primeiro.</p></div>`;
          return;
        }
        lista.innerHTML = cacheProjetos.map(p => `
          <div class="proj-admin-card">
            ${p.imagem_url ? `<img src="${esc(p.imagem_url)}" alt="${esc(p.titulo)}">` : `<div class="sem-img">Sem Imagem</div>`}
            <div class="proj-admin-info">
              <h4>${esc(p.titulo)} <span class="badge ${p.publicado ? 'badge-pub' : 'badge-oculto'}">${p.publicado ? 'Publicado' : 'Oculto'}</span></h4>
              <small>${esc(p.descricao || '—')}</small>
            </div>
            <div class="proj-admin-botoes">
              <button class="btn btn-outline btn-pequeno" onclick="editarProjeto('${p.id}')">Editar</button>
              <button class="btn btn-perigo btn-pequeno" onclick="excluirProjeto('${p.id}')">Excluir</button>
            </div>
          </div>`).join('');
      } catch (err) {
        console.error('[projetos admin]', err);
        lista.innerHTML = `<div class="estado erro"><h3>Erro</h3><p>${esc(err.message)}</p></div>`;
      }
    }

    /* ============ SALVAR PROJETO ============ */
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
          if (file.size > 5 * 1024 * 1024) throw new Error('Imagem muito grande (máx 5MB).');
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
        if (id) ({ error } = await db.from('projetos').update(payload).eq('id', id));
        else ({ error } = await db.from('projetos').insert([payload]));
        if (error) throw error;
        toast(id ? 'Projeto atualizado!' : 'Projeto criado!', 'sucesso');
        limparFormProjeto();
        carregarProjetosAdmin();
        carregarPortfolio();
      } catch (err) {
        console.error('[salvar]', err);
        toast(err.message, 'erro');
      } finally {
        btn.innerHTML = txtOriginal;
        btn.disabled = false;
      }
    });

    /* ============ EDITAR / EXCLUIR ============ */
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
      toast('Editando…', 'info', 2000);
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
        console.error('[excluir]', err);
        toast('Erro: ' + err.message, 'erro');
      }
    }

    function limparFormProjeto() {
      document.getElementById('form-projeto').reset();
      document.getElementById('p-id').value = '';
      document.getElementById('btn-cancelar-proj').style.display = 'none';
    }

