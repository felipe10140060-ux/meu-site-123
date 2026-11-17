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

  