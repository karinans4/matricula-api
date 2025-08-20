// public/app.js
// Usa el mismo dominio del backend (Render). Si se abre como file://, forzamos el host.
const API_BASE = (location.origin && location.origin.startsWith('http'))
  ? location.origin
  : 'https://matricula-api-s1rg.onrender.com';

const form  = document.querySelector('#login-form');
const email = document.querySelector('#correo');
const pass  = document.querySelector('#contrasena');
const msg   = document.querySelector('#msg');

function showMsg(t, ok=false){
  msg.textContent = t;
  msg.className = 'msg ' + (ok ? 'ok' : 'error');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMsg('Verificando...', false);

  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: email.value.trim(),
        contrasena: pass.value.trim()
      })
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json() : null;

    if (!res.ok || !data || data.error) {
      return showMsg(data?.error || `Error ${res.status}: ${res.statusText}`);
    }

    // Aseguramos que 'roles' sea un array (el backend ya lo envía así)
    if (!Array.isArray(data.roles)) data.roles = [];

    // Guardar usuario completo en localStorage
    localStorage.setItem('usuario', JSON.stringify(data));

    // Redirección según rol
    const roles = data.roles;                 // [1,2,3]
    const esAdmin = roles.includes(1);
    const esProf  = roles.includes(2);
    const esEstu  = roles.includes(3);

    // Política simple: Admin → dashboard; Prof (sin Admin) → vista profesor; Estu (solo) → matrícula
    let dest = '/dashboard.html';
    if (!esAdmin && esProf) dest = '/profesor.html';
    if (!esAdmin && !esProf && esEstu) dest = '/estu-matricula.html';

    showMsg(`¡Bienvenido/a, ${data.nombre}! Redirigiendo...`, true);
    setTimeout(() => { window.location.href = dest; }, 500);

  } catch (err) {
    console.error(err);
    showMsg('Error de red. Intenta de nuevo.');
  }
});
