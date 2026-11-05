with open('web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update contact badge & title
old_str = '<span style="color: #FFA54D; font-weight: 700; text-transform: uppercase; font-size: 0.85rem;">ประเมินราคาหน้างาน</span>'
new_str = '<span class="contact-left-badge" style="color: #FFA54D; font-weight: 700; text-transform: uppercase; font-size: 1rem; display: inline-block; margin-bottom: 8px;">ประเมินราคาหน้างาน</span>'
content = content.replace(old_str, new_str)

old_h3 = '<h3 style="font-size: 1.85rem; font-weight: 800; line-height: 1.3; margin-bottom: 10px;">มีงานลอกบ่อพักหรือท่อระบายน้ำให้ประเมิน?</h3>'
new_h3 = '<h3 style="font-size: clamp(1.65rem, 3.2vw, 2.1rem); font-weight: 800; line-height: 1.3; margin-bottom: 14px;">มีงานลอกบ่อพักหรือท่อระบายน้ำให้ประเมิน?</h3>'
content = content.replace(old_h3, new_h3)

with open('web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html contact header")
