#!/usr/bin/env python3
"""Servidor local para testar o site como na Vercel: /links abre links.html e página inexistente mostra 404.html.
Uso: python3 servir.py            (porta 5180, aceita conexões do celular na mesma rede)
     python3 servir.py 8080       (outra porta)
"""
import http.server, json, os, re, sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(RAIZ, 'public')

# Mesmos cabeçalhos de segurança do vercel.json, para o teste local valer como produção.
# No computador fica de fora só o que exige https (upgrade-insecure-requests, COOP, HSTS) e o cache.
def cabecalhos_vercel():
    try:
        cfg = json.load(open(os.path.join(RAIZ, 'vercel.json'), encoding='utf-8'))
    except OSError:
        return []
    regras = []
    for bloco in cfg.get('headers', []):
        padrao = re.compile('^' + bloco['source'].replace('(.*)', '(.*)') + '$')
        lista = []
        for h in bloco['headers']:
            if h['key'].lower() in ('cache-control', 'cross-origin-opener-policy', 'strict-transport-security'):
                continue
            valor = h['value'].replace('; upgrade-insecure-requests', '')
            lista.append((h['key'], valor))
        regras.append((padrao, lista))
    return regras

REGRAS = cabecalhos_vercel()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=PASTA, **k)

    def send_head(self):
        caminho = self.path.split('?', 1)[0].split('#', 1)[0]
        real = self.translate_path(caminho)
        if not os.path.exists(real) and os.path.exists(real + '.html'):
            self.path = caminho + '.html' + (self.path[len(caminho):] if len(self.path) > len(caminho) else '')
        elif not os.path.exists(real):
            self.send_response(404)
            corpo = open(os.path.join(PASTA, '404.html'), 'rb').read()
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(corpo)))
            self.end_headers()
            import io
            return io.BytesIO(corpo)
        return super().send_head()

    def end_headers(self):
        caminho = self.path.split('?', 1)[0]
        for padrao, lista in REGRAS:
            if padrao.match(caminho):
                for k, v in lista:
                    self.send_header(k, v)
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

if __name__ == '__main__':
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 5180
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(('0.0.0.0', porta), Handler) as s:
        print(f'Site no ar em http://localhost:{porta} (e /links)')
        s.serve_forever()
