const API_BASE = location.origin; // mismo dominio del backend en Render

const form = document.querySelector('#login-form');
const email = document.querySelector('#correo');
const pass = document.querySelector('#contrasena');
const msg  = document.querySelector('#msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = 'Verificando...';
  msg.className = 'msg';

  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ correo: email.value.trim(), contrasena: pass.value.trim() })
    });

    const data = await res.json();

    if (!res.ok || !data || data.error) {
      msg.textContent = data?.error || 'Credenciales inválidas';
      msg.className = 'msg error';
      return;
    }

    // Guarda usuario en localStorage (demo simple)
    localStorage.setItem('usuario', JSON.stringify(data));

    msg.textContent = `¡Bienvenido/a, ${data.nombre}! Redirigiendo...`;
    msg.className = 'msg ok';

    setTimeout(()=> { window.location.href = '/dashboard.html'; }, 600);
  } catch (err) {
    msg.textContent = 'Error de red. Intenta de nuevo.';
    msg.className = 'msg error';
  }
});
