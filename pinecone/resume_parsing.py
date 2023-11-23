import PyPDF2
from transformers import BertTokenizer, BertModel
import torch


resume_path = "/Users/brennanlee/Desktop/Lee_Chak_Fai_Brennan_Resume.pdf"
# Function to extract text from a resume PDF
def get_text_from_resume(resume_path):
    try:
        with open(resume_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            full_text = ''
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text = page.extract_text()
                
            full_text += text
            
        return full_text
    except Exception as e:
        print(f"An error occurred while extracting text from the resume: {e}")
        return None

# Function to generate embeddings from text using BERT
def bert_embed(text, tokenizer, model):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding='max_length', max_length=512, add_special_tokens=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.squeeze()

# Function to get the mean vector embedding for a resume
def get_resume_vector():
    resume_path = "/Users/brennanlee/Desktop/Lee_Chak_Fai_Brennan_Resume.pdf"
    # Load the resume text
    resume_text = get_text_from_resume(resume_path)
    if resume_text is None:
        return None

    # Initialize tokenizer and model
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertModel.from_pretrained('bert-base-uncased')

    # Define the size of the chunks and the overlap
    chunk_size = 512 - 2 * tokenizer.num_special_tokens_to_add(pair=False)  # for [CLS] and [SEP]
    overlap = 50

    # Split the text into chunks with a sliding window
    chunks = []
    start = 0
    tokenized_text = tokenizer.tokenize(resume_text)
    while start + chunk_size < len(tokenized_text):
        end = start + chunk_size
        chunk = tokenizer.convert_tokens_to_string(tokenized_text[start:end])
        chunks.append(chunk)
        start += (chunk_size - overlap)
    chunks.append(tokenizer.convert_tokens_to_string(tokenized_text[start:]))

    # Initialize an empty list to hold all embeddings
    all_embeddings = []

    # Process each chunk with the model
    for chunk in chunks:
        embedding = bert_embed(chunk, tokenizer, model)
        all_embeddings.append(embedding)

    # Convert the list of embeddings into a tensor
    embeddings_tensor = torch.stack(all_embeddings)

    # Take the mean of the embeddings along the 0th dimension
    mean_embedding = torch.mean(embeddings_tensor, 0)

    # Convert to numpy array
    vector = mean_embedding.numpy()

    return vector

# Example usage


# print(get_text_from_resume(resume_path))
# if vector is not None:
#     print(vector.shape)
# else:
#     print("Failed to generate the resume vector.")
