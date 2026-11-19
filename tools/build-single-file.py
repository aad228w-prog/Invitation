#!/usr/bin/env python3
"""
build-single-file.py
--------------------
Bundles the project into ONE self-contained HTML file (CSS, JavaScript and
phone-sized images all inlined), handy for sharing or previewing anywhere.

    python3 tools/build-single-file.py            ->  dist/invitation.html

The normal multi-file project (index.html + css/ + js/ + assets/) is what you
should deploy; this is only a convenience build.
"""
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'dist' / 'invitation.html'

IMAGE_NAMES = [
    'background', 'pearls-left', 'pearls-right', 'pot',
    'portrait', 'portrait-feather',
    'frame', 'frame-feather-left', 'frame-feather-right',
    'silk', 'silk-feather',
]


def read(relative_path: str) -> str:
    return (ROOT / relative_path).read_text(encoding='utf-8')


def image_data_uri(name: str) -> str:
    """Phone-sized WebP as a data URI (keeps the single file small)."""
    data = (ROOT / 'assets' / 'images' / f'{name}-m.webp').read_bytes()
    return f"url('data:image/webp;base64,{base64.b64encode(data).decode()}')"


def build_tokens_css() -> str:
    """The tokens file, with every image path replaced by an inline image."""
    tokens = read('css/01-tokens.css')
    head = tokens[:tokens.index('  /* Images: desktop WebP')]
    images = '\n'.join(f'  --img-{name}: {image_data_uri(name)};' for name in IMAGE_NAMES)
    return f'{head}{images}\n}}\n'


def bundle_css(html: str) -> str:
    sheets = re.findall(r'<link rel="stylesheet" href="(css/[^"]+)">', html)
    parts = []
    for href in sheets:
        body = build_tokens_css() if href.endswith('01-tokens.css') else read(href)
        parts.append(f'/* ===== {href} ===== */\n{body}')
    style = '\n  <style>\n' + '\n'.join(parts) + '  </style>'
    return re.sub(r'(\s*<link rel="stylesheet" href="css/[^"]+">)+', lambda _: style, html, count=1)


def bundle_js(html: str) -> str:
    scripts = re.findall(r'<script defer src="(js/[^"]+)"></script>', html)
    code = '\n'.join(f'/* ===== {src} ===== */\n{read(src)}' for src in scripts)
    code = code.replace('</script>', '<\\/script>')
    # Inline scripts ignore `defer`, so wait for the deferred GSAP files explicitly.
    wrapped = (
        "\n  <script>\n"
        "  document.addEventListener('DOMContentLoaded', function () {\n"
        f"{code}\n  }});\n  </script>"
    )
    return re.sub(r'(\s*<script defer src="js/[^"]+"></script>)+', lambda _: wrapped, html, count=1)


def main() -> None:
    html = read('index.html')
    html = re.sub(r'\s*<link rel="preload" as="image"[^>]*>', '', html)  # files are inlined now
    html = bundle_js(bundle_css(html))
    OUTPUT.parent.mkdir(exist_ok=True)
    OUTPUT.write_text(html, encoding='utf-8')
    print(f'Wrote {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
