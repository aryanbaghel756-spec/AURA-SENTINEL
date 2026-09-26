import os
import sys
import time
import win32com.client
import fitz # pymupdf

def convert_pptx_to_pdf(pptx_path, pdf_path):
    os.system("taskkill /f /im POWERPNT.EXE 2>nul")
    time.sleep(1)

    abs_pptx = os.path.abspath(pptx_path)
    abs_pdf = os.path.abspath(pdf_path)

    if os.path.exists(abs_pdf):
        try:
            os.remove(abs_pdf)
        except Exception as e:
            print(f"Warning removing existing PDF: {e}")

    print(f"Starting PowerPoint COM conversion...")
    ppt = win32com.client.DispatchEx("PowerPoint.Application")
    ppt.Visible = 1
    presentation = None
    try:
        presentation = ppt.Presentations.Open(abs_pptx, 0, 0, 0)
        presentation.SaveAs(abs_pdf, 32)
        print(f"Saved PDF to: {abs_pdf}")
    finally:
        if presentation is not None:
            presentation.Close()
        ppt.Quit()
        os.system("taskkill /f /im POWERPNT.EXE 2>nul")

def verify_and_render(pdf_path):
    doc = fitz.open(pdf_path)
    print(f"Verified PDF page count: {len(doc)}")
    assert len(doc) == 6, f"Expected 6 pages, got {len(doc)}"

    out_preview = r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs\generated_pages"
    os.makedirs(out_preview, exist_ok=True)

    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        img_path = os.path.join(out_preview, f"slide_{i+1}.png")
        pix.save(img_path)
        print(f"Rendered slide {i+1} to {img_path}")

if __name__ == '__main__':
    pptx = r"C:\Users\aryan\OneDrive\Desktop\AURA_SENTINEL_SIH2026_OFFICIAL_SUBMISSION.pptx"
    pdf = r"C:\Users\aryan\OneDrive\Desktop\AURA_SENTINEL_SIH2026_OFFICIAL_SUBMISSION.pdf"
    convert_pptx_to_pdf(pptx, pdf)
    verify_and_render(pdf)
    print("CONVERSION & VERIFICATION COMPLETE!")
