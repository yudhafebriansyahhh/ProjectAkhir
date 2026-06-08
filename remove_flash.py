import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove <FlashMessage ... />
    content = re.sub(r'^[ \t]*<FlashMessage.*/>[\r\n]*', '', content, flags=re.MULTILINE)
    
    # Remove FlashMessage, from multi-line imports
    content = re.sub(r'^[ \t]*FlashMessage,[\r\n]*', '', content, flags=re.MULTILINE)
    
    # Remove FlashMessage, from single-line imports
    content = re.sub(r'FlashMessage, ', '', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Cleaned {filepath}")

if __name__ == '__main__':
    dirs = [
        r"d:\tes aja\PA\ProjectAkhir\resources\js\Pages\Dosen",
        r"d:\tes aja\PA\ProjectAkhir\resources\js\Pages\Mahasiswa"
    ]
    for base_dir in dirs:
        if os.path.exists(base_dir):
            for root, dirs, files in os.walk(base_dir):
                for file in files:
                    if file.endswith('.jsx'):
                        filepath = os.path.join(root, file)
                        clean_file(filepath)
