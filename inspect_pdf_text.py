import fitz # PyMuPDF

def inspect_pdf_text():
    doc = fitz.open("Shree Gowri Enterprises catalogue 2026.pdf")
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        first_few_lines = [line.strip() for line in text.split('\n') if line.strip()][:5]
        print(f"Page {page_num+1}: {first_few_lines}")

if __name__ == "__main__":
    inspect_pdf_text()
