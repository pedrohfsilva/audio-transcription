from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import shutil
import os
import tempfile

app = FastAPI()

# Configuração de CORS para permitir requisições do frontend (Next.js rodando na porta 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Carregando modelo Whisper (large)... isso pode demorar um pouco na primeira vez.")
# Carrega o modelo 'large' conforme solicitado. 
# Certifique-se de ter VRAM suficiente se tiver GPU, ou RAM suficiente para CPU.
try:
    model = whisper.load_model("large")
    print("Modelo carregado com sucesso!")
except Exception as e:
    print(f"Erro ao carregar o modelo: {e}")
    model = None

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Modelo Whisper não foi carregado corretamente.")

    # Cria um arquivo temporário para salvar o upload
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_filename = temp_file.name

    try:
        # Realiza a transcrição
        result = model.transcribe(temp_filename)
        return {"text": result["text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na transcrição: {str(e)}")
    finally:
        # Limpa o arquivo temporário
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
