const menuBtn = document.getElementById('menuBtn');
const fecharMenu = document.getElementById('fecharMenu');
const navLinks = document.querySelector('.nav-links');

function abrirMenu() {
    navLinks.classList.add('aberto');
}

function fecharMenuFn() {
    navLinks.classList.remove('aberto');
}

if (menuBtn) {
    menuBtn.addEventListener('click', abrirMenu);
}

if (fecharMenu) {
    fecharMenu.addEventListener('click', fecharMenuFn);
}

// FECHA O MENU AO CLICAR EM QUALQUER LINK
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navLinks) navLinks.classList.remove('aberto');
        });
    });
});

// Máscara de telefone
const telefone = document.getElementById('telefone');
if (telefone) {
    telefone.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
        else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        e.target.value = v;
    });
}