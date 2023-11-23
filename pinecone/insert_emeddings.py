import pinecone
from dotenv import load_dotenv
import os
import uuid
import numpy as np

load_dotenv()

from resume_parsing import get_resume_vector

# Load Pinecone configuration from environment variables
pinecone_api_key = os.getenv('PINECONE_API_KEY')
pinecone_index = os.getenv('PINECONE_INDEX')
pinecone_environment = os.getenv('PINECONE_ENVIRONMENT')

# Initialize Pinecone
pinecone.init(api_key=pinecone_api_key, environment=pinecone_environment)      
index = pinecone.Index(pinecone_index)

# Get the vector embedding from your resume
vector_embedding = get_resume_vector()

# Convert the vector embedding to a list of floats
if isinstance(vector_embedding, np.ndarray):
    vector_embedding_list = vector_embedding.tolist()
elif isinstance(vector_embedding, list):
    vector_embedding_list = vector_embedding
else:
    raise TypeError("The vector embedding should be a numpy array or a list.")

# Generate a unique ID for the resume's embedding
candidate_name = "Brennan"
unique_id = uuid.uuid4()
vector_id = f"resume_{candidate_name}_{unique_id}"

# Check and adjust the vector's dimensionality to match your Pinecone index
desired_dimension = 1536  # Replace with your index's dimension
if len(vector_embedding_list) > desired_dimension:
    vector_embedding_list = vector_embedding_list[:desired_dimension]
elif len(vector_embedding_list) < desired_dimension:
    vector_embedding_list = np.pad(vector_embedding_list, (0, desired_dimension - len(vector_embedding_list)), 'constant').tolist()

# Ensure vector size is within Pinecone's limit (4 MB)
vector_byte_size = len(vector_embedding_list) * 4  # Assuming float32, 4 bytes per element
if vector_byte_size > 4194304:
    raise ValueError("Vector size exceeds Pinecone's limit of 4 MB")

# Upsert the vector into the Pinecone index
index.upsert(vectors=[(vector_id, vector_embedding_list)])

# Check if the upsert was successful
status = index.describe_index_stats()
print(status)

# Latest error message:
# HTTP response headers: HTTPHeaderDict({'content-type': 'application/json', 'Content-Length': '119', 'date': 'Thu, 23 Nov 2023 16:56:02 GMT', 'x-envoy-upstream-service-time': '0', 'server': 'envoy', 'Via': '1.1 google', 'Alt-Svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000'})
# HTTP response body: {"code":11,"message":"Error, message length too large: found 13762620 bytes, the limit is: 4194304 bytes","details":[]}
 