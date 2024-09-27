import json
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv
from groq import Groq
import networkx as nx
import matplotlib.pyplot as plt

app = FastAPI()

load_dotenv()

# Retrieve the Groq API key from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize the Groq client
client = Groq(api_key=GROQ_API_KEY)


class Note(BaseModel):
    content: str


def process_text(text: str) -> str:
    # Here you could add any text preprocessing steps
    return text


def generate_mindmap(text: str) -> str:

    example = """{  "nodes": [    {      "id": "Qalaherriaq",      "type": "person",      "name": "Qalaherriaq"    },    {      "id": "Erasmus-Augustine-Kallihirua",      "type": "name",      "name": "Erasmus Augustine Kallihirua"    },    {      "id": "HMS-Assistance",      "type": "vehicle",      "name": "HMS Assistance"    },    {      "id": "Franklin's-Expedition",      "type": "event",      "name": "Franklin's lost expedition"    },    {      "id": "Wolstenholme-Fjord",      "type": "location",      "name": "Wolstenholme Fjord"    },    {      "id": "Society-for-Promoting-Christian-Knowledge",      "type": "organization",      "name": "Society for Promoting Christian Knowledge"    },    {      "id": "St-Augustine's-College",      "type": "school",      "name": "St Augustine's College"    },    {      "id": "Edward-Feild",      "type": "person",      "name": "Edward Feild"    },    {      "id": "Labrador-Inuit",      "type": "group",      "name": "Labrador Inuit"    },    {      "id": "St-John's",      "type": "location",      "name": "St. John's"    }  ],  "edges": [    {      "from": "Qalaherriaq",      "to": "Erasmus-Augustine-Kallihirua",      "label": "Name"    },    {      "from": "Qalaherriaq",      "to": "HMS-Assistance",      "label": "Taken aboard"    },    {      "from": "HMS-Assistance",      "to": "Franklin's-Expedition",      "label": "Search for"    },    {      "from": "HMS-Assistance",      "to": "Wolstenholme-Fjord",      "label": "Rumors of massacre"    },    {      "from": "Qalaherriaq",      "to": "Society-for-Promoting-Christian-Knowledge",      "label": "Custody"    },    {      "from": "Qalaherriaq",      "to": "St-Augustine's-College",      "label": "Studied"    },    {      "from": "Qalaherriaq",      "to": "Edward-Feild",      "label": "Tasked by"    },    {      "from": "Qalaherriaq",      "to": "Labrador-Inuit",      "label": "Mission"    },    {      "from": "Qalaherriaq",      "to": "St-John's",      "label": "Died"    }  ]}"""
    prompt = f"Generate a hierarchical structure for the following text as a JSON object with 'nodes' and 'edges' example: {example} generate for following: {text}"
    max_attempts = 3
    for attempt in range(max_attempts):
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt},
                ],
                model="llama3-8b-8192",
            )
        except Exception as e:
            print(f"Error: {str(e)}")  # Debugging line
            raise HTTPException(
                status_code=500, detail="Error calling language model API"
            )

        # Print the entire response for debugging
        # print(chat_completion)

        # Return the entire content from choices[0]["message"]["content"]
        result = chat_completion.choices[0].message.content
        print(result)
        print("----")
        # Remove everything before the first occurrence of ``` and everything after the last occurrence of ```
        start_index = result.find("```") + len("```")
        end_index = result.rfind("```")
        cleaned_result = result[start_index:end_index].strip()
        cleaned_result = cleaned_result.replace('\\"', '"')
        cleaned_result = cleaned_result.replace("\n", "")

        print(cleaned_result)
        try:
            json.loads(cleaned_result)
            return cleaned_result  # Return if valid JSON
        except json.JSONDecodeError:
            print(f"Attempt {attempt + 1} failed: Invalid JSON content")

    # If all attempts fail, raise an HTTP exception
    raise HTTPException(
        status_code=500, detail="Invalid JSON content in API response after 3 attempts"
    )


def visualize_mindmap(mindmap_data: str, filename: str) -> None:
    try:
        data = json.loads(mindmap_data)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500, detail="Invalid JSON content in API response"
        )

    G = nx.DiGraph()
    for node in data["nodes"]:
        node_id = node.get("id")
        node_label = node.get("name", "Unnamed")
        G.add_node(node_id, label=node_label)
    for edge in data["edges"]:
        from_node = edge.get("from")
        to_node = edge.get("to")
        edge_label = edge.get("label", "")
        G.add_edge(from_node, to_node, label=edge_label)

    pos = nx.spring_layout(G)
    plt.figure(figsize=(12, 8))
    nx.draw(
        G,
        pos,
        with_labels=True,
        labels=nx.get_node_attributes(G, "label"),
        node_size=3000,
        node_color="skyblue",
        font_size=10,
        font_weight="bold",
        edge_color="gray",
    )
    edge_labels = nx.get_edge_attributes(G, "label")
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)

    plt.savefig(filename)
    plt.close()


# @app.post("/create_mindmap")
# async def create_mindmap(note: Note) -> Dict[str, Any]:
#     processed_text = process_text(note.content)
#     mindmap_content = generate_mindmap(processed_text)
#     image_filename = "mindmap.png"
#     # visualize_mindmap(mindmap_content, image_filename)
#     return {
#         "message": "Mindmap created successfully",
#         "data": mindmap_content,
#     }


# if __name__ == "__main__":
#     import uvicorn

#     uvicorn.run(app, host="0.0.0.0", port=8000)
