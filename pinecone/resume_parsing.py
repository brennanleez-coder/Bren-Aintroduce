import PyPDF2
from transformers import BertTokenizer, BertModel
import torch

text_from_resume = """
Lee Chak Fai Brennan
Singapore
brennan.lee@u.nus.edu
linkedin.com/in/lee-chak-fai-brennan

 
Hackathons: Carro AWS Hackathon | Morgan Stanley Tech X Challenge
Programming Languages & Tools: Python | Java SE & EE | Kotlin| Typescript | Javascript | HTML & CSS| SQL |
NoSQL
Frameworks & Tools: React | ReactNative | Angular | Vue | NodeJs
| Express | FastAPI | PostgreSQL | MongoDB
Data Engineering: Apache Airflow | Pandas | BigQuery
Cybersecurity: Metasploit | Caldera | WireShark | Cyberchef
 
Beyond academics, I served as a Teaching Assistant for Computing modules, actively competed locally and
internationally (ASEAN University Games) for Badminton and captained the Varsity Badminton Team.
 
My dedication has been recognized through the prestigious NUS Sports Scholarship, NUS Student Life Award,
being appointed as School of Computing Student Ambassador, and participating in the NUS Overseas Colleges
SEA Programme

Extra-Curricular Activities
	•	Teaching Assistant for Computing modules at NUS.
	•	Competed in Badminton locally and internationally (ASEAN University Games), captained Varsity Badminton Team.
	•	Awards: NUS Sports Scholarship, NUS Student Life Award.
	•	Roles: School of Computing Student Ambassador, participant in NUS Overseas Colleges SEA Programme.
Professional Experience
		Cyber Security Engineer, DSTA
	•	Duration: Jun 2023 - Dec 2023 (7 months).
	•	Focus: Red Teaming (MITRE ATT&CK framework, Caldera, Metasploit for Android Payloads) and Blue Teaming (Android Threat Detection).
		Full Stack Engineer, Invigilo Safety AI
	•	Duration: Aug 2022 - Jan 2023 (6 months).
	•	Contributions: Development of SafeKey Mobile App, Web App Development of SafeKey, Product Management, and represented at The Big 5 Conference in Dubai.
		Assistant Coach
	•	Duration: Sep 2022 - Nov 2022 (3 months).
	•	Role: Focused on SEM, social media, display ad campaigns, resulting in a 25.28% click conversion rate; improved website SEO and engagement.
		Full Stack Engineer, amalan international
	•	Duration: May 2022 - Aug 2022 (4 months).
	•	Projects: Development and internationalisation of amalanProtect, collaborated with Indonesian teams.
		Teaching Assistant, National University of Singapore
	•	Duration: Jan 2021 - Present (2 years 10 months).
	•	Modules: BT2102 Database Management and Visualisation, IS1108 Digital Ethics and Data Privacy.
Education
	•	National University of Singapore
	•	Degree: Bachelor of Computing, Information Systems, Minor in Mathematics (2020 - 2024).

"""

resume_path = "/Users/brennanlee/Desktop/Lee_Chak_Fai_Brennan_Resume.pdf"
def get_text_from_resume(resume_path):
    try:
        with open(resume_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            full_text = ''
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"  # Ensure all text is included, separated by page
            return full_text.strip()
    except Exception as e:
        print(f"An error occurred while extracting text from the resume: {e}")
        return None

def bert_embed(text, tokenizer, model):
    # Prepare the text for the model
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding='max_length', max_length=512, add_special_tokens=True)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.squeeze()

def get_resume_vector():
    # resume_path = "/Users/brennanlee/Desktop/Lee_Chak_Fai_Brennan_Resume.pdf"
    # resume_text = get_text_from_resume(resume_path)
    resume_text = text_from_resume
    
    if resume_text is None:
        return None

    # Initialize tokenizer and model
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertModel.from_pretrained('bert-base-uncased')

    # Define chunking parameters
    chunk_size = 512 - 2  # Account for [CLS] and [SEP] tokens
    overlap = 50

    # Tokenize and chunk text
    tokenized_text = tokenizer.tokenize(resume_text)
    chunks = []
    start = 0
    while start < len(tokenized_text):
        end = start + chunk_size
        chunk = tokenizer.convert_tokens_to_string(tokenized_text[start:end])
        chunks.append(chunk)
        start += (chunk_size - overlap)

    # Generate embeddings for each chunk
    all_embeddings = [bert_embed(chunk, tokenizer, model) for chunk in chunks]

    # Calculate the mean of the embeddings
    embeddings_tensor = torch.stack(all_embeddings)
    mean_embedding = torch.mean(embeddings_tensor, 0)

    return mean_embedding.numpy()


vector = get_resume_vector()
print(vector.shape)
# print(get_text_from_resume(resume_path))
# Example usage


# print(get_text_from_resume(resume_path))
# if vector is not None:
#     print(vector.shape)
# else:
#     print("Failed to generate the resume vector.")
