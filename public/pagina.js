// Página: aberto/fechado no horário de Brasília, horário de hoje em destaque, mapa sob demanda e barra fixa no celular.
(function () {
  var HORAS = { 1: [480, 1080], 2: [480, 1080], 3: [480, 1080], 4: [480, 1080], 5: [480, 1080], 6: [480, 780] };
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  function agora() {
    try {
      var o = {};
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
      return { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), m: (+o.hour % 24) * 60 + (+o.minute) };
    } catch (e) {
      var n = new Date();
      return { d: n.getDay(), m: n.getHours() * 60 + n.getMinutes() };
    }
  }
  function hora(m) { var h = Math.floor(m / 60), mi = m % 60; return h + 'h' + (mi ? (mi < 10 ? '0' : '') + mi : ''); }
  function situacao(a) {
    var h = HORAS[a.d];
    if (h && a.m >= h[0] && a.m < h[1]) return { aberto: true, texto: 'Aberto agora', detalhe: '• até ' + hora(h[1]) };
    if (h && a.m < h[0]) return { aberto: false, texto: 'Fechado agora', detalhe: '• abre hoje às ' + hora(h[0]) };
    for (var i = 1; i <= 7; i++) {
      var d = (a.d + i) % 7;
      if (HORAS[d]) return { aberto: false, texto: 'Fechado agora', detalhe: '• abre ' + (i === 1 ? 'amanhã' : DIAS[d]) + ' às ' + hora(HORAS[d][0]) };
    }
  }
  function aplicar() {
    var a = agora(), s = situacao(a);
    [].forEach.call(document.querySelectorAll('[data-status]'), function (el) {
      el.classList.toggle('aberto', s.aberto);
      el.classList.toggle('fechado', !s.aberto);
      var t = el.querySelector('[data-status-texto]'), d = el.querySelector('[data-status-detalhe]');
      if (t) t.textContent = s.texto;
      if (d) d.textContent = s.detalhe;
    });
    [].forEach.call(document.querySelectorAll('[data-dias]'), function (el) {
      var hoje = el.getAttribute('data-dias').split(' ').indexOf(String(a.d)) > -1;
      el.classList.toggle('hoje', hoje);
      if (hoje) el.setAttribute('aria-current', 'date'); else el.removeAttribute('aria-current');
    });
  }
  aplicar();
  setInterval(aplicar, 60000);

  // Mapa do Google: só carrega quando a pessoa pede (nada vai ao Google antes disso).
  var ver = document.getElementById('ver-mapa');
  if (ver) ver.addEventListener('click', function () {
    var capa = document.querySelector('.mapa-capa'), fr = document.createElement('iframe');
    fr.title = 'Mapa: Comercial Ferraz, Av. Fernando Machado, 13, Centro, Agudos';
    fr.loading = 'lazy';
    fr.referrerPolicy = 'strict-origin-when-cross-origin';
    fr.allowFullscreen = true;
    fr.src = 'https://maps.google.com/maps?q=-22.4676641,-48.9892669&z=17&hl=pt-BR&output=embed';
    capa.parentNode.classList.add('carregado');
    capa.replaceWith(fr);
  });

  // Barra de contato no celular: aparece depois que os botões da abertura saem da tela.
  var alvo = document.getElementById('acoes-abertura'), barra = document.querySelector('.barra');
  if (alvo && barra && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      document.body.classList.toggle('barra-on', !es[0].isIntersecting && es[0].boundingClientRect.top < 0);
    }).observe(alvo);
  } else if (barra) {
    document.body.classList.add('barra-on');
  }
})();
