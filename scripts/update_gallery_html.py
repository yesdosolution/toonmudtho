import re

with open('web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace <div class="gallery-item" with <div class="gallery-item" role="button" tabindex="0"
content = re.sub(
    r'<div class="gallery-item"([^>]*)>',
    r'<div class="gallery-item"\1 role="button" tabindex="0">',
    content
)

# Replace <div class="gallery-zoom-overlay"><span>คลิกดูภาพขยาย</span></div>
touch_overlay = '''<div class="gallery-zoom-overlay"><span>คลิกดูภาพขยาย</span></div>
              <span class="gallery-touch-badge" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                แตะดูภาพขยาย
              </span>'''

content = content.replace(
    '<div class="gallery-zoom-overlay"><span>คลิกดูภาพขยาย</span></div>',
    touch_overlay
)

with open('web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated gallery items in web/index.html successfully")
