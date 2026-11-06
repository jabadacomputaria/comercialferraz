// Orçamento: monta a mensagem do WhatsApp com serviço, filtros, veículo, km e quando.
// Usado no site (index.html) e na página do Instagram (links.html). A origem vem de data-origem no form.
(function () {
  var f = document.getElementById('form-pedido');
  if (!f) return;
  var NUM = '5514988059685';
  var origem = f.getAttribute('data-origem') || 'site';
  var previa = document.getElementById('previa');
  var enviar = document.getElementById('enviar');
  var rotulo = enviar.querySelector('[data-rotulo]');
  var filtros = document.getElementById('filtros');
  var SVG = 'http://www.w3.org/2000/svg';
  var antes = [];

  function marcados(nome) {
    return [].filter.call(f.querySelectorAll('input[name="' + nome + '"]'), function (i) {
      return i.type === 'hidden' || i.checked;
    }).map(function (i) { return i.value; });
  }
  function valor(nome) {
    var e = f.elements[nome];
    return e ? String(e.value || '').trim() : '';
  }
  function listar(a) {
    return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1];
  }
  function km(v) {
    var d = v.replace(/\D/g, '').slice(0, 7);
    return d ? Number(d).toLocaleString('pt-BR') : '';
  }
  function linha(texto, fala, acendeu) {
    var li = document.createElement('li');
    if (fala) li.className = 'fala';
    if (acendeu) li.className += (li.className ? ' ' : '') + 'acendeu';
    var s = document.createElementNS(SVG, 'svg');
    s.setAttribute('class', 'ico'); s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS(SVG, 'use');
    u.setAttribute('href', 'img/icones.svg#i-seta');
    s.appendChild(u);
    var t = document.createElement('span');
    t.textContent = texto;
    li.appendChild(s); li.appendChild(t);
    return li;
  }

  function montar() {
    var serv = marcados('servico'), filt = marcados('filtro');
    var veic = valor('veiculo'), mod = valor('modelo'), k = km(valor('km')), quando = valor('quando');
    if (filtros) filtros.hidden = serv.indexOf('troca de óleo') < 0;

    var itens = serv.map(function (s) {
      if (s !== 'troca de óleo' || !filt.length) return s;
      var com = filt.filter(function (x) { return x !== 'não sei'; });
      var partes = [];
      if (com.length) partes.push('com ' + listar(com));
      if (filt.indexOf('não sei') > -1) partes.push('não sei quais filtros');
      return 'troca de óleo (' + partes.join('; ') + ')';
    });

    var corpo = [];
    if (itens.length) corpo.push('Serviço: ' + listar(itens));
    var v = [veic, mod].filter(Boolean).join(', ');
    if (v) corpo.push('Veículo: ' + v);
    if (k) corpo.push('Km atual: ' + k);
    if (quando === 'preço') corpo.push('Por enquanto, só quero saber o preço');
    else if (quando) corpo.push('Quero levar: ' + quando);

    var abre = 'Oi! Vim pelo ' + origem + ' e quero um orçamento.';
    var fecha = 'Pode me passar o valor?';
    var tem = corpo.length > 0;
    var msg = tem ? [abre].concat(corpo.map(function (c) { return '• ' + c; }), [fecha]).join('\n')
                  : 'Oi! Vim pelo ' + origem + ' e queria um orçamento.';
    enviar.href = 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(msg);
    if (rotulo) rotulo.textContent = tem ? 'Enviar pelo WhatsApp' : 'Chamar no WhatsApp';

    var agora = tem ? [abre].concat(corpo, [fecha]) : [];
    previa.textContent = '';
    if (!tem) {
      var vazio = document.createElement('li');
      vazio.className = 'vazio';
      vazio.textContent = 'Escolha o serviço e o veículo. A mensagem aparece aqui.';
      previa.appendChild(vazio);
    } else {
      agora.forEach(function (t, i) {
        var fala = i === 0 || i === agora.length - 1;
        previa.appendChild(linha(t, fala, !fala && antes.indexOf(t) < 0));
      });
    }
    antes = agora;
  }

  f.addEventListener('change', montar);
  f.addEventListener('input', montar);
  var campoKm = f.elements.km;
  if (campoKm) campoKm.addEventListener('change', function () { campoKm.value = km(campoKm.value); });
  f.addEventListener('submit', function (e) { e.preventDefault(); enviar.click(); });
  montar();
})();
