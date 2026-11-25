/* ================================================================
   DASHBOARD.JS — Leads, CRUD de projetos, stats e tabs
   ================================================================ */

let cacheProjetos = [];

/* ---------- CARREGAR TUDO ---------- */
function carregarTudoAdmin() {
  carregarLeads();
  carregarProjetosAdmin();
}

/* ---------- TABS ---------- */
function mudarAba(aba, btn) {
  document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('ativo'); });
  document.querySelectorAll('.tab-conteudo').forEach(function (c) { c.classList.remove('ativo'); });
  btn.classList.add('ativo');
  document.getElementById('aba-' + aba).classList.add('ativo');
}

/* ---------- LEADS ---------- */
async function carregarLeads() {
  const lista = document.getElementById('lista-leads');
  if (!lista) return;
  lista.innerHTML = '<div class="estado"><div class="spinner"></div><p>Buscando...</p></div>';
  try {
    const res = await db.from('leads').select('*').order('created_at', { ascending: false });
    if (res.error) throw res.error;
    document.getElementById('stat-leads').textContent = (res.data || []).length;

    if (!res.data || res.data.length === 0) {
      lista.innerHTML = '<div class="estado"><h3>Nenhuma mensagem</h3><p>Você ainda não recebeu contatos.</p></div>';
      return;
    }

    lista.innerHTML = res.data.map(function (m) {
      return '<div class="lead-card">' +
        '<div class="lead-header"><h4>' + esc(m.nome) + '</h4><time>' + new Date(m.created_at).toLocaleString('pt-BR') + '</time></div>' +
        '<div class="lead-info">📞 <strong>Telefone:</strong> ' + esc(m.telefone) + '<br>✉️ <strong>E-mail:</strong> ' + esc(m.email) + '<br>📌 <strong>Assunto:</strong> ' + esc(m.assunto) + '</div>' +
        '<div class="lead-msg">' + esc(m.mensagem) + '</div>' +
        '</div>';
    }).join('');
  } catch (err) {
    console.error('[leads]', err);
    lista.innerHTML = '<div class="estado erro"><h3>Erro</h3><p>' + esc(err.message) + '</p></div>';
  }
}

/* ---------- PROJETOS ADMIN ---------- */
async function carregarProjetosAdmin() {
  const lista = document.getElementById('lista-projetos-admin');
  if (!lista) return;
  lista.innerHTML = '<div class="estado"><div class="spinner"></div><p>Carregando...</p></div>';
  try {
    const res = await db.from('projetos').select('*').order('created_at', { ascending: false });
    if (res.error) throw res.error;
    cacheProjetos = res.data || [];
    const pub = cacheProjetos.filter(function (p) { return p.publicado; }).length;
    document.getElementById('stat-projetos').textContent = cacheProjetos.length;
    document.getElementById('stat-publicados').textContent = pub;
    document.getElementById('stat-ocultos').textContent = cacheProjetos.length - pub;
    document.getElementById('num-projetos-admin').textContent = cacheProjetos.length;

    if (cacheProjetos.length === 0) {
      lista.innerHTML = '<div class="estado"><h3>Nenhum projeto</h3><p>Use o formulário acima para criar o primeiro.</p></div>';
      return;
    }

    lista.innerHTML = cacheProjetos.map(function (p) {
      const imgHTML = p.imagem_url
        ? '<img src="' + esc(p.imagem_url) + '" alt="' + esc(p.titulo) + '">'
        : '<div class="sem-img">Sem Imagem</div>';
      const badge = '<span class="badge ' + (p.publicado ? 'badge-pub' : 'badge-oculto') + '">' + (p.publicado ? 'Publicado' : 'Oculto') + '</span>';
      return '<div class="proj-admin-card">' + imgHTML +
        '<div class="proj-admin-info"><h4>' + esc(p.titulo) + ' ' + badge + '</h4><small>' + esc(p.descricao || '—') + '</small></div>' +
        '<div class="proj-admin-botoes">' +
          '<button class="btn btn-outline btn-pequeno" onclick="editarProjeto(\'' + p.id + '\')">Editar</button>' +
          '<button class="btn btn-perigo btn-pequeno" onclick="excluirProjeto(\'' + p.id + '\')">Excluir</button>' +
        '</div></div>';
    }).join('');
  } catch (err) {
    console.error('[projetos admin]', err);
    lista.innerHTML = '<div class="estado erro"><h3>Erro</h3><p>' + esc(err.message) + '</p></div>';
  }
}

/* ---------- SALVAR PROJETO (delegação) ---------- */
document.addEventListener('submit', async function (e) {
  if (e.target.id !== 'form-projeto') return;
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
      const fileName = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
      const up = await db.storage.from('projetos').upload(fileName, file);
      if (up.error) throw new Error('Upload: ' + up.error.message);
      const urlRes = db.storage.from('projetos').getPublicUrl(fileName);
      imagem_url = urlRes.data.publicUrl;
    }

    const payload = {
      titulo: document.getElementById('p-titulo').value.trim(),
      descricao: document.getElementById('p-descricao').value.trim() || null,
      link_projeto: document.getElementById('p-link').value.trim() || null,
      publicado: document.getElementById('p-publicado').checked
    };
    if (imagem_url) payload.imagem_url = imagem_url;

    let res;
    if (id) res = await db.from('projetos').update(payload).eq('id', id);
    else res = await db.from('projetos').insert([payload]);
    if (res.error) throw res.error;

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

/* ---------- EDITAR / EXCLUIR / LIMPAR ---------- */
function editarProjeto(id) {
  const p = cacheProjetos.find(function (x) { return x.id === id; });
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
    const res = await db.from('projetos').delete().eq('id', id);
    if (res.error) throw res.error;
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