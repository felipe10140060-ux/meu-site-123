// Login independente do painel administrativo usando Supabase Auth.
const LOGIN_SUPABASE_URL = 'https://fzwkjrksbonirunfmexm.supabase.co';
const LOGIN_SUPABASE_KEY = 'sb_publishable_DJZq6j_mIhKJBLyQMex8eg_LGKyUOwI';
const loginClient = window.supabase.createClient(LOGIN_SUPABASE_URL, LOGIN_SUPABASE_KEY);

document.getElementById('form-login')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = document.getElementById('btn-entrar');
  const status = document.getElementById('status-login');
  button.disabled = true;
  button.textContent = 'Verificando...';
  status.textContent = '';
  try {
    const { error } = await loginClient.auth.signInWithPassword({
      email: document.getElementById('l-email').value.trim(),
      password: document.getElementById('l-senha').value
    });
    if (error) throw error;
    window.location.href = 'dashboard.html';
  } catch (error) {
    status.textContent = 'Não foi possível entrar: ' + error.message;
  } finally {
    button.disabled = false;
    button.textContent = 'Entrar no Painel';
  }
});
