import fitz

doc = fitz.open(r"C:\Users\aryan\OneDrive\Desktop\AURA_SENTINEL_SIH2026_OFFICIAL_SUBMISSION.pdf")
with open(r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs\generated_pdf_blocks.txt", "w", encoding="utf-8") as f:
    for i, page in enumerate(doc):
        f.write(f"============================== SLIDE {i+1} ==============================\n")
        for b in page.get_text("blocks"):
            txt = b[4].strip()
            if txt:
                f.write(f"[{b[0]:.0f}, {b[1]:.0f}, {b[2]:.0f}, {b[3]:.0f}] {repr(txt)}\n")
print("Saved generated_pdf_blocks.txt")
