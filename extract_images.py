import fitz # PyMuPDF
import os

def extract():
    doc = fitz.open("Shree Gowri Enterprises catalogue 2026.pdf")
    os.makedirs("extracted_images", exist_ok=True)

    image_count = 0
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        print(f"Page {page_num+1} has {len(image_list)} images")
        for img_idx, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            image_filename = f"extracted_images/page_{page_num+1}_img_{img_idx+1}.{image_ext}"
            with open(image_filename, "wb") as f:
                f.write(image_bytes)
            image_count += 1

    print(f"Extracted {image_count} images.")

if __name__ == "__main__":
    extract()
