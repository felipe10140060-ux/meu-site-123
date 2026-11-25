    /* ============ MATÉRIAS ============ */
    const materias = {
      1: { titulo: "Inteligência Artificial no Dia a Dia", meta: "Artigo 01 • Tecnologia & Sociedade", imagem: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80", texto: `<p>A Inteligência Artificial (IA) deixou de ser um tema de ficção científica para se tornar parte integrante do nosso cotidiano. Quando o seu celular sugere a próxima palavra que você vai digitar no WhatsApp, ou quando o aplicativo de streaming recomenda aquele filme baseado no que você assistiu semana passada, a IA está trabalhando nos bastidores.</p><p>No setor financeiro, os bancos utilizam IA para monitorar transações em tempo real. Se você tenta comprar algo em um horário incomum ou em uma cidade diferente, o sistema pode bloquear a compra preventivamente para proteger seu dinheiro.</p><p>Para nós, que estamos estudando tecnologia, entender como esses algoritmos funcionam é essencial. A IA não veio para substituir o ser humano, mas para automatizar o trabalho repetitivo, permitindo que foquemos no que realmente exige criatividade e resolução de problemas complexos.</p>` },
      2: { titulo: "IA Revolucionando a Saúde", meta: "Artigo 02 • Inovação", imagem: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", texto: `<p>A área da saúde é uma das que mais se beneficia com o avanço da Inteligência Artificial. Algoritmos de aprendizado de máquina estão sendo treinados para analisar exames de imagem com precisão que, em alguns casos, supera o olho humano.</p><p>Isso permite que doenças como o câncer sejam detectadas em estágios muito iniciais, aumentando drasticamente as chances de cura. Além do diagnóstico, a IA também atua na descoberta de novos medicamentos.</p><p>Com a telemedicina e dispositivos vestíveis, a IA poderá prever ataques cardíacos antes mesmo de acontecerem, salvando milhares de vidas.</p>` },
      3: { titulo: "O Futuro da Educação com a IA", meta: "Artigo 03 • Educação", imagem: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80", texto: `<p>A educação está passando por uma transformação profunda. O modelo tradicional de ensinar a mesma coisa para 40 alunos no mesmo ritmo está com os dias contados. A IA permite a aprendizagem adaptativa.</p><p>Plataformas inteligentes identificam onde um aluno está com dificuldades e adaptam o conteúdo. Se aprende rápido, recebe desafios maiores. Se tem dificuldade em matemática, o sistema oferece exercícios extras.</p><p>Ferramentas de IA também ajudam professores a corrigir provas, economizando tempo para o contato humano e mentoria dos alunos.</p>` },
      4: { titulo: "O Mercado de Trabalho e a IA", meta: "Artigo 04 • Carreiras", imagem: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80", texto: `<p>"A IA vai roubar os meus empregos?" Profissões com tarefas repetitivas serão automatizadas. Mas a IA também cria novas funções como Engenheiro de Prompt, Especialista em Ética de IA e Auditor de Algoritmos.</p><p>O segredo é a adaptabilidade. Profissionais que usam IA como ferramenta de produtividade se tornam muito mais valiosos. A tecnologia é aliada, não inimiga.</p><p>As habilidades mais valorizadas serão humanas: empatia, criatividade, pensamento crítico e inteligência emocional.</p>` },
      5: { titulo: "Ética, Segurança e os Limites da IA", meta: "Artigo 05 • Segurança Digital", imagem: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80", texto: `<p>A Inteligência Artificial é poderosa, mas pode ser mal utilizada. A ética na IA é tema central. Como garantir que algoritmos não perpetuem preconceitos? Se os dados são tendenciosos, a IA também será.</p><p>A privacidade é outro ponto crítico. Ferramentas de IA coletam dados massivos. Governos criam leis (como LGPD no Brasil) para regulamentar.</p><p>A segurança contra deepfakes é um desafio crescente. Desenvolver detecção e promover educação digital são passos fundamentais para uma sociedade segura na era da IA.</p>` }
    };

    /* ============ MATÉRIA ============ */
    let materiaAtualId = null;
    function abrirMateria(id) {
      const materia = materias[id];
      if (!materia) return;
      materiaAtualId = id;
      document.getElementById('materia-meta').innerText = materia.meta;
      document.getElementById('materia-titulo').innerText = materia.titulo;
      document.getElementById('materia-conteudo').innerHTML = `
        <img src="${materia.imagem}" class="artigo-img-principal" alt="${materia.titulo}">
        <div class="artigo-texto">${materia.texto}</div>`;
      navegar('materia');
      document.title = materia.titulo + ' | Felipe Argolo';
    }

    function compartilhar(rede) {
      if (!materiaAtualId) return;
      const m = materias[materiaAtualId];
      const url = window.location.href;
      const txt = m.titulo;
      if (rede === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(txt + ' - ' + url)}`, '_blank');
      else if (rede === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`, '_blank');
      else if (rede === 'copy') { navigator.clipboard.writeText(url); toast('Link copiado!', 'sucesso'); }
    }

